

const express = require('express');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const path = require('path');

const app = express();
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
  console.log(`➡️ Request: ${req.method} ${req.url}`);
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
function loadEvents() {
  try {
    if (!fs.existsSync(dataFile)) {
      // Datei existiert nicht → leere Struktur zurückgeben

      console.log("DataFileZumLaden:  ",dataFile);
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

        /*if (!oldEvent) {
          oldMonth[evName] = newEvent;
        } else if (role === "admin" || oldEvent.owner === username) {
          oldEvent.dates = [...newEvent.dates];
          oldEvent.owner = oldEvent.owner || username;
          oldEvent.isWeekly = newEvent.isWeekly;
        }*/
              if (!oldEvent) {
          // Neues Event anlegen
          oldMonth[evName] = newEvent;
        } else if (role === "admin" || oldEvent.owner === username) {
          // Event bearbeiten: Termine ersetzen oder ergänzen
          oldEvent.dates = Array.isArray(newEvent.dates) 
            ? [...newEvent.dates]   // oder: [...oldEvent.dates, ...newEvent.dates] für additive Änderung
            : oldEvent.dates;

          // Wochenmarkt-Flag aktualisieren
          oldEvent.isWeekly = newEvent.isWeekly;

          // Owner bleibt unverändert, außer es ist admin, dann kann ggf. geändert werden
          if (role === "admin") oldEvent.owner = newEvent.owner || oldEvent.owner;
        }


        // ✅ Wenn Wochenmarkt deaktiviert → alle anderen Monate updaten
        if (oldEvent?.isWeekly === true && newEvent.isWeekly === false &&  oldMonth[evName] == newEvent[evName] ) {
          
          existing.eventData.forEach(month => {
            if (month !== oldMonth && month[evName]) {
              month[evName].isWeekly = false;

              // Optional: Event aus events-Array entfernen
              month.events = month.events.filter(e => e !== evName);
              delete month[evName];
            }
          });
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
    console.log("📥 Endgültiges payload angekommen:", req.body);

    const { eventData: incomingEventData, listofRegion: incomingList, oldName, newName } = req.body;
    const username = req.user.username;
    const role = req.user.role;

// alle Events dieses Monats
 incomingEventData.forEach(monthObj => {
  console.log(`--- ${monthObj.month} ---`);
  monthObj.events.forEach(evName => {
    const evObj = monthObj[evName];
    if (evObj) {
      console.log("Event:", evName, "Dates:", evObj.dates);
    } else {
      console.warn("⚠️ Keine Eventdaten vorhanden für:", evName);
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
    console.log("✅ Struktur gespeichert (inkl. Umbenennung & Owner).,", incomingWithOwner);
    console.log(JSON.stringify(merged, null, 2));

    res.json({ message: "✅ Struktur gespeichert (inkl. Umbenennung & Owner)." });
  } catch (err) {
    console.error("❌ Fehler im save-event Handler:", err);
    res.status(500).json({ message: "Fehler beim Speichern" });
  }
});


/*app.post("/delete-event", authMiddleware("user"), (req, res) => {
  console.log("BODY:", req.body);
  console.log("🗑️ /delete-event wurde aufgerufen");

  //const incoming = req.body;
  const username = req.user.username;
    const { month, eventName } = req.body; // vom Frontend senden

  let events = loadEvents();

// Nur löschen, wenn der Owner der gleiche ist
 const monthObj = events.eventData.find(m => m.month === month);
  if (!monthObj) {
    return res.status(404).json({ message: "❌ Monat nicht gefunden" });
  }

  const eventObj = monthObj[eventName];
  if (!eventObj) {
    return res.status(404).json({ message: "❌ Event nicht gefunden" });
  }

  // ❗ Berechtigung prüfen
  if (req.user.role !== "admin" && eventObj.owner !== username) {
    return res.status(403).json({ message: "❌ Keine Berechtigung zum Löschen dieses Events" });
  }

  // Event entfernen
monthObj.events = monthObj.events.filter(e => e !== eventName);
  delete monthObj[eventName];

  // Event auch aus listofRegion entfernen
  for (const regionName in events.listofRegion) {
    const region = events.listofRegion[regionName];
    if (region.regions.includes(eventName)) {
      region.regions = region.regions.filter(e => e !== eventName);
    }
    // Optional: leere Regionen entfernen
    if (region.regions.length === 0) delete events.listofRegion[regionName];
  }

  try {
    fs.writeFileSync(dataFile, JSON.stringify(events, null, 2));
    res.json({ message: "✅ Event gelöscht" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Schreiben der Datei" });
  }
});
*/

app.get('/userDaten', authMiddleware("user"), (req, res) => {
  console.log('userDaten wurde aufgerufen!')
    try {
        const filePath = path.join(__dirname, 'daten', 'userDaten.json');
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Datei nicht gefunden" });
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const userData = JSON.parse(rawData);

        /* Optional: nur Daten des eingeloggten Users zurückgeben
        const username = req.user.username;
        console.log(username);
         const filteredData = userData.find(u => u.username === username) || {};

        res.json(filteredData);
        console.log(filteredData);*/

         res.json(userData);  // alle Benutzer zurückgeben
    console.log(userData);
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

    console.log("delete event ausgelöst!");

    // Sperre beim Zugriff auf die Datei
    await fileMutex.runExclusive(async () => {
      console.log(`🔒 Mutex von ${username} übernommen`);
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

      console.log(`🔓 Mutex von ${username} wird freigegeben`);
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


/*app.post("/delete-event", authMiddleware("user"), async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role;
    const { month, eventName } = req.body;

    let found = false;

    // Sperre beim Zugriff auf die Datei
    await fileMutex.runExclusive(async () => {
      const events = loadEvents(); // aktuelle Daten laden

      const eventObjs = [];

      // -------------------------------
      // Fall 1: bestimmter Monat und kein Wochenmarkt
      // -------------------------------
      if (month) {
        const monthObj = events.eventData.find(m => m.month === month);
        if (!monthObj)
          return res.status(404).json({ message: "❌ Monat nicht gefunden" });

        const eventObj = monthObj[eventName];
        if (!eventObj)
          return res.status(404).json({ message: "❌ Event nicht gefunden" });

        if (eventObj.isWeekly === false) {
          if (role !== "admin" && eventObj.owner !== username)
            return res.status(403).json({ message: "❌ Keine Berechtigung" });

          monthObj.events = monthObj.events.filter(e => e !== eventName);
          delete monthObj[eventName];
          found = true;
        } else {
          // Wochenmarkt → alle Monate markieren
          events.eventData.forEach(m => {
            if (m[eventName]) eventObjs.push(m);
          });
        }
      } else {
        // Wenn kein Monat angegeben → global
        events.eventData.forEach(m => {
          if (m[eventName]) eventObjs.push(m);
        });
      }

      // -------------------------------
      // Fall 2: global löschen (Wochenmarkt oder kein month)
      // -------------------------------
      eventObjs.forEach(monthObj => {
        const eventObj = monthObj[eventName];
        if (role === "admin" || eventObj.owner === username) {
          monthObj.events = monthObj.events.filter(e => e !== eventName);
          delete monthObj[eventName];
          found = true;
        }
      });

      if (!found) {
        return res.status(404).json({ message: "❌ Event nicht gefunden oder keine Berechtigung" });
      }

      // Regionenliste bereinigen
      for (const regionName in events.listofRegion) {
        const region = events.listofRegion[regionName];
        if (region.regions.includes(eventName)) {
          region.regions = region.regions.filter(e => e !== eventName);
        }
        if (region.regions.length === 0) delete events.listofRegion[regionName];
      }

      // Datei sicher speichern
      await saveEventsSafe(events);
    });

    res.json({ message: `✅ Event "${eventName}" erfolgreich gelöscht` });
  } catch (err) {
    console.error("❌ Fehler beim Löschen des Events:", err);
    res.status(500).json({ message: "Fehler beim Löschen des Events" });
  }
});

app.post("/delete-event", authMiddleware("user"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("🗑️ /delete-event wurde aufgerufen");

  const username = req.user.username;
  const { month, eventName } = req.body;

  let events = loadEvents();
  let found = false;

  // -------------------------------
  // Fall 1: bestimmter Monat
  // -------------------------------
  if (month) {
   
    const monthObj = events.eventData.find(m => m.month === month);
    if (!monthObj) {
      return res.status(404).json({ message: "❌ Monat nicht gefunden" });
    }

    const eventObj = monthObj[eventName];
    if (!eventObj) {
      return res.status(404).json({ message: "❌ Event nicht gefunden" });
    }

    if (eventObj.isWeekly === false) {
       console.log("gehen hier rein, wenn du kein wochenmarkt bist oder in mehreren Monaten vorkommst",month)
    // Berechtigung prüfen
    if (req.user.role !== "admin" && eventObj.owner !== username) {
      return res.status(403).json({ message: "❌ Keine Berechtigung zum Löschen dieses Events" });
    }

    monthObj.events = monthObj.events.filter(e => e !== eventName);
    delete monthObj[eventName];
    found = true;
  }
}

  // -------------------------------
  // Fall 2: global in allen Monaten
  // -------------------------------
  else {
    events.eventData.forEach(monthObj => {
      if (monthObj[eventName]) {
        const eventObj = monthObj[eventName];
console.log("Kommt er hier an?")
        // Berechtigung prüfen
        if (req.user.role === "admin" || eventObj.owner === username) {
          console.log("hier sollen alle beteiligten Monate gelöscht werden!")
          monthObj.events = monthObj.events.filter(e => e !== eventName);
          delete monthObj[eventName];
          found = true;
        }
      }
    });
  }

  if (!found) {
    return res.status(404).json({ message: "❌ Event nicht gefunden oder keine Berechtigung" });
  }

  // Regionenliste bereinigen
  for (const regionName in events.listofRegion) {
    const region = events.listofRegion[regionName];
    if (region.regions.includes(eventName)) {
      region.regions = region.regions.filter(e => e !== eventName);
    }
    if (region.regions.length === 0) delete events.listofRegion[regionName];
  }

  try {
   // fs.writeFileSync(dataFile, JSON.stringify(events, null, 2));
    await saveEventsSafe(events);
    res.json({ message: month ? 
      `✅ Event "${eventName}" im Monat "${month}" gelöscht` : 
      `✅ Event "${eventName}" in allen Monaten gelöscht` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Fehler beim Schreiben der Datei" });
  }
});*/

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userFile = path.join(__dirname, "daten", "userDaten.json");
  const users = JSON.parse(fs.readFileSync(userFile, "utf-8"));
console.log(users);
  const user = users.find(u => u.username === username && u.password === password);
 console.log(user);
   if (!user) {
   
    return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort" });
  }

  // JWT erstellen (Secret in ENV-Variable besser)
  const token = jwt.sign(
    { username, role: user.role },
    "DEIN_SECRET_KEY",
    { expiresIn: "2h" }
  );

  res.json({ token });
});


// GET: Datei herunterladen
app.get('/download-events', (req, res) => {
  res.download(dataFile, 'events.json');
});

app.get('/events.json', (req, res) => {
  res.json(loadEvents());
});

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
app.listen(PORT, () => {
  console.log(`✅ Der Server läuft auf http://localhost:${PORT}`);
});
app.get('/debug-files', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const files = fs.readdirSync(path.join(__dirname, 'public'));
  res.json(files);
});

