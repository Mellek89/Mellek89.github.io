const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname,  'public/daten', 'events.json');
console.log("serverMachtSeinen Job");
// Stelle sicher, dass Datei existiert
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Hilfsfunktion: Datei lesen
function readEvents() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

// Hilfsfunktion: Datei schreiben
function writeEvents(events) {
  fs.writeFileSync(dataFile, JSON.stringify(events, null, 2));
}

// Event speichern oder aktualisieren
app.post('/save-event', (req, res) => {
  const newEvent = req.body;
  console.log("📩 Event erhalten:", newEvent);

 app.post('/save-event', (req, res) => {
  const neueEvents = req.body;

  if (!Array.isArray(neueEvents)) {
    return res.status(400).json({ message: "Erwarte ein Array von Events." });
  }

  const gespeicherteEvents = [];

  neueEvents.forEach(eventBlock => {
    if (!eventBlock.month || !Array.isArray(eventBlock.events)) return;

    gespeicherteEvents.push(eventBlock);
  });

  fs.writeFileSync(dataFile, JSON.stringify(gespeicherteEvents, null, 2));
  res.json({ message: "Alle Events gespeichert." });
});


  let events = [];
  try {
    events = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch {}

  const index = events.findIndex(e => e.month === newEvent.month);
  if (index !== -1) {
    events[index] = newEvent;
  } else {
    events.push(newEvent);
  }

  fs.writeFileSync(dataFile, JSON.stringify(events, null, 2));
  res.json({ message: "Gespeichert." });
});


app.get('/download-events', (req, res) => {
  res.download(dataFile, 'events.json');
});


app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
