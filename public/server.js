const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'public/daten', 'events.json');

console.log("📡 Server läuft und wartet auf Events...");

// Wenn Datei nicht existiert → leere Struktur erzeugen
if (!fs.existsSync(dataFile)) {
  const initialData = {
    eventData: [],
    listofRegion: {}
  };
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// POST: JSON-Daten (eventData & listofRegion) speichern
/*app.post('/save-event', (req, res) => {
   console.log("📨 /save-event wurde aufgerufen");
  const daten = req.body;

  if (!daten.eventData || !daten.listofRegion) {
    return res.status(400).json({ message: "❌ Erwarte Objekt mit eventData und listofRegion." });
  }

  fs.writeFileSync(dataFile, JSON.stringify(daten, null, 2));
  res.json({ message: "✅ Struktur gespeichert." });
});*/

// Hilfsfunktion: Datei laden
function loadEvents() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch {
    return { eventData: [], listofRegion: {} };
  }
}

// Hilfsfunktion: Merge Logik
function mergeEventData(existing, incoming) {
  // --- eventData ---
  incoming.eventData.forEach(newMonth => {
    let oldMonth = existing.eventData.find(m => m.month === newMonth.month);

    if (!oldMonth) {
      existing.eventData.push(newMonth);
    } else {
      newMonth.events.forEach(evName => {
        // neuen Eventnamen registrieren
        if (!oldMonth.events.includes(evName)) {
          oldMonth.events.push(evName);
        }
        // sicherstellen, dass es eine Liste gibt
        if (!oldMonth[evName]) {
          oldMonth[evName] = [];
        }
        // nur dann hinzufügen, wenn wirklich Dates drin sind
        if (Array.isArray(newMonth[evName])) {
          newMonth[evName].forEach(date => {
            if (!oldMonth[evName].includes(date)) {
              oldMonth[evName].push(date);
            }
          });
        }
      });
    }
  });

  // --- listofRegion ---
  for (const region in incoming.listofRegion) {
    if (!existing.listofRegion[region]) {
      existing.listofRegion[region] = { regions: [] };
    }
    incoming.listofRegion[region].regions.forEach(evName => {
      if (!existing.listofRegion[region].regions.includes(evName)) {
        existing.listofRegion[region].regions.push(evName);
      }
    });
  }

  return existing;
}


// POST: JSON-Daten speichern (mit Merge!)
app.post('/save-event', (req, res) => {
  console.log("📨 /save-event wurde aufgerufen");

  const incoming = req.body;
  if (!incoming.eventData || !incoming.listofRegion) {
    return res.status(400).json({ message: "❌ Erwarte Objekt mit eventData und listofRegion." });
  }

  const existing = loadEvents();
  const merged = mergeEventData(existing, incoming);

  fs.writeFileSync(dataFile, JSON.stringify(merged, null, 2));

  res.json({ message: "✅ Struktur gespeichert (gemerged)." });
});


// GET: Datei herunterladen
app.get('/download-events', (req, res) => {
  res.download(dataFile, 'events.json');
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
