
// getting new date, current year and month

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth(),
currDay = date.getDay();


const currentDate = document.querySelector(".current-date");
let daysTag = document.querySelector(".days");

let prevNextIcon = document.querySelectorAll(".icons span");
let daysInput = document.querySelector(".days ").children;
let eventsInput = document.querySelector(".slideEventcontainer");
let numberOfSlides = document.querySelector(".numberOfSlide");
let SlideCounter = 0;
let datesOfEvents = []; 
let eventId = ""; 
let dayOfEvent = null;
let daysOfEvents = [];
let recurringDaysOfEvents = [];
let recurringThuesOfEvents = [];
let actualEvents = [];
let eSelector = [];
let keyValueOfEvents = [];
let recurringEventsOfCurrentMonth=[];
let recurringEvents=[];
let recurringMarketDates = [];

let prevNextSlideshow = document.querySelectorAll(".slideshowIcons span");
let dropdownHeader = document.getElementById("dropdownMenu");
let eventData = [];

let ehrenEl ;
let seltersEl ;
//Variablen für Eventauswahl für admin
let listofevents =[];
let listofRegion = {};
let listofRegionGlobal = [];
const selectedDaysForEvent = [];
let tmp = [];
let formattedEventname = '';
let region = '';



var endOfEvent= null;

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
				"Oktober", "November", "Dezember"]

		async function getData() {
					 const url = `/events.json`; 
					try {
					  const response = await fetch(url);
					 
					  if (!response.ok) {
						throw new Error(`Response status: ${response.status}`);
					  }
				  
					  const jsontest = await response.json();
				
					  
					  return jsontest; 
					  
					} catch (error) {
					  console.error(error.message);
					}
					
				  }
 

noneFormAttributes();
let eventDataGlobal = [];

async function loadEvents() {
  const a = await getData();
  eventDataGlobal = normalizeEventData(a.eventData, currYear);
}
function noneFormAttributes(){

   let prevView = document.getElementById("prevView");
      if (prevView) {
        prevView.style.display = "none";
      }
       let eventName = document.getElementById("eventName");
      if (eventName) {
        eventName.style.display = "none";
      }
      let weekmarket = document.getElementById("Weekmarket");
      if (weekmarket) {
        weekmarket.style.display = "none";
      }	
      
      let createBtn = document.getElementById("create");
      if(createBtn){
      createBtn.style.display = "none";
      }
        
      let period = document.getElementById("period");
      if(period){
      period.style.display = "none";
      }
      		
}

function getFormAttributes(){
  let prevView = document.getElementById("prevView");
      if (prevView) {
        prevView.style.display = "block";
      }
       let eventName = document.getElementById("eventName");
      if (eventName) {
        eventName.style.display = "block";
      }
      let weekmarket = document.getElementById("Weekmarket");
      if (weekmarket) {
        weekmarket.style.display = "block";
      }	
      if(saveBtn){
      let saveBtn = document.getElementById("create");
      saveBtn.style.display = "block";
      }
        
      let period = document.getElementById("period");
      if(period){
      period.style.display = "block";
      }
      		
}


			



// Globale Variablen für die Bereichsauswahl
let selectedStart = null;
let selectedEnd = null;
let period = "";

// Klick-Handler für Tage
function onDayClick(day) {
    eventId = '';
    recurringDaysOfEvents.length = 0;
    datesOfEvents.length = 0;
     getFormAttributes();

    const clickedDate = new Date(currYear, currMonth, day);

    if (!selectedStart || selectedEnd) {
        // 👉 Erster Klick ODER Reset
        selectedStart = { day, month: currMonth, year: currYear };
        selectedEnd = null;

        period = `<strong>Zeitraum:</strong> ${day}. ${currMonth + 1} (${currYear})`;
        document.getElementById('eventTemp').innerHTML = period;
    } else if (!selectedEnd) {
        // 👉 Zweiter Klick = Enddatum setzen
        selectedEnd = { day, month: currMonth, year: currYear };

        // Start- und Enddatum als Date-Objekte
        let startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
        let endDate = new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day);

        // Falls Ende vor Start liegt → tauschen
        if (endDate < startDate) {
            [startDate, endDate] = [endDate, startDate];
            [selectedStart, selectedEnd] = [selectedEnd, selectedStart];
        }

        // Zeitraum-Text
        period = `<strong>Zeitraum:</strong> ${selectedStart.day}. ${selectedStart.month + 1} ${selectedStart.year} - ${selectedEnd.day}. ${selectedEnd.month + 1} ${selectedEnd.year}`;
        document.getElementById('eventTemp').innerHTML = period;
    }

    renderCalendar(); // Kalender neu zeichnen
}

const renderCalendar = () => {
    const firstDateOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    const startDate = selectedStart
        ? new Date(selectedStart.year, selectedStart.month, selectedStart.day)
        : null;
    const endDate = selectedEnd
        ? new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day)
        : startDate;

    // Vortage des Vormonats
    for (let i = firstDateOfMonth; i > 0; i--) {
        const inactiveLastDays = lastDateOfLastMonth - i + 1;
        liTag += `<li class="inactive">${inactiveLastDays}</li>`;
    }

    // Tage des aktuellen Monats
    for (let i = 1; i <= lastDateOfMonth; i++) {
        let className = "";
        const currentDate = new Date(currYear, currMonth, i);

        // Heute hervorheben
        if (
            i === new Date().getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear()
        ) {
            className = "active";
        }

        // Bereich hervorheben (Start-End)
        if (startDate && endDate && currentDate >= startDate && currentDate <= endDate) {
            className += (className ? " " : "") + "circle";
        }

        // Wiederkehrende Events markieren
        if (recurringDaysOfEvents && recurringDaysOfEvents.length > 0) {
            for (let j = 0; j < recurringDaysOfEvents.length; j += 2) {
                const day = recurringDaysOfEvents[j];
                const month = recurringDaysOfEvents[j + 1] - 1; // JS-Monate 0-basiert
                if (month === currMonth && day === i) {
                    className += (className ? " " : "") + "circle";
                }
            }
        }
         // Termine markieren (datesOfEvents)
       if (Array.isArray(datesOfEvents) && datesOfEvents.length > 0) {
  for (const d of datesOfEvents) {
    const [dayStr, monthStr] = d.split(".");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    if (day === i && month === currMonth + 1) {
      className += (className ? " " : "") + "circle";
      break; // nur einmal markieren
    }
  }
}


        liTag += `<li data-day="${i}" class="${className}">${i}</li>`;
    }

    // Resttage des Monats
    for (let i = lastDayOfMonth + 1; i <= 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    // Klick-Events neu binden
    document.querySelectorAll(".days li").forEach(li => {
        const day = parseInt(li.dataset.day, 10);
        if (!isNaN(day)) {
            li.onclick = () => onDayClick(day); // direkte Bindung
        }
    });
};






function clearMessage() {
  const ausgabe = document.getElementById('ausgabe');
  if (ausgabe) {
    ausgabe.innerHTML = "";
  }
}



if (window.location.pathname.endsWith("admin.html")){
	 // Formularauswertung
  const mittelrhein = document.getElementById('MittelrheinAdmin');
	const oberrhein = document.getElementById('OberrheinAdmin');

document.getElementById('eventname').addEventListener('focus', () => {
    clearMessage() ;
});
	

function handleWeekmarkets(){
	const weekmarket = document.getElementById("weekmarket");
	const marketname = document.getElementById("eventname");
	const mittelrhein = document.getElementById("MittelrheinAdmin");
	const oberrhein = document.getElementById("OberrheinAdmin");
	let name = "";
	let region = "";

	 if (!mittelrhein.checked && !oberrhein.checked) {
        alert("Bitte eine Region auswählen.");
        return;
    }
		if(weekmarket.checked){
				name = marketname.value;
				weekmarket.value = true;
		}else{
			name = marketname.value;
				weekmarket.value = false;

		}
		if (mittelrhein.checked ) {   
			region = mittelrhein.value;

			}else if (oberrhein.checked ) {   
			region = oberrhein.value;
					
		}
		
		 
    if (typeof listofRegion === 'undefined') {
        alert("Fehler: listofRegion ist nicht definiert!");
        return;
    }
 // ✅ Initialisiere Regionseintrag, falls nicht vorhanden
    if (!listofRegion[region]) {
        listofRegion[region] = { regions: [] };
    }

		// Globale JSON-Datenstruktur (z.B. im Fenster oder in einem Modul definiert)
    if (weekmarket.checked) {
        // Wenn Wochenmarkt: In listofRegion einfügen
        if (!listofRegion[region].regions.includes(name)) {
            listofRegion[region].regions.push(name);
        }
    }

    return {
        name: name,
        region: region,
        isWeekly: weekmarket.checked
    };
		
		

	}
/*async function ladeDatenFürRegion(region) {

if (!region) {
    console.warn("⚠️ Keine Region angegeben für ladeDatenFürRegion");
    return;
  }

		 await loadRegionData();

      if (!listofRegionGlobal) {
        console.warn(`Region "${region}" nicht gefunden.`);
      	
        return;
      }
      renderAdminDropdown();
      await renderEvents();
			const regionData = listofRegionGlobal[region];
			if (!regionData) {
			console.warn(`❌ Keine Daten für Region "${region}" gefunden.`);
			showDropdownMenu(listofRegionGlobal,region); 
			
      }else {

			console.log("🔎 Region übergeben:", region);
			console.log("🔎 Daten für Region:", listofRegionGlobal[region]);

			console.log("📤 Übergabe an Dropdown:", regionData);
			showDropdownMenu(listofRegionGlobal,region); 

       
      } 
   
} */
async function ladeDatenFürRegion(region) {
  if (!region) {
    console.warn("⚠️ Keine Region angegeben für ladeDatenFürRegion");
    return;
  }

  await loadRegionData();

  if (!listofRegionGlobal) {
    console.warn(`Region "${region}" nicht gefunden.`);
    return;
  }

  const regionData = listofRegionGlobal[region];

  if (!regionData) {
    console.warn(`❌ Keine Daten für Region "${region}" gefunden.`);
    showDropdownMenu({}, region); // leeres Objekt anzeigen
    return;
  } 
    console.log("🔎 Region übergeben:", region);
    console.log("🔎 Daten für Region:", regionData);


  //renderAdminDropdown();
  await renderEvents();
   
    showDropdownMenu({ [region]: regionData }, region);
}

	

oberrhein.addEventListener('change', async () => {
  datesOfEvents.length= 0;
    let createBtn = document.getElementById("create");
      if (createBtn) {
        createBtn.style.display = "block";
      }
    prevView = document.getElementById("prevView");
      if (prevView) {
        prevView.style.display = "none";
      }
        eventName = document.getElementById("eventName");
      if (eventName) {
        eventName.style.display = "none";
      }
       weekmarket = document.getElementById("Weekmarket");
      if (weekmarket) {
        weekmarket.style.display = "none";
      }
  if (oberrhein.checked) {
    resetEventState(); // 👉 Zustände leeren
    region = oberrhein.value;

    try {
      await ladeDatenFürRegion(region);  // lädt Daten + baut Dropdown
      renderCalendar();                  // danach Kalender zeichnen
    } catch (err) {
      console.error("❌ Fehler beim Laden der Oberrhein-Daten:", err);
    }
  }
});

mittelrhein.addEventListener('change', async () => {
    let createBtn = document.getElementById("create");
      if (createBtn) {
        createBtn.style.display = "block";
      }
   prevView = document.getElementById("prevView");
      if (prevView) {
        prevView.style.display = "none";
      }
        eventName = document.getElementById("eventName");
      if (eventName) {
        eventName.style.display = "none";
      }
       weekmarket = document.getElementById("Weekmarket");
      if (weekmarket) {
        weekmarket.style.display = "none";
      }
   datesOfEvents.length= 0;
  if (mittelrhein.checked) {
    resetEventState(); 
    region = mittelrhein.value;

    try {
      await ladeDatenFürRegion(region);  // lädt Daten + baut Dropdown
      renderCalendar();
    } catch (err) {
      console.error("❌ Fehler beim Laden der Mittelrhein-Daten:", err);
    }
  }
});

// 👉 kleine Hilfsfunktion
function resetEventState() {
  eventId = '';
  selectedStart = null;
  selectedEnd = null;
  period = '';
  document.getElementById('eventTemp').innerHTML = period; // HTML leeren
}


      
 document.getElementById('zeitraumForm').addEventListener('submit', function(e) {
      e.preventDefault();
		handleStrings();
      const eventname = document.getElementById('eventname').value.trim();
	   let eventnametmp = eventname;
	   eventnametmp= formattedEventname;
     let zeitraumInform = document.getElementById('eventTemp').textContent.trim();
      if (!zeitraumInform ) {
        alert("Bitte einen Zeitraum wählen.");
        return;
      }
	  
	
      if (!eventnametmp ) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }
    			// Vorschau anzeigen
    const { name, region, isWeekly } = handleWeekmarkets();
	  const finalName =  eventnametmp;
		
					const zeitraum = `${selectedStart.day}. ${selectedStart.month+1}.` + 
          (selectedEnd ?` -  ${selectedEnd.day}. ${selectedEnd.month+1}.` : '' ) 
          + `(${currYear})`;
      if (selectedStart == null){
        
        alert("Bitte ein Startdatum für den Wochenmarkt angeben."); 
        return;
      }
					showConfirmation(region, eventnametmp, zeitraum, finalName, currMonth, currYear, isWeekly);

				
				
		
					
				
				const saveBtn= document.getElementById('saveBtn');
				  saveBtn.addEventListener('click', async function handler() {
					
					await speichernEvent(finalName, currMonth, region,isWeekly);
					    // Events in Liste anzeigen
  					//ladeDatenFürRegion(region);
				
					// Nur einmal ausführen: Eventlistener wieder entfernen
					saveBtn.removeEventListener('click', handler);
				});
				
			


    });
	function showConfirmation(region, eventName, zeitraum, finalName, currMonth, currYear, isWeekly) {
    const modal = document.getElementById("confirmModal");
    document.getElementById("regionField").textContent = region;
    document.getElementById("eventField").textContent = eventName;
    document.getElementById("zeitraumField").textContent = zeitraum;
    const weekmarketEl = document.getElementById("showWeekmarket");

    console.log("isWeekly:", isWeekly);
    if (isWeekly) {
 weekmarketEl.style.display = "block";
  weekmarketEl.textContent = "Dieses Event ist ein Wochenmarkt";
} else {
  weekmarketEl.style.display = "none";
}
    // Modal öffnen
    modal.showModal();

    // Buttons
    const saveBtn = document.getElementById('saveBtn');
    const udBtn = document.getElementById('udBtn');
    

    // Save
    const saveHandler = async () => {
      await speichernEvent(finalName, currMonth, region, isWeekly);
      ladeDatenFürRegion(region);
      modal.close();
      saveBtn.removeEventListener("click", saveHandler);
    };
 
    saveBtn.addEventListener("click", saveHandler);

    // Abbrechen
    udBtn.onclick = () => {
      modal.close();
    };
   
  }




}


async function showDeleteConfirmation(region, eventName, zeitraum, currYear, isWeekly) {
   
 await loadEvents();

  recurringDaysOfEvents.length = 0;
  datesOfEvents.length = 0;

      let found = 0;
      isWeekly = false;

     // Monatsdaten holen
    const monatName = getMonatsname(currMonth + 1);
    let monatObj = eventDataGlobal.find(m => m.month === monatName);

    if (!monatObj) {
      console.warn("Kein Monatsobjekt gefunden:", monatName);
      return;
    }
    for ( const m of eventDataGlobal) {
  found += m.events.filter(ev => ev === eventName).length;
  if (found > 1) {
    isWeekly = true;
  }
}

    zeitraum = "";
    if (monatObj[eventName]) {
       const evObj = monatObj[eventName];
       const termine = evObj.dates;

       selectedStart = termine[0];
       selectedEnd = termine[termine.length - 1];

      const startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
      const endDate = new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day);

      zeitraum = `${startDate.getDate()}. ${startDate.getMonth() + 1}` +
        (endDate && endDate.getTime() !== startDate.getTime()
          ? ` - ${endDate.getDate()}. ${endDate.getMonth() + 1}`
          : "") +
        ` (${currYear})`;
    }
   const modal = document.getElementById("confirmDeleteModal");
   const weekmarketEl = document.getElementById("weekmarketForDel");
    document.getElementById("regionFieldForDel").textContent = region;
    document.getElementById("eventFieldForDel").textContent = eventName;
    document.getElementById("zeitraumFieldForDel").textContent = zeitraum;

    if (isWeekly== true) {
       weekmarketEl.style.display = "list-item"; 
    }else{  
      weekmarketEl.style.display = "none";}
   
    

    // Modal öffnen
    modal.showModal();


      const delBtn = document.getElementById('delBtn');
      const cancel = document.getElementById('cancel');
      const deleteHandler = async () => {
          loeschenEvent(eventName, region);
          ladeDatenFürRegion(region);

        };
   
  // Vorher alte Handler entfernen, damit sie nicht mehrfach hängen
    delBtn.replaceWith(delBtn.cloneNode(true));
    cancel.replaceWith(cancel.cloneNode(true));

    // Neue Referenzen holen
    const newDelBtn = document.getElementById("delBtn");
    const newCancel = document.getElementById("cancel");

    newDelBtn.addEventListener("click", async () => {
        await loeschenEvent(eventName, region);
      
        modal.close();
        zeitraum ='';
    });
    newCancel.addEventListener("click", async () => {
       modal.close();
      return;
    });

     delBtn.addEventListener("click",deleteHandler);
  
  }


async function speichernEvent(name, month, region, weekmarket) {
    console.log("📦 speichernEvent aufgerufen mit:", name, month, region, weekmarket);
 // Token holen
  const token = localStorage.getItem("jwt");
  if (!token) {
    console.error("❌ Kein Token gefunden, bitte einloggen!");
    return;
  }

  // Payload aus JWT
  function parseJwt(token) {
    try {
      const base64Payload = token.split('.')[1];
      return JSON.parse(atob(base64Payload));
    } catch (err) {
      console.error("❌ JWT konnte nicht geparst werden:", err);
      return null;
    }
  }

  const payload = parseJwt(token);
  if (!payload || !payload.username) {
    console.error("❌ Kein Username im Token gefunden");
    return;
  }
  const username = payload.username;
  const isWeekly = weekmarket;
console.log("User" + username );
 
    
    await loadRegionData();

    if (!selectedStart) return;

    // Kopien der globalen Daten
    let eventData = [...eventDataGlobal];
    let listofRegion = { ...listofRegionGlobal };

    // 🔹 Alte Daten für dieses Event zuverlässig entfernen
eventData.forEach(monat => {
    // Event aus events-Liste entfernen
    if (Array.isArray(monat.events)) {
        monat.events = monat.events.filter(ev => ev !== name);
    }

    // Einzelne Tage des Events löschen
    if (monat.hasOwnProperty(name)) {
        delete monat[name];
    }
});



    // Alte Event-Zuordnung in Regionen entfernen
    for (const reg in listofRegion) {
        listofRegion[reg].regions = listofRegion[reg].regions.filter(ev => ev !== name);
    }

    // 2️⃣ Neuen Zeitraum berechnen
    const startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
    const endDate = selectedEnd
        ? new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day)
        : startDate;

    let current = new Date(startDate);
    while (current <= endDate) {
        const monthName = months[current.getMonth()]; // z.B. "September"
        let monatObj = eventData.find(m => m.month === monthName);


        if (!monatObj) {
            monatObj = { month: monthName, events: [] };
            eventData.push(monatObj);
        }

        // Event in events-Liste eintragen, falls noch nicht vorhanden
        if (!monatObj.events.includes(name)) {
            monatObj.events.push(name);
        }

        
   console.log("📦 Speichere Event:", name, "in Monat:", monthName);
  console.log("👉 Events jetzt:", monatObj.events);
  console.log("👉 Keys jetzt:", Object.keys(monatObj));
  const tagString = `${current.getDate()}.${current.getMonth() + 1}`;
      
       
if (!monatObj[name]) {
  monatObj[name] = {
    dates: [],
    owner: username,
    isWeekly: weekmarket === true
  };
} else {
  // Wenn das Event schon existiert, sicherstellen, dass isWeekly gesetzt ist
  monatObj[name].isWeekly = weekmarket === true;
}
// Tag hinzufügen, falls noch nicht vorhanden
 
if (!monatObj[name].dates.includes(tagString)) {
  monatObj[name].dates.push(tagString);
}

        // Tage innerhalb des Monats sortieren
        monatObj[name].dates.sort((a, b) => {
            const [dayA, monthA] = a.split('.').map(Number);
            const [dayB, monthB] = b.split('.').map(Number);
            return dayA - dayB;
        });

        current.setDate(current.getDate() + 1);
    }

    // --- Wochenmärkte separat behandeln ---
    if (weekmarket === true) {
        await dateOfRecurringEvents(name,username );
    }

    // --- Regionenliste pflegen ---
    if (!listofRegion[region]) {
        listofRegion[region] = { regions: [] };
    }
    if (!listofRegion[region].regions.includes(name)) {
        listofRegion[region].regions.push(name);
    }

    // --- Globale Daten aktualisieren ---
    eventDataGlobal = eventData;
    listofRegionGlobal = listofRegion;

    // --- UI zurücksetzen ---
    document.getElementById('bestaetigung').innerHTML = '';
    document.getElementById('zeitraumForm').reset();

    // --- Daten an Server senden ---

    const payloadToServer  = {
  eventData: eventDataGlobal,
  listofRegion: listofRegionGlobal
};
    try {
        await fetch('/save-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
             },
             
            body: JSON.stringify(payloadToServer )
        });
        console.log("JWT im Speicher:", token);

        // --- UI aktualisieren ---
        await renderEvents();
        await showDropdownMenu(listofRegionGlobal, region);
        renderCalendar();

    } catch (err) {
        console.error("❌ Fehler in speichernEvent:", err);
    }
}





function updateEvent(name, month, newDates, region) {
  const monatName = getMonatsname(month + 1);
  let monatObj = eventData.find(e => e.month === monatName);
  
  if (!monatObj || !monatObj[name]) return;

  // Aktualisiere die Termine
  monatObj[name] = newDates;

  // Optional: Backend erneut speichern
  saveCombinedData();
 
}

function checkEventConsistency(eventData) {
  eventData.forEach(monatObj => {
    const keys = Object.keys(monatObj).filter(k => !["month", "events", "owner"].includes(k));
    const list = monatObj.events;
    console.log("🧩 Monat:", monatObj.month);
    console.log("   Keys :", keys);
    console.log("   Liste:", list);
    const diff1 = list.filter(l => !keys.includes(l));
    const diff2 = keys.filter(k => !list.includes(k));
    if (diff1.length || diff2.length) {
      console.warn("⚠️ Inkonsistenz gefunden!", { diff1, diff2 });
    }
  });
}
async function loeschenEvent(name, region) {
    await loadRegionData();
    let eventData = [...eventDataGlobal];
    let listofRegion = { ...listofRegionGlobal };

    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("❌ Kein Token gefunden, bitte einloggen!");
        return;
    }

    // 🔹 Monat finden
    const monatObj = eventData.find(m => Array.isArray(m.events) && m.events.includes(name));
    if (!monatObj) {
        console.warn(`⚠️ Event "${name}" nicht gefunden!`);
        return;
    }

    // 🔹 Payload nur für dieses Event
    const payload = {
        month: monatObj.month,
        eventName: name
    };
    console.log("📤 Sende an Server:", payload);

    try {
        const response = await fetch('/delete-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`);
        const data = await response.json();
        console.log('✅ Server-Antwort:', data.message);

        // 🔹 Lokale Daten anpassen
        monatObj.events = monatObj.events.filter(ev => ev !== name);
        delete monatObj[name];

        if (region && listofRegion[region] && Array.isArray(listofRegion[region].regions)) {
            listofRegion[region].regions = listofRegion[region].regions.filter(ev => ev !== name);
            if (listofRegion[region].regions.length === 0) delete listofRegion[region];
        }

        eventDataGlobal = eventData;
        listofRegionGlobal = listofRegion;

        // 🔹 UI aktualisieren
        period = '';
        selectedStart = null;
        selectedEnd = null;
        eventId = '';
        document.getElementById('eventTemp').innerHTML = period;

        await renderEvents();
        if (listofRegionGlobal[region]) {
            showDropdownMenu(listofRegionGlobal, region);
        } else {
            showDropdownMenu(listofRegionGlobal);
        }
        renderCalendar();

    } catch (error) {
        console.error('❌ Fehler beim Löschen:', error);
    }
}







function handleStrings(){

		 let inputElement = document.getElementById("eventname");
		 let string =  inputElement.value;
		

		if(string.length <= 20){
			
			  let formatted = string;
			  formattedEventname= formatted;

    } else {
        // Suche das nächste Leerzeichen nach Position 20
        let breakPoint = string.indexOf(" ", 20);

        // Wenn kein Leerzeichen gefunden, dann ganzen String nehmen
        if (breakPoint === -1) breakPoint = string.length;

        // Füge Zeilenumbruch ein
        let firstLine = string.slice(0, breakPoint);
        let secondLine = string.slice(breakPoint + 1); // ohne Leerzeichen

       let formatted = firstLine + "<br/>" + secondLine;
       
		formattedEventname= formatted;
		
    }
		

		
	}




function getMonatsname(monatNummer) {
  const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });
  const date = new Date(2025, parseInt(monatNummer) - 1, 1);
  return formatter.format(date); // z. B. "März"
}



//renderAdminDropdown();
//initAdminDropdownListener();
// --- Admin Dropdown rendern ---
async function renderAdminDropdown() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  if (!dropdownMenu) return;

  // 1️⃣ Aktuelle Auswahl merken
  const selectedName = dropdownMenu.querySelector(".dropdown-item.active")?.dataset.name;

  // 2️⃣ Daten holen
  const a = await getData();
  eventDataGlobal = a.eventData;

  // 3️⃣ Dropdown leeren
  dropdownMenu.innerHTML = "";

  // 4️⃣ Items rendern
  const monatName = getMonatsname(currMonth + 1);
  const monatObj = eventDataGlobal.find(m => m.month === monatName);
  if (!monatObj) return;

  monatObj.events.forEach(marktName => {
    const evObj = monatObj[marktName];
    const displayName = marktName; // Optional schöner Name

    // Wrapper
    const itemDiv = document.createElement("div");
    itemDiv.className = "dropdown-item";
    itemDiv.dataset.name = marktName;
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.padding = "4px 8px";

    // Name
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = displayName;
    itemDiv.appendChild(nameSpan);

    // Admin-Buttons
    if (window.location.pathname.endsWith("admin.html")) {
      const btnWrapper = document.createElement("div");
      btnWrapper.style.display = "flex";
      btnWrapper.style.gap = "6px";

      const updateBtn = document.createElement("button");
      updateBtn.type = "button";
      updateBtn.className = "update-btn";
      updateBtn.textContent = "✎";
      updateBtn.title = "Bearbeiten";
      Object.assign(updateBtn.style, {
        background: "#4CAF50",
        border: "none",
        color: "white",
        padding: "4px 6px",
        borderRadius: "4px",
        cursor: "pointer"
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "🗑";
      deleteBtn.title = "Löschen";
      Object.assign(deleteBtn.style, {
        background: "#f44336",
        border: "none",
        color: "white",
        padding: "4px 6px",
        borderRadius: "4px",
        cursor: "pointer"
      });

      btnWrapper.appendChild(updateBtn);
      btnWrapper.appendChild(deleteBtn);
      itemDiv.appendChild(btnWrapper);
    }

    // Auswahl wiederherstellen
    if (selectedName === marktName) itemDiv.classList.add("active");

    dropdownMenu.appendChild(itemDiv);
  });
}

function initAdminDropdownListener() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  if (!dropdownMenu) return;

  dropdownMenu.addEventListener("click", (e) => {
    const item = e.target.closest(".dropdown-item");
    if (!item) return;

    // alle anderen entfernen
    dropdownMenu.querySelectorAll(".dropdown-item").forEach(el => el.classList.remove("active"));

    // nur das geklickte hervorheben
    item.classList.add("active");

    // ausgewähltes Event setzen
    const marktName = item.dataset.name;
    const monatName = getMonatsname(currMonth + 1);
    const monatObj = eventDataGlobal.find(m => m.month === monatName);
    if (monatObj && monatObj.events.includes(marktName)) {
      eventId = marktName;
      const evObj = monatObj[marktName];
      datesOfEvents = evObj ? evObj.dates : [];
    }

    renderCalendar();
  });
}

function showEvents(currMonth) {
 
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.addEventListener("click", async e => {
      console.log(e);
       e.preventDefault(); 
      const item = e.target.closest(".dropdown-item");
      if (!item) return;
      const createBtn = document.getElementById("create");
      if(createBtn){
        createBtn.style.display = "block";
      }
      
      selectedStart = null;
      selectedEnd = null;
     
      // Alle anderen im aktuellen Menü zurücksetzen
    menu.querySelectorAll(".dropdown-item").forEach(el => {
    if (el !== item) el.classList.remove("active");
});

item.classList.add("active");

      // Daten holen
      const a = await getData();
      eventDataGlobal = a.eventData;

      const monatName = getMonatsname(currMonth + 1);
      const monatObj = eventDataGlobal.find(m => m.month === monatName);
      const marktName = item.dataset.name;
      
      if (monatObj && monatObj.events.includes(marktName)) {
        eventId = marktName;
        const evObj = monatObj[marktName];
        datesOfEvents = evObj ? evObj.dates : [];
        let  weekmarket = evObj.isWeekly;
        if(weekmarket == true){
          dateOfRecurringEvents();
        }
        
      }

      renderCalendar();
    });
  });
}







const renderEvents = async () => {
  console.log('currMonth:', currMonth);
console.log('months:', months);
console.log('eventDataGlobal:', eventDataGlobal);
    let found = false;
    let isInEvents = false;
    actualEvents = [];
  const mittelrhein = document.getElementById('MittelrheinAdmin');
	const oberrhein = document.getElementById('OberrheinAdmin');

    // 1️⃣ Aktuellen Monat holen
    for (let y = 0; y < eventDataGlobal.length; y++) {
        if (months[currMonth] === eventDataGlobal[y].month) {
            actualEvents = eventDataGlobal[y].events || [];
            if (actualEvents.length === 0) console.warn('Keine Events für diesen Monat.');
            found = true;
            break;
        }
    }

    // 2️⃣ Abgleich mit Regionen
    for (const regionKey in listofRegionGlobal) {
        const regionEntry = listofRegionGlobal[regionKey];
        for (let i = 0; i < regionEntry.regions.length; i++) {
            const marktName = regionEntry.regions[i];
            if (actualEvents.includes(marktName)) isInEvents = true;
        }
    }
const hasEvents = actualEvents.length > 0;
    
    if (!found || !hasEvents){

     if(mittelrhein && oberrhein && (mittelrhein.checked || oberrhein.checked)){
      showError("Für diesen Monat gibt es noch keine Veranstaltungen.");
   } 
}else{
     console.log("✅ Keine Fehlermeldung anzeigen");
     showError("");
  }



    // 4️⃣ Rendern
    showEvents(currMonth);

    return { isInEvents };
}

function showError(msg) {
  const box = document.getElementById('error-box');
  box.textContent = msg;
  box.style.display = 'block';
}
function navigateToRegionDisplay(){
window.location.href = "index.html#regionDisplay";

}


let currentRegion = null;
async function getRegions(){

   if (window.location.pathname.endsWith("/admin.html")) {
    console.log("Adminseite → getRegions überspringt URL-Check");
    return;
  }
	const params = new URLSearchParams(window.location.search);
	   currentRegion = params.get('region');
	  
 
	   if (currentRegion ) {
			await loadRegionData();
		 if (!listofRegionGlobal[currentRegion]) {
            console.warn(`Region "${currentRegion}" nicht gefunden.`);
            navigateToRegionDisplay();
            return;
          }
			selectRegions(currentRegion);
			// ✅ Sicherstellen, dass Events erst dann geladen und angezeigt werden
			renderEvents();
				showDropdownMenu(listofRegionGlobal,currentRegion); 

		

		
	} else{
		console.warn("Keine Region angegeben.");
		 navigateToRegionDisplay();
            return;
		
	}
}
async function loadRegionData(){
	try {
	 
    const data = await getData();  
    listofRegionGlobal  = data.listofRegion; // komplette Liste speichern
    eventDataGlobal  = data.eventData;
    return data; 
	 } catch (err) {
        console.error("Fehler beim Laden der JSON-Daten:", err);
    }
}

function normalizeEventData(eventData, year) {
  return eventData.map(monthObj => {
    const copy = { ...monthObj };

    monthObj.events.forEach(name => {
      const event = monthObj[name];
console.log("🔍 Normalisiere Monat:", copy.month, "Events:", copy.events);
      if (Array.isArray(event)) {
        // altes Schema → nur Array mit Strings
        copy[name] = event.map(str => {
          const [day, month] = str.split(".").map(Number);
          return { day, month: month - 1, year };
        });
      } else if (event && event.dates) {
        // neues Schema → { dates: [], owner: "xyz" }
        copy[name] = {
          owner: event.owner,
          dates: event.dates.map(str => {
            const [day, month] = str.split(".").map(Number);
            return { day, month: month - 1, year };
          })
        };
      }
    });

    return copy;
  });
}


		
	

	getRegions();

if(window.location.pathname.endsWith("admin.html")){
  const create = document.getElementById("create");
   create.addEventListener( "click", e => {
      console.log(e + "create Event geklickt!");
      e.preventDefault(); 

      getFormAttributes();


   });
}
   

function selectRegions(regions) { 
	
	let dropdownText = "";
	let region = document.getElementById("dropdownText");
	dropdownText = `Wir sind in den nächsten Monaten viel unterwegs am <strong class="strong">${regions}</strong> .
	 Schauen Sie gerne bei einer der Veranstaltungen  an unserem Langosstand vorbei.`
	 region.innerHTML = dropdownText;
}

function eventExistsInList(eventName, listofevents) {
  return listofevents.some(obj => 
    Array.isArray(obj.events) && obj.events.includes(eventName)
  );
}
function regionExistsInList(eventName,regionObj) {
  return Array.isArray(regionObj.regions) &&
    regionObj.regions.includes(eventName)
 
}
async function showDropdownMenu(listofRegion,regionName){
  console.log("showDropdownMenu aufgerufen:", listofRegion, regionName);

 if (typeof listofRegion !== 'object' || listofRegion === null || Array.isArray(listofRegion)) {
        console.error("❌ Fehler: listofRegion ist kein gültiges Objekt:", listofRegion);
		 alert(`⚠️ Für diese Region existiert noch kein Eintrag.`);
        return;
}
	const regionData = listofRegion[regionName];
if(selectedStart == null){
   if (!regionData || !Array.isArray(regionData.regions)) {
        console.warn(`⚠️ Region "${regionName}" enthält keine Events oder Wochenmärkte.`);
        //alert(`⚠️ Diese Region enthält keine Events oder Wochenmärkte.`);

         // ✅ Menü zurücksetzen
            let dropdownList = document.querySelector(".dropdown-menu");
            dropdownList.innerHTML = "";
        return;
    }
  }

   

  

	
	let dropdownList = document.querySelector(".dropdown-menu");
	 dropdownList.innerHTML = ""; // immer leeren
		let singleEvent = "";

  for (let y = 0; y < eventDataGlobal.length; y++) {
  if (months[currMonth] === eventDataGlobal[y].month) {
    const monthObj = eventDataGlobal[y];

    // alle Events dieses Monats durchgehen
    monthObj.events.forEach(eventName => {
      const evObj = monthObj[eventName];
      console.log(eventName, "→ Owner:", evObj.owner);
    });

    break;
  }
}
		if(actualEvents.length != 0){
	   // --- Wochenmärkte der Region hinzufügen ---
   if (Array.isArray(actualEvents) && actualEvents.length) {
    for (const marktName of regionData.regions) {
      if (actualEvents.includes(marktName)) {
         const displayName = marktName; 


        // EIN Wrapper, Buttons darin; name zusätzlich als data-Attribut
        const isActive = (window.location.pathname.endsWith("admin.html") && eventId === marktName) ? "active" : "";
const monthObj = eventDataGlobal.find(m => m.month === months[currMonth]);
// ➜ Owner für diesen Markt im aktuellen Monat auslesen
    const owner = monthObj[marktName]?.owner || null;
    console.log(`${marktName} → Owner:`, owner);

        // Wenn du den aktuell eingeloggten User prüfen willst:
    const currentOwner = localStorage.getItem("currentOwner"); // z.B. aus Login
    const isOwner = owner === currentOwner;

        singleEvent += `
           <div class="dropdown-item ${isActive}"
               data-name="${marktName}"
               style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; ">
            <span class="name">${displayName}</span>`
        if (window.location.pathname.endsWith("admin.html") && isOwner) {

             singleEvent += `<div style="display:flex; gap:6px;">
              <button type="button" class="update-btn" title="Bearbeiten" aria-label="Bearbeiten"
                      style="background:#4CAF50; border:none; color:white; padding:4px 6px; border-radius:4px; cursor:pointer;">✎</button>
              <button type="button" class="delete-btn" title="Löschen" aria-label="Löschen"
                      style="background:#f44336; border:none; color:white; padding:4px 6px; border-radius:4px; cursor:pointer;">🗑</button>
            </div>
          `;
        }
           singleEvent += `</div>`;
      }
    }
  }
}


	dropdownList.innerHTML = singleEvent;
  	

dropdownList.addEventListener("click", async function(e) {

    const item = e.target.closest(".dropdown-item");
    const marktName = item.dataset.name;

    
console.log("👉 Klick auf:", marktName);
console.log("👉 Events im Monat:", eventDataGlobal.find(m => m.month === getMonatsname(currMonth+1))?.events);
if (window.location.pathname.endsWith("/admin.html")){
   noneFormAttributes();
    // Formular mit Eventnamen füllen
    document.getElementById("eventname").value = marktName;

   
     

  
   

    // Daten laden & normalisieren
    await loadEvents();

    // Monatsdaten holen
    const monatName = getMonatsname(currMonth + 1);
    const monatObj = eventDataGlobal.find(m => m.month === monatName);

    if (!monatObj) {
      console.warn("Kein Monatsobjekt gefunden:", monatName);
      return;
    }


   
    let zeitraum = "";
    if (monatObj[marktName]) {
       const evObj = monatObj[marktName];
       const termine = evObj.dates;
      if (termine && termine.length > 0) {
    selectedStart = parseDate(termine[0]);
    selectedEnd = parseDate(termine[termine.length - 1]);
  }
}
function parseDate(d) {
  if (typeof d === "string") {
    // "1.9" → { day, month, year }
    const [day, month] = d.split(".").map(Number);
    return { day, month: month - 1, year: new Date().getFullYear() };
  } else if (typeof d === "object" && d !== null) {
    // { day, month, year } → direkt zurückgeben
    return { day: d.day, month: d.month, year: d.year };
  }
  throw new Error("Ungültiges Datum: " + d);
}

      const startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
      const endDate = new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day);

      zeitraum = `${startDate.getDate()}.${startDate.getMonth() + 1}.` +
        (endDate && endDate.getTime() !== startDate.getTime()
          ? ` - ${endDate.getDate()}.${endDate.getMonth() + 1}.`
          : "") +
        ` (${currYear})`;
    
  

    // Zeitraum ins Formular schreiben
    document.getElementById("eventTemp").innerHTML = `<span><strong>Zeitraum: </strong></span>`+ zeitraum;

    if (e.target.classList.contains("update-btn")) {
        getFormAttributes();

  } else if (e.target.classList.contains("delete-btn")) {
    const regionDel = region || null;  // falls du Region als data-Attr mitgibst
    const isWeekly = item.dataset.weekly === "true"; // Beispiel für boolean-Flag
    showDeleteConfirmation(region, marktName, currMonth, currYear, isWeekly);
  }
  }
});


function parseTerminString(str, year) {
  const [day, month] = str.split(".").map(Number);
  return new Date(year, month - 1, day);
}





	// Wait one frame to allow layout update
	await new Promise(requestAnimationFrame);

	const height = dropdownList.getBoundingClientRect().height;
	

	const calendar = document.querySelector(".calendar");
	let positionOfCalendar = calendar.getBoundingClientRect();
	const percentTop = (positionOfCalendar.top / window.innerHeight) * 100;
	const isMobile = window.matchMedia("(max-width: 768px)").matches;



	if (isMobile) {
		let newTop;
  
		if(height > 253){
			newTop = 10;
			console.log("Position of Calendar " + newTop + "%");
		}
		else if (height > 157 && height <= 252){
			newTop = 8;
			console.log("Position of Calendar " + newTop + "%");

		}else if (height > 252 && height <= 253){
			newTop = 15;
			console.log("Position of Calendar " + newTop + "%");
		}
		 // Apply style with !important to override CSS
		 calendar.style.setProperty("position", "relative", "important");
		 calendar.style.setProperty("top", newTop + "%", "important");
	}
	showEvents(currMonth);

}

prevNextIcon.forEach(icon => {
  
    icon.addEventListener("click", async handleClick => {
        await loadRegionData();
        clearMessage();

        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
    
        renderCalendar();
    
        await getRegions();
        

        await renderEvents();
          await  showDropdownMenu(listofRegionGlobal, currentRegion);
        
    
    });
});




document.addEventListener("DOMContentLoaded", async function () {

				let dropdownMenu = document.querySelector(".dropdown-menu");
				
					if (dropdownMenu){
						dropdownMenu.addEventListener("click", async() => {
							let region = "";
							if (window.location.pathname.endsWith("admin.html")){	
								let mittelrhein = document.getElementById("MittelrheinAdmin");
								let oberrhein = document.getElementById("OberrheinAdmin");
								
									if (mittelrhein.checked ) {   
									region = mittelrhein.value;

									}else if (oberrhein.checked ) {   
									region = oberrhein.value;
								
							}else {
									// hole die Region aus der URL
									const params = new URLSearchParams(window.location.search);
									region = params.get("region") || "";
									}
							if (!region) {
								console.warn("⚠️ Keine Region ausgewählt oder gefunden.");
								return;
								}
					
						try {
      await loadRegionData();
   
      if (!listofRegionGlobal[region]) {
        console.warn(`Region "${region}" nicht gefunden.`);
        return;
      }

	    await renderEvents();
      await showDropdownMenu(listofRegionGlobal, region);
    } catch (error) {
      console.error("Fehler beim Laden der Region:", error);
    }
	}
	});
	}
});
  
	
renderEvents();
   
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('side-menu');
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');

  checkbox.addEventListener('change', () => {
    // Body overflow toggeln
    document.body.style.overflow = checkbox.checked ? 'hidden' : 'auto';

    // Main ausblenden
    main.classList.toggle('hidden', checkbox.checked);
    main.classList.remove('open');

    // Footer ausblenden
    footer.classList.toggle('hidden-footer', checkbox.checked);
    footer.classList.remove('open');
  });
});

const dateOfRecurringEvents = async (eventName, username) => {
	 const serverData = await getData();
    eventData = serverData?.eventData || [];
    listofRegion = serverData?.listofRegion || {};
    recurringMarketDates.length = 0;

   
    const firstDay = selectedStart.day;
    if (!firstDay) {
        console.error("❌ Kein Starttag in DaysSet gefunden!");
        return;
    }
    const month = currMonth;

  
    // Startdatum erzeugen (UTC damit es sauber bleibt)
    let currentUTCDate = new Date(Date.UTC(currYear, month, firstDay));

    // Sicherstellen, dass es ein gültiges Datum ist
    if (isNaN(currentUTCDate)) {
    
        console.error("❌ Ungültiges Startdatum:", startDateStr);
       
        return;
    }

    // Wochentag merken
    const dtfBerlin = new Intl.DateTimeFormat('de-DE', {
        weekday: 'long',
        timeZone: 'Europe/Berlin'
    });
    const weekdayName = dtfBerlin.format(currentUTCDate);


    // --- Vorwärts durch Jahr gehen ---
    let forward = new Date(currentUTCDate);
    while (forward.getUTCFullYear() === currYear) {
        recurringMarketDates.push(forward.toISOString().split("T")[0]);
        forward.setUTCDate(forward.getUTCDate() + 7);
    }

    // --- Rückwärts durch Jahr gehen ---
    let backward = new Date(currentUTCDate);
    backward.setUTCDate(backward.getUTCDate() - 7);
    while (backward.getUTCFullYear() === currYear) {
        recurringMarketDates.push(backward.toISOString().split("T")[0]);
        backward.setUTCDate(backward.getUTCDate() - 7);
    }

    // Sortieren
    recurringMarketDates.sort((a, b) => new Date(a) - new Date(b));

    // --- Pro Monat einsortieren ---
    recurringMarketDates.forEach(dateISO => {
        const dateObj = new Date(dateISO);
        const monthName = dateObj.toLocaleString("de-DE", { month: "long" });
        const day = dateObj.getUTCDate();
        const monthNum = dateObj.getUTCMonth() + 1;
        const formatted = `${day}.${monthNum}`;

        // Monatseintrag finden oder anlegen
        let monthEntry = eventData.find(e => e.month === monthName);
        if (!monthEntry) {
            monthEntry = { month: monthName, events: [] };
            eventData.push(monthEntry);
        }

        // Eventnamen registrieren
        if (!monthEntry.events.includes(eventName)) {
            monthEntry.events.push(eventName);
        }

        // Datum hinzufügen
       
  if (!monthEntry[eventName]) {
  monthEntry[eventName] = {
    dates: [],
    owner: username,
    isWeekly: true
  };
} else {
  // Existierendes Event → isWeekly aktualisieren
  monthEntry[eventName].isWeekly = true;
}



if (!monthEntry[eventName].dates.includes(formatted)) {
    monthEntry[eventName].dates.push(formatted);
}
    });


	for(let z=0 ;z<recurringMarketDates.length; z++){
											
					let days = recurringMarketDates[z].split("-");
					let day = days[2];
					day = +day; //convert String into Number
					let month = days[1];
					month = +month;
				recurringDaysOfEvents.push(day,month);
					
					
				}
	
// Globale Variablen aktualisieren, damit speichernEvent sie mitschickt
eventDataGlobal = eventData;
listofRegionGlobal = listofRegion;
  
	renderCalendar();
};
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync('userDaten.json', 'utf-8')); // z.B. users.json
  } catch {
    return [];
  }
}

loadUsers();
async function renderUserList() {
  try {
    const res = await fetch('/userDaten', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      }
    });
    if (!res.ok) throw new Error("Fehler beim Laden der Benutzer");
    const users = await res.json();

    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = ""; // alte Zeilen löschen

    users.forEach(user => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = user.username;
      tr.appendChild(tdName);

      const tdRole = document.createElement("td");
      tdRole.textContent = user.role;
      tr.appendChild(tdRole);

      const tdStatus = document.createElement("td");
      tdStatus.textContent = user.isLoggedIn ? "Online" : "Offline";
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
  }
}

// Aufruf beim Laden der Seite
if(window.location.pathname.endsWith("/admin.html")){
  document.addEventListener("DOMContentLoaded", renderUserList);
}

renderCalendar();
//chooseEvents(currMonth);