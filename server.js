

const express = require('express');
const fs = require('fs');
const http = require('http');
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const path = require('path');
 const bcrypt = require("bcryptjs");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const onlineUsers = {}; // username -> { role, lastActive }

const PORT = process.env.PORT || 3000; 
const { authMiddleware } = require("./authMiddleware");
const { Mutex } = require('async-mutex');
const fileMutex = new Mutex();




async function saveEventsSafe(events) {
  await fileMutex.runExclusive(() => {
  // Backup erstellen
  fs.writeFileSync(dataFile.replace('.json', '_backup.json'), JSON.stringify(loadEvents(), null, 2));

  // Hauptdatei speichern
  fs.writeFileSync(dataFile, JSON.stringify(events, null, 2));
});

}

app.use((req, res, next) => {
  
  next();
});
app.use(express.json());


// -------------------
// Daten-Datei (außerhalb von public, sicherer)
// -------------------
const dataDir = path.join(__dirname, 'daten');
const dataFile = path.join(dataDir,  'events.json');



// Ordner erstellen, falls nicht vorhanden
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });


(async () => {
  // Datei erstellen, falls nicht vorhanden
  if (!fs.existsSync(dataFile)) {
    const initialData = { eventData: [], listofRegion: {} };
    await saveEventsSafe(initialData);
  }
})();


// -------------------
// Hilfsfunktionen
// -------------------
function broadcastUsers() {
  io.emit(
    "updateUsers",
    Object.entries(onlineUsers).map(([username, info]) => ({
      username,
      role: info.role
    }))
  );
}

function loadEvents() {
  try {
    if (!fs.existsSync(dataFile)) {
      // Datei existiert nicht → leere Struktur zurückgeben

     
      return { eventData: [], listofRegion: {} };
    }
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  } catch (err) {
    console.error("Fehler beim Laden der Events:", err);
    return { eventData: [], listofRegion: {} };
  }
}

function mergeEventData(existing, incoming, username, role) {
  incoming.eventData.forEach(newMonth => {
    let oldMonth = existing.eventData.find(m => m.month === newMonth.month);

    if (!oldMonth) {
      // Neuer Monat → komplett übernehmen
      const monthCopy = { month: newMonth.month, events: [...newMonth.events] };

      newMonth.events.forEach(evName => {
        const evObj = newMonth[evName] || { dates: [], owner: username };
        monthCopy[evName] = {
          dates: Array.isArray(evObj.dates) ? evObj.dates : [],
          owner: evObj.owner || username,
          isWeekly: evObj.isWeekly === true
        };
        
      });

      existing.eventData.push(monthCopy);
    } else {
      // Monat existiert → Events mergen
      newMonth.events.forEach(evName => {
        if (!oldMonth.events.includes(evName)) oldMonth.events.push(evName);

        const oldEvent = oldMonth[evName];
        const newEventRaw = newMonth[evName];

        // Korrekte Deklaration von newEvent
        const newEvent = Array.isArray(newEventRaw)
          ? { dates: newEventRaw, owner: username, isWeekly: false }
          : {
              dates: Array.isArray(newEventRaw?.dates) ? newEventRaw.dates : [],
              owner: newEventRaw?.owner || username,
              isWeekly: newEventRaw?.isWeekly === true
            };

              if (!oldEvent) {
          // Neues Event anlegen
          oldMonth[evName] = newEvent;
        } else if (role === "admin" || oldEvent.owner === username) {
           const wasWeekly = oldEvent.isWeekly;
          // Event bearbeiten: Termine ersetzen oder ergänzen
          oldEvent.dates = Array.isArray(newEvent.dates) 
            ? [...newEvent.dates]   // oder: [...oldEvent.dates, ...newEvent.dates] für additive Änderung
            : oldEvent.dates;

          // Wochenmarkt-Flag aktualisieren
          oldEvent.isWeekly = newEvent.isWeekly;

          // Owner bleibt unverändert, außer es ist admin, dann kann ggf. geändert werden
          if (role === "admin") oldEvent.owner = newEvent.owner || oldEvent.owner;
        


        // ✅ Wenn Wochenmarkt deaktiviert → alle anderen Monate updaten
     if (wasWeekly === true && newEvent.isWeekly === false) {
  existing.eventData.forEach(month => {
    if (month !== oldMonth && month[evName]?.isWeekly) {
      month[evName].isWeekly = false;
      month.events = month.events.filter(e => e !== evName);
      delete month[evName];
    }
  });
}
        }

      });
    }
  });

  // Regionenliste mergen
  for (const region in incoming.listofRegion) {
    if (!existing.listofRegion[region]) existing.listofRegion[region] = { regions: [] };

    existing.listofRegion[region].regions.push(...incoming.listofRegion[region].regions);
    existing.listofRegion[region].regions = [...new Set(existing.listofRegion[region].regions)];
  }

  return existing;
}



// -------------------
// POST-Routen zuerst
app.post('/save-event', authMiddleware("user"), async(req, res) => {
  try {
    

    const { eventData: incomingEventData, listofRegion: incomingList, oldName, newName } = req.body;
    const username = req.user.username;
    const role = req.user.role;

// alle Events dieses Monats
 incomingEventData.forEach(monthObj => {
 
  monthObj.events.forEach(evName => {
    const evObj = monthObj[evName];
    if (evObj) {
     
    } else {
      
    }
  });
});
    if (!incomingEventData || !incomingList) {
      return res.status(400).json({ message: "❌ Erwarte Objekt mit eventData und listofRegion." });
    }

    const existing = loadEvents(); // aktuelle Datei laden

    // 1️⃣ Alte Eventnamen umbenennen/löschen, falls oldName existiert
    if (oldName && newName && oldName !== newName) {
      existing.eventData.forEach(monat => {
        // Event-Objekt umbenennen, Owner und isWeekly übernehmen
        if (monat[oldName]) {
          monat[newName] = {
            ...monat[oldName],
            owner: monat[oldName].owner || username,
            isWeekly: monat[oldName].isWeekly
          };
          delete monat[oldName];
        }

        // Events-Array anpassen
        if (Array.isArray(monat.events)) {
          monat.events = monat.events.map(ev => (ev === oldName ? newName : ev));
        }
      });

      // Regionenliste aktualisieren
      for (const region in existing.listofRegion) {
        existing.listofRegion[region].regions = existing.listofRegion[region].regions.map(ev =>
          ev === oldName ? newName : ev
        );
      }
    }

  

    // 2️⃣ Owner für neue/aktualisierte Events setzen
   const incomingWithOwner = incomingEventData.map(month => {
  const copy = { month: month.month, events: [...month.events] };

  month.events.forEach(evName => {
    const evObj = month[evName];
    if (evObj) {
      // nur wenn evObj existiert, alles übernehmen
      copy[evName] = {
        dates: Array.isArray(evObj.dates) ? evObj.dates : [],
        owner: evObj.owner || username,
        isWeekly: typeof evObj.isWeekly === "boolean" ? evObj.isWeekly : false
      };
    } else {
      // Falls noch nicht vorhanden, neuen Event-Objekt erstellen
      copy[evName] = {
        dates: [],
        owner: username,
        isWeekly: false
      };
    }
  });

  return copy;
});



    // 3️⃣ Neue Daten mergen
    const merged = mergeEventData(
      existing,
      { eventData: incomingWithOwner, listofRegion: incomingList },
      username,
      role
    );

    // 4️⃣ Datei speichern
   // fs.writeFileSync(dataFile, JSON.stringify(merged, null, 2));
     await saveEventsSafe(merged);
   
   

    res.json({ message: "✅ Struktur gespeichert (inkl. Umbenennung & Owner)." });
  } catch (err) {
    console.error("❌ Fehler im save-event Handler:", err);
    console.error("❌ Fehler beim Speichern:", err.message, err.stack);
    res.status(500).json({ message: "Fehler beim Speichern" });
  }
});


app.get('/userDaten', authMiddleware("user"), (req, res) => {
 
    try {
        const filePath = path.join(__dirname, 'daten', 'userDaten.json');
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Datei nicht gefunden" });
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const userData = JSON.parse(rawData);

         res.json(userData);  // alle Benutzer zurückgeben
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Lesen der Datei" });
  }
   
});

app.post("/delete-event", authMiddleware("user"), async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role;
    const { month, eventName } = req.body;

    let found = false;
    let errorResponse = null; // Variable für Fehler innerhalb des Mutex
    let events;

  

    // Sperre beim Zugriff auf die Datei
    await fileMutex.runExclusive(async () => {
      
      events = loadEvents(); // aktuelle Daten laden

      const eventObjs = [];

      // -------------------------------
      // Fall 1: bestimmter Monat
      // -------------------------------
      if (month) {
        const monthObj = events.eventData.find(m => m.month === month);
        if (!monthObj) {
          errorResponse = { status: 404, message: "❌ Monat nicht gefunden" };
          return;
        }

        const eventObj = monthObj[eventName];
        if (!eventObj) {
          errorResponse = { status: 404, message: "❌ Event nicht gefunden" };
          return;
        }

        if (eventObj.isWeekly === false) {
          if (role !== "admin" && eventObj.owner !== username) {
            errorResponse = { status: 403, message: "❌ Keine Berechtigung" };
            return;
          }

          monthObj.events = monthObj.events.filter(e => e !== eventName);
          delete monthObj[eventName];
          found = true;
        } else {
          events.eventData.forEach(m => {
            if (m[eventName]) eventObjs.push(m);
          });
        }
      } else {
        // kein Monat angegeben → global
        events.eventData.forEach(m => {
          if (m[eventName]) eventObjs.push(m);
        });
      }

      // -------------------------------
      // Fall 2: global löschen
      // -------------------------------
      eventObjs.forEach(monthObj => {
        const eventObj = monthObj[eventName];
        if (role === "admin" || eventObj.owner === username) {
          monthObj.events = monthObj.events.filter(e => e !== eventName);
          delete monthObj[eventName];
          found = true;
        }
      });

      // Regionenliste bereinigen
      for (const regionName in events.listofRegion) {
        const region = events.listofRegion[regionName];
        if (region.regions.includes(eventName)) {
          region.regions = region.regions.filter(e => e !== eventName);
        }
        if (region.regions.length === 0) delete events.listofRegion[regionName];
      }

      
    });

    // Fehler nach Mutex prüfen
    if (errorResponse) {
      return res.status(errorResponse.status).json({ message: errorResponse.message });
    }

    if (!found) {
      return res.status(404).json({ message: "❌ Event nicht gefunden oder keine Berechtigung" });
    }

    // Datei speichern (außerhalb von Fehlerfällen)
    await saveEventsSafe(events);

    res.json({ message: month
      ? `✅ Event "${eventName}" im Monat "${month}" gelöscht`
      : `✅ Event "${eventName}" in allen Monaten gelöscht`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Fehler beim Löschen" });
  }
});




app.post("/login",async (req, res) => {
  const { username, password } = req.body;
  const userFile = path.join(__dirname, "daten", "userDaten.json");
  const users = JSON.parse(fs.readFileSync(userFile, "utf-8"));

  //const user = users.find(u => u.username === username && u.password === password);
 

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: "❌ Benutzername nicht gefunden" });

  const passwordOK = await bcrypt.compare(password, user.password);
  if (!passwordOK) return res.status(401).json({ message: "❌ Passwort falsch" });

 if (user.mustChangePassword) {
  // ⚠️ Temporäres Token erstellen – nur zum Passwort ändern gültig
  const tempToken = jwt.sign(
    { username, role: user.role, mustChangePassword: true },
    "DEIN_SECRET_KEY",
    { expiresIn: "5m" } // 5 Minuten Gültigkeit
  );

  return res.status(403).json({
    message: "⚠️ Passwort muss geändert werden",
    token: tempToken
  });
}



   if (!user) {
   
    return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort" });
  }

  // JWT erstellen (Secret in ENV-Variable besser)
  const token = jwt.sign(
    { username, role: user.role },
    "DEIN_SECRET_KEY",
    { expiresIn: "2h" }
  );

  onlineUsers[username] = { role: user.role, lastActive: Date.now() };

  // Update alle Clients
broadcastUsers();

  res.json({ token });
});
app.post("/change-password", authMiddleware("user"), async (req, res) => {
  const { oldPassword, newPassword } = req.body;
 const username = req.user.username; 
  const userFile = path.join(__dirname, "daten", "userDaten.json");
  const users = JSON.parse(fs.readFileSync(userFile, "utf8"));

   console.log("Request Body:", req.body); // zeigt username, oldPassword, newPassword
  const user = users.find(u => u.username === username);

  if (!user){

   
   return res.status(404).json({ message: "User nicht gefunden"});
  }

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(403).json({ message: "Falsches altes Passwort" });

  user.password = await bcrypt.hash(newPassword, 12);
  user.mustChangePassword = false;

  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
  res.json({ message: "✅ Passwort erfolgreich geändert" });
});


// Logout
app.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Kein Token" });

  try {
    const payload = jwt.verify(token,"DEIN_SECRET_KEY");
    delete onlineUsers[payload.username];

broadcastUsers();

    res.json({ message: "✅ Abgemeldet" });
  } catch {
    res.status(401).json({ message: "Ungültiges Token" });
  }
});
// Socket.IO: Client verbindet sich
io.on("connection", (socket) => {
  
 console.log("🔌 Neuer Socket verbunden:", socket.id);

  // Benutzer meldet sich mit Token an (nach Login auf Client-Seite)
  socket.on("registerUser", (token) => {
     console.log("🔑 registerUser aufgerufen mit Token:", token);
    try {
      const payload = jwt.verify(token,"DEIN_SECRET_KEY");
      // Nutzer aktiv halten oder neu hinzufügen
      if (!onlineUsers[payload.username]) {
        onlineUsers[payload.username] = { 
          role: payload.role, 
          lastActive: Date.now(),
          socketId: socket.id
        };
           console.log(`✅ ${payload.username} registriert, Socket: ${socket.id}`);
           broadcastUsers(); // sofort aktuelle Liste senden
      } else {
        onlineUsers[payload.username].socketId = socket.id;
        onlineUsers[payload.username].lastActive = Date.now();
      }
    

    } catch (err) {
      console.warn("❌ Ungültiger Token bei registerUser");
    }
  });

  // Direkt aktuelle Liste senden
 socket.emit(
    "updateUsers",
    Object.entries(onlineUsers).map(([username, info]) => ({
      username,
      role: info.role
    }))
  );

  socket.on("disconnect", () => {
    console.log("disconnected",socket.id);
  });
});

// Automatische Bereinigung inaktiver User
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [username, info] of Object.entries(onlineUsers)) {
    if (now - info.lastActive > 1000 * 60 * 15) { 
       if (info.socketId) {
         console.log(`⏰ ForceLogout an ${username}`);
        io.to(info.socketId).emit("forceLogout"); // Client ausloggen
      }
      delete onlineUsers[username];
      changed = true;
      
    }
  }
  if (changed) io.emit("updateUsers", Object.entries(onlineUsers).map(([username, info]) => ({ 
  username,
  role: info.role
})));

}, 1000 * 60);

app.post("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Kein Token" });

  try {
    const payload = jwt.verify(token,"DEIN_SECRET_KEY");
    console.log("Payload:", payload);
    res.json({ username: payload.username, role: payload.role });
  } catch {
    res.status(401).json({ message: "Ungültiges oder abgelaufenes Token" });
  }
});


server.listen(PORT, () => console.log("Server läuft auf http://localhost:3000"));


app.get('/events.json', (req, res) => {
 
  const data = loadEvents();
  
  
  res.json(data);
 
});
/*app.get('/events.json', (req, res) => {
   console.log("GET /events.json");
  res.json(loadEvents());
});*/


// -------------------

// -------------------


// in server.js – vor app.listen()
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res) {
    // nur 5 Minuten Cache im Browser
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
}));

// -------------------
// Server starten
// -------------------

app.get('/debug-files', (req, res) => { 
  const fs = require('fs');
  const path = require('path');
  const files = fs.readdirSync(path.join(__dirname, 'public'));
  res.json(files);
});

