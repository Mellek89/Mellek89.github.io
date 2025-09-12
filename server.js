

const express = require('express');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 
const { authMiddleware } = require("./authMiddleware");

app.use((req, res, next) => {
  console.log(`➡️ Request: ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.static('public'));

// -------------------
// Daten-Datei (außerhalb von public, sicherer)
// -------------------
const dataDir = path.join(__dirname, 'daten');
const dataFile = path.join(dataDir,  'events.json');



// Ordner erstellen, falls nicht vorhanden
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Datei erstellen, falls nicht vorhanden
if (!fs.existsSync(dataFile)) {
  const initialData = { eventData: [], listofRegion: {} };
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// -------------------
// Hilfsfunktionen
// -------------------
function loadEvents() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch {
    return { eventData: [], listofRegion: {} };
  }
}

function mergeEventData(existing, incoming, username, role) {
  incoming.eventData.forEach(newMonth => {
    // passenden Monat im bestehenden Datensatz suchen
    let oldMonth = existing.eventData.find(m => m.month === newMonth.month);

    if (!oldMonth) {
      // neuer Monat → komplett übernehmen
       const monthCopy = { month: newMonth.month, events: [...newMonth.events] };

      // Events ins neue Schema {dates, owner} konvertieren
      newMonth.events.forEach(evName => {
        const evObj = newMonth[evName] || { dates: [], owner: username };
        monthCopy[evName] = {
          dates: Array.isArray(evObj.dates) ? evObj.dates : [],
          owner: username
        };
      });

      existing.eventData.push(monthCopy);
    } else {
      // Monat existiert schon → Events mergen
      newMonth.events.forEach(evName => {
        if (!oldMonth.events.includes(evName)) {
          oldMonth.events.push(evName);
        }
        /*const newEventObj = newMonth[evName] || { dates: [], owner: username };
        const newEventDates = newEventObj.dates || [];*/
        const oldEvent = oldMonth[evName];
        const newEventObjRaw = newMonth[evName]; // kann Array oder Objekt sein
       const newEventObj = Array.isArray(newEventObjRaw)
  ? { dates: newEventObjRaw, owner: username, isWeekly: false } // Array → Objekt konvertieren
  : { 
      dates: Array.isArray(newEventObjRaw?.dates) ? newEventObjRaw.dates : [], 
      owner: newEventObjRaw?.owner || username,
      isWeekly: newEventObjRaw?.isWeekly === true // Hier das Flag übernehmen
    };

        const newEventDates = newEventObj.dates || [];
if (!oldEvent) {
  oldMonth[evName] = newEventObj; 
  console.log(newEventObj + "newEventObj");
} else if (role === "admin" || oldEvent.owner === username) {
  oldEvent.dates = [...newEventObj.dates];
  oldEvent.owner = oldEvent.owner || username;
  oldEvent.isWeekly = newEventObj.isWeekly; 
}

        
      });
    }
  });

  // Regionenliste mergen
  for (const region in incoming.listofRegion) {
    if (!existing.listofRegion[region]) {
      existing.listofRegion[region] = { regions: [] };
    }
    existing.listofRegion[region].regions.push(
      ...incoming.listofRegion[region].regions
    );
    existing.listofRegion[region].regions = [
      ...new Set(existing.listofRegion[region].regions)
    ];
  }

  return existing;
}


// -------------------
// POST-Routen zuerst
app.post('/save-event', authMiddleware("user"), (req, res) => {
  console.log("📨 /save-event aufgerufen", req.body);

  const { eventData: incomingEventData, listofRegion: incomingList } = req.body;
  const username = req.user.username;
  const role = req.user.role;

  if (!incomingEventData || !incomingList) {
    return res.status(400).json({ message: "❌ Erwarte Objekt mit eventData und listofRegion." });
  }

  const existing = loadEvents();

  // --- Owner für neue Events setzen ---
  const incomingWithOwner = incomingEventData.map(month => {
    const copy = { month: month.month, events: [...month.events] };

    month.events.forEach(evName => {
      const evObj = month[evName] || { dates: [] };
      copy[evName] = {
        dates: Array.isArray(evObj.dates) ? evObj.dates : [],
        owner: username,        // jeder User wird Owner seiner Events
        isWeekly: evObj?.isWeekly === true
      };
    });

    return copy;
  });

  // --- Daten mergen ohne alte Owner-Prüfung ---
  const merged = mergeEventData(existing, { eventData: incomingWithOwner, listofRegion: incomingList }, username, role);

  // --- In Datei schreiben ---
  fs.writeFileSync(dataFile, JSON.stringify(merged, null, 2));

  console.log("incomingWithOwner", incomingWithOwner);
  res.json({ message: "✅ Struktur gespeichert (gemerged)." });
});


app.post("/delete-event", authMiddleware("user"), (req, res) => {
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
// Statische Dateien zuletzt
// -------------------
app.use(express.static('public'));

// -------------------
// Server starten
// -------------------
app.listen(PORT, () => {
  console.log(`✅ Der Server läuft auf http://localhost:${PORT}`);
});
