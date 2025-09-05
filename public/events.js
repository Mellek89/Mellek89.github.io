
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
					  console.log("📥 getData() liefert:", jsontest);
					  
					  return jsontest; 
					  
					} catch (error) {
					  console.error(error.message);
					}
					
				  }
				  getData();
			

let DaysSet; 

// Globale Variablen für die Bereichsauswahl
let selectedStart = null;
let selectedEnd = null;
let period = "";

// Klick-Handler für Tage
function onDayClick(day) {
	eventId='';
	recurringDaysOfEvents.length = 0;
    if (!selectedStart|| selectedEnd) {
        selectedStart = day; 
		 selectedEnd = null;
		  DaysSet = new Set([day]); 
		 	
		 period =   `<strong>Zeitraum:</strong> ${selectedStart}${selectedEnd != null ? ' - ' + selectedEnd : ''} . ${currMonth+1} (${currYear})`;
		document.getElementById('eventTemp').innerHTML = period;
     
		      // Start setzen
    } else if (!selectedEnd) {
        selectedEnd = day;              // Ende setzen
        if (selectedEnd < selectedStart) {
            [selectedStart, selectedEnd] = [selectedEnd, selectedStart];
        }
		 period =   `<strong>Zeitraum:</strong> ${selectedStart}${selectedEnd != null ? ' - ' + selectedEnd : ''} . ${currMonth+1} (${currYear})`;
		document.getElementById('eventTemp').innerHTML = period;
        // Tage zwischen Start und Ende in DaysSet speichern
        DaysSet = new Set();
        for (let d = selectedStart; d <= selectedEnd; d++) {
            DaysSet.add(d);
        }
    } else {
        // Neue Auswahl starten
        selectedStart = day;
        selectedEnd = null;
        DaysSet = new Set([day]);
    }

    renderCalendar(); // Kalender neu zeichnen
}

const renderCalendar = () => {
    const firstDateOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";
	let startDayMarked = null; // merken, welcher Starttag war
	if (selectedStart) {
    startDayMarked = selectedStart;
}
     // Events Set vorbereiten
    if (!DaysSet) {
        DaysSet = new Set();
    }

 // 🔹 Falls wiederkehrende Events existieren → ins Set eintragen
    if (recurringDaysOfEvents && recurringDaysOfEvents.length > 0) {
        for (let i = 0; i < recurringDaysOfEvents.length; i += 2) {
            const day = recurringDaysOfEvents[i];
            const month = recurringDaysOfEvents[i + 1];

            if (month === currMonth + 1) {
                DaysSet.add(day);
                if (!startDayMarked) {
                    startDayMarked = day; // ersten Treffer als Start merken
                }
            }
        }
    }  

if (eventId) {
	startDayMarked= null;
	if(DaysSet){  DaysSet = new Set();}
    const monatObj = eventDataGlobal.find(m => m.month === months[currMonth]);

if (monatObj) {
    for (const eventName of monatObj.events) {
		if (eventId == eventName){
			const days = monatObj[eventName]; // z.B. ["5.9", "12.9"]
			if (days && days.length === 2) {
				const [dayStr1, monthStr1] = days[0].split(".");
				const [dayStr2, monthStr2] = days[1].split(".");

				let startDay = parseInt(dayStr1, 10);
				let endDay   = parseInt(dayStr2, 10);
				let month    = parseInt(monthStr1, 10);
        let startMonth = parseInt(monthStr1,10);
        let endMonth = parseInt(monthStr2,10);

        const startDate = new Date(currYear, startMonth, startDay);
        const endDate = new Date(currYear, endMonth, endDay);
        
				if (month === currMonth + 1) {
					if (endDay < startDay) [startDay, endDay] = [endDay, startDay];
						startDayMarked = startDay; // Start speichern
					for (let d = startDay; d <= endDay; d++) {
						DaysSet.add(d);
					}
					startDayMarked = startDay; // ✅ Starttag speichern
				}
			} else if (days) {
				// falls nur Einzeltage drin sind (wie "19.9", "26.9")
				for (const d of days) {
					const [dayStr, monthStr] = d.split(".");
					const day = parseInt(dayStr, 10);
					const month = parseInt(monthStr, 10);

					if (month === currMonth + 1) {
						DaysSet.add(day);
						if (!startDayMarked) {
							startDayMarked = day; // ersten Eintrag als Start speichern
						}
					}
				}
			}
		}
    }
}
 else {
            // Einzeltage
            for (const d of days) {
                const [dayStr, monthStr] = d.split(".");
                const day = parseInt(dayStr, 10);
                const month = parseInt(monthStr, 10);
					        startDayMarked = day; // Start speichern
                if (month === currMonth + 1) {
                    DaysSet.add(day);
                }
            }
        }												
				
}
	
    // Vortage des Vormonats
    for (let i = firstDateOfMonth; i > 0; i--) {
        const inactiveLastDays = lastDateOfLastMonth - i + 1;
        liTag += `<li class="inactive">${inactiveLastDays}</li>`;
    }

    // Tage des aktuellen Monats

	
    for (let i = 1; i <= lastDateOfMonth; i++) {

	
        let className = "";
			
						

        if (i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()) {
            className = "active";
        }

        if (DaysSet.has(i)) {
            className += (className ? " " : "") + "circle";
        }
		// Starttag hervorheben
        if (startDayMarked && i === startDayMarked) {
            className += (className ? " " : "") + "circle";
        }

		// ✅ Starttag hervorheben, egal ob Bereich oder Einzeltag
    if (startDayMarked === i) {
        className += (className ? " " : "") + "circle";
    }
       liTag += `<li data-day="${i}" class="${className}">${i}</li>`;
    

    

    }

    // Resttage des Monats für Kalenderanzeige
    for (let i = lastDayOfMonth + 1; i <= 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
	 // 🔹 Events für Klicks hinzufügen
    document.querySelectorAll('.days li' ).forEach(li => {
        li.addEventListener("click", () => {
            const day = parseInt(li.dataset.day, 10);
            onDayClick(day);
        });
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
async function ladeDatenFürRegion(region) {

if (!region) {
    console.warn("⚠️ Keine Region angegeben für ladeDatenFürRegion");
    return;
  }

		 await loadRegionData();

      if (!listofRegion) {
        console.warn(`Region "${region}" nicht gefunden.`);
      	
        return;
      }

      renderEvents().then(() => {
			const regionData = listofRegion[region];
			if (!regionData) {
			console.warn(`❌ Keine Daten für Region "${region}" gefunden.`);
			showDropdownMenu(listofRegion,region); 
			return;
			}

			console.log("🔎 Region übergeben:", region);
			console.log("🔎 Daten für Region:", listofRegion[region]);

			console.log("📤 Übergabe an Dropdown:", regionData);
			showDropdownMenu(listofRegion,region); 

       
      });
   
} 
	

	oberrhein.addEventListener('change', async () => {
		
	  if (oberrhein.checked ) {
		DaysSet = new Set();
		eventId = '';
		selectedStart = null;
		selectedEnd = null;
		period = '';
		 document.getElementById('eventTemp').innerHTML = period; // HTML leeren
       	 region = oberrhein.value;
		 renderCalendar();
		  await ladeDatenFürRegion(region);
      }
	});
	
		mittelrhein.addEventListener('change', async () => {
		if (mittelrhein.checked ) {  
			DaysSet = new Set();
			eventId = '';
			selectedStart = null;
			selectedEnd = null;
			period = '';
			 document.getElementById('eventTemp').innerHTML = period; // HTML leeren
			
				 region = mittelrhein.value;
				 renderCalendar();
				
				 await ladeDatenFürRegion(region);
			}
		});

      
 document.getElementById('zeitraumForm').addEventListener('submit', function(e) {
      e.preventDefault();
		handleStrings();
      const eventname = document.getElementById('eventname').value.trim();
	   let eventnametmp = eventname;
	   eventnametmp= formattedEventname;
	  
	
      if (!eventnametmp ) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }
    			// Vorschau anzeigen
    const { name, region, isWeekly } = handleWeekmarkets();
	  const finalName =  eventnametmp;
		
					const zeitraum = `${selectedStart}${selectedEnd != null ? ' - ' + selectedEnd : ''} . ${currMonth+1} (${currYear})`;
      if (selectedStart == null){
        
        alert("Bitte ein Startdatum für den Wochenmarkt angeben."); 
        return;
      }
					showConfirmation(region, eventnametmp, zeitraum, finalName, currMonth, currYear, isWeekly);

				
				
				const udBtn= document.getElementById('udBtn');
				udBtn.addEventListener("click", () => {
				if (udBtn.click){
						return;
					}
				});
					
				
				const saveBtn= document.getElementById('saveBtn');
				  saveBtn.addEventListener('click', async function handler() {
					
					await speichernEvent(finalName, currMonth, region,isWeekly);
					    // Events in Liste anzeigen
  					ladeDatenFürRegion(region);
				
					// Nur einmal ausführen: Eventlistener wieder entfernen
					saveBtn.removeEventListener('click', handler);
				});
				
			


    });
	function showConfirmation(region, eventName, zeitraum, finalName, currMonth, currYear, isWeekly) {
    const modal = document.getElementById("confirmModal");
    document.getElementById("regionField").textContent = region;
    document.getElementById("eventField").textContent = eventName;
    document.getElementById("zeitraumField").textContent = zeitraum;

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


function showDeleteConfirmation(region, eventName, zeitraum, finalName, currMonth, currYear, isWeekly) {
    const modal = document.getElementById("confirmDeleteModal");
    document.getElementById("regionField").textContent = region;
    document.getElementById("eventField").textContent = eventName;
    document.getElementById("zeitraumField").textContent = zeitraum;

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
    });

     delBtn.addEventListener("click",deleteHandler);
  
  }











async function speichernEvent(name, month, region, weekmarket) {
    console.log("📦 speichernEvent aufgerufen mit:", name, month, region, weekmarket);
// 1️⃣ Vorher aktuelle Daten vom Server laden
    const serverData = await getData();
    eventData = serverData?.eventData || [];
    listofRegion = serverData?.listofRegion || {};

	 const monatName = getMonatsname(month + 1); // z. B. 7 -> "August"

    const selectedDaysForEvent = Array.from(DaysSet).map(d => `${d}.${month + 1}`);

	   if (weekmarket === true) {
    await dateOfRecurringEvents(name);

    } else {
        // 3️⃣ Normale Events
        let monatObj = eventData.find(e => e.month === monatName);
        if (!monatObj) {
            monatObj = { month: monatName, events: [] };
            eventData.push(monatObj);
        }
        if (!monatObj.events.includes(name)) {
            monatObj.events.push(name);
        }
        if (!monatObj[name]) {
            monatObj[name] = [];
        }
        monatObj[name].push(...selectedDaysForEvent);
        monatObj[name] = [...new Set(monatObj[name])];
    }

    // --- Regionenliste pflegen ---
    if (typeof listofRegion !== 'object' || listofRegion === null) {
        listofRegion = {};
    }
    if (!listofRegion[region]) {
        listofRegion[region] = { regions: [] };
    }
    if (!listofRegion[region].regions.includes(name)) {
        listofRegion[region].regions.push(name);
    }

    // Anzeige leeren
    document.getElementById('bestaetigung').innerHTML = '';
    //document.getElementById('ausgabe').innerHTML = `<strong>${name} gespeichert!</strong>`;
    document.getElementById('zeitraumForm').reset();

    const combinedData = {
        eventData: eventData,
        listofRegion: listofRegion
    };

    try {
        const response = await fetch('/save-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(combinedData)
        });

        const data = await response.json();
        console.log('✅ Server-Antwort:', data.message);
		getData();
		
		renderEvents();
		
    } catch (error) {
        console.error('❌ Fehler beim Speichern:', error);
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

async function loeschenEvent(name, region) {
       
        const serverData = await getData();
        eventData = serverData?.eventData || [];
        listofRegion = serverData?.listofRegion || {};

  // --- Event in allen Monaten löschen ---
    eventData = eventData.map(monatObj => {
        if (monatObj.events.includes(name)) {
            monatObj.events = monatObj.events.filter(ev => ev !== name);
            delete monatObj[name]; // falls du zusätzlich dynamische Keys hast
        }
        return monatObj;
    }).filter(monatObj => monatObj.events.length > 0); // leere Monate entfernen

    // --- Event aus Regionenliste löschen ---
   if (region && listofRegion[region] && Array.isArray(listofRegion[region].regions)) {
    listofRegion[region].regions = listofRegion[region].regions.filter(ev => ev !== name);

    // Optional: Region nur löschen, wenn wirklich leer
    if (listofRegion[region].regions.length === 0) {
        delete listofRegion[region];
    }
} else {
    console.warn("⚠️ Region nicht gefunden oder ungültig:", region);
}


    // --- POST an Server ---
    const combinedData = { eventData, listofRegion };
    console.log("📤 Sende an Server:", JSON.stringify(combinedData, null, 2));
    try {
        const response = await fetch('/delete-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(combinedData)
        });
        if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`);
        const data = await response.json();
         console.log('response' + response);
        console.log('✅ Server-Antwort:', data.message);
        DaysSet = new Set();
        	period = '';
          selectedStart = null;
			    selectedEnd = null;
          eventId= '';
			 document.getElementById('eventTemp').innerHTML = period; // HTML leeren

       
       	renderEvents().then( ()=> {
				 if (listofRegion[region]) {
        // Region existiert noch
        showDropdownMenu(listofRegion, region);
        renderCalendar();
        
    } else {
        // Region wurde gelöscht → ganze Liste anzeigen
        showDropdownMenu(listofRegion);
        renderCalendar();
      
    }

			});	
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


let eventDataGlobal = []; // globale Variable


async function showEvents(currMonth) {
  const eSelector = document.querySelectorAll(".dropdown-item");

  eSelector.forEach(e => {
    e.addEventListener("click", async () => {
      // Reset
      eventId = "";
      datesOfEvents.length = 0;

      // Alle anderen zurücksetzen
      eSelector.forEach(el => {
        if (el !== e) {
          el.style.color = "rgb(240, 255, 255)";
          el.style.borderBottom = "1px solid rgb(255, 235, 59)";
        }
      });

      // Aktuelles Element hervorheben
      e.style.color = "rgb(255, 235, 59)";
      e.style.borderBottom = "1px solid rgb(240, 255, 255)";

      // Daten vom Server holen
      const a = await getData();
      eventDataGlobal = a.eventData;

      const monatName = getMonatsname(currMonth + 1); // z. B. 7 → "August"
      const monatObj = eventDataGlobal.find(m => m.month === monatName);
const marktName = e.dataset.name;
      // EventId setzen und Termine speichern
      if (monatObj && monatObj.events.includes(marktName)) {
        eventId = marktName;
        datesOfEvents = monatObj[marktName] || [];
      }

      renderCalendar(); // rendert nur die Termine des ausgewählten Events
    });
  });
}



const renderEvents = async () => {	

	let data = await getData();	
	let found = false;
let  isInEvents = false;
//  2. Vergleiche Markt-Namen aus listofRegion mit eventData


for (const regionKey in data.listofRegion) {
    const regionEntry = data.listofRegion[regionKey];

    for (let i = 0; i < regionEntry.regions.length; i++) {
        const marktName = regionEntry.regions[i];

         isInEvents = actualEvents.includes(marktName);

        found = true;
		
		
       
    }
}
	 		
	for (let y=0; y< data.eventData.length;y++){
		if (months[currMonth] == data.eventData[y].month){
		 	actualEvents = data.eventData[y].events;
	
		if (!actualEvents || actualEvents.length === 0) {

			console.error('Keine Events für diesen Monat gefunden.');
			}
			found = true;
			break; 	
		
	}
		
	} 
	if (!found) {
  showError("Für diesen Monat gibt es noch keine Veranstaltungen.");
}else {
	showError("");
}


	showEvents(currMonth);
	return {isInEvents: isInEvents};
}
function showError(msg) {
  const box = document.getElementById('error-box');
  box.textContent = msg;
  box.style.display = 'block';
}
function navigateToRegionDisplay(){
window.location.href = "index.html#regionDisplay";

}



async function getRegions(){
	const params = new URLSearchParams(window.location.search);
	   const region = params.get('region');
	  
 
	   if (region ) {
			await loadRegionData();
		 if (!listofRegion[region]) {
            console.warn(`Region "${region}" nicht gefunden.`);
            navigateToRegionDisplay();
            return;
          }
			selectRegions(region);
			// ✅ Sicherstellen, dass Events erst dann geladen und angezeigt werden
			renderEvents().then( ()=> {
				showDropdownMenu(listofRegion,region); 

			});	

		
	} else{
		console.warn("Keine Region angegeben.");
		 navigateToRegionDisplay();
            return;
		
	}
}
async function loadRegionData(){
	try {
	 const response = await fetch('/events.json');
    const data = await response.json();
    listofRegion = data.listofRegion; // komplette Liste speichern
    listofevents = data.eventData;
	 } catch (err) {
        console.error("Fehler beim Laden der JSON-Daten:", err);
    }
}

		
	
if (!window.location.pathname.endsWith("admin.html")){	
	getRegions();
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

 if (typeof listofRegion !== 'object' || listofRegion === null || Array.isArray(listofRegion)) {
        console.error("❌ Fehler: listofRegion ist kein gültiges Objekt:", listofRegion);
		 alert(`⚠️ Für diese Region existiert noch kein Eintrag.`);
        return;
}
	const regionData = listofRegion[regionName];

   if (!regionData || !Array.isArray(regionData.regions)) {
        console.warn(`⚠️ Region "${regionName}" enthält keine Events oder Wochenmärkte.`);
        alert(`⚠️ Diese Region enthält keine Events oder Wochenmärkte.`);

         // ✅ Menü zurücksetzen
            let dropdownList = document.querySelector(".dropdown-menu");
            dropdownList.innerHTML = "";
        return;
    }

  

	
	let dropdownList = document.querySelector(".dropdown-menu");
	
		let singleEvent = "";
		if(actualEvents.length != 0){
		

   // --- Wochenmärkte der Region hinzufügen ---
   if (Array.isArray(actualEvents) && actualEvents.length) {
    for (const marktName of regionData.regions) {
      if (actualEvents.includes(marktName)) {
        // EIN Wrapper, Buttons darin; name zusätzlich als data-Attribut
        singleEvent += `
          <div class="dropdown-item"
               data-name="${marktName}"
               style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; border-bottom:1px solid #ddd;">
            <span class="name">${marktName}</span>
            <div style="display:flex; gap:6px;">
              <button type="button" class="update-btn" title="Bearbeiten" aria-label="Bearbeiten"
                      style="background:#4CAF50; border:none; color:white; padding:4px 6px; border-radius:4px; cursor:pointer;">✎</button>
              <button type="button" class="delete-btn" title="Löschen" aria-label="Löschen"
                      style="background:#f44336; border:none; color:white; padding:4px 6px; border-radius:4px; cursor:pointer;">🗑</button>
            </div>
          </div>`;
      }
    }
  }
}


	dropdownList.innerHTML = singleEvent;
  	
	// 🎯 Klicks auf Update/Delete direkt hier registrieren
    dropdownList.addEventListener("click", function(e) {
        if (e.target.classList.contains("update-btn")) {
            const item = e.target.closest(".dropdown-item");
            const eventName = item.querySelector("span").textContent;
            alert("Bearbeiten von: " + eventName);
            // hier Update-Logik einfügen
        }

       if (e.target.classList.contains("delete-btn")) {
        const item = e.target.closest(".dropdown-item");
        const eventName = item.querySelector(".name").textContent;
        const regionDel = region; // falls du die Region mitgibst
        const zeitraum = "..."; // hier musst du die Info einsetzen
        const finalName = eventName;

        showDeleteConfirmation(regionDel, eventName, zeitraum, finalName, currMonth, currYear, false);
    }
    });



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

let startMonth = null;
prevNextIcon.forEach(icon => {
	
    icon.addEventListener("click", async handleClick => {
		 await loadRegionData();
		clearMessage();
		
		if (DaysSet.size != 0){
			console.log(DaysSet);
      selectedStart = DaysSet.entries().next().value[0];
		}
      startMonth = currMonth;
	
        currMonth = icon.id === "prev" ? currMonth -1 : currMonth +1;
        
        if (currMonth < 0 || currMonth > 11){
        date = new Date(currYear,currMonth),
        
        currYear = date.getFullYear(), //updating current year with new date year 
        currMonth = date.getMonth(); //updating current month with new date month


        }
        else{ //pass new date as date value
        	let date = new Date();
			
        }    
			
		
		renderCalendar();
		
			renderEvents().then( ()=> {
				showDropdownMenu(listofRegion,region); 

			});	
		
	
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
   
      if (!listofRegion[region]) {
        console.warn(`Region "${region}" nicht gefunden.`);
        return;
      }

	    await renderEvents();
      await showDropdownMenu(listofRegion, region);
    } catch (error) {
      console.error("Fehler beim Laden der Region:", error);
    }
	}
	});
	}
});
  
	
renderEvents();
   

const checkbox = document.getElementById('side-menu');
const menu = document.getElementById('nav');
const main = document.getElementById('main');

checkbox.addEventListener('click', () => {

  main.classList.toggle('hidden', checkbox.checked);
  main.classList.remove("open");

});

const dateOfRecurringEvents = async (eventName) => {
	 const serverData = await getData();
    eventData = serverData?.eventData || [];
    listofRegion = serverData?.listofRegion || {};
    recurringMarketDates.length = 0;

    // ✅ Starttag aus DaysSet ziehen
    const firstDay = Math.min(...DaysSet); // kleinster Wert = Start
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
            monthEntry[eventName] = [];
        }
        if (!monthEntry[eventName].includes(formatted)) {
            monthEntry[eventName].push(formatted);
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
	

  
	renderCalendar();
};


renderCalendar();
//chooseEvents(currMonth);



