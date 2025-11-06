
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
let marktNameGlobal = '';
let weekmarketGlobal = null;
let isUpdate = false;


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
let startDate = null;
let endDate = null;
let period = "";
let selectedFromClick = false; // globales Flag





// Klick-Handler für Tage
function onDayClick(day) {
    eventId = '';
    recurringDaysOfEvents.length = 0;
    datesOfEvents.length = 0;
    weekmarketGlobal = null;
    
 selectedFromClick = true;  

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
         startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
         endDate = new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day);

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
// 👉 kleine Hilfsfunktion
function resetEventState() {
  //oldName = null; in create setzen

marktNameGlobal = null;
  isUpdate = false;
  eventId = '';
  selectedStart = null;
  selectedEnd = null;
  period = '';
  document.getElementById('eventTemp').innerHTML = period; // Zeitraum leeren
  document.getElementById('eventname').value = period; // Eventname leeren
   datesOfEvents = [];

  renderCalendar();
}

if (window.location.pathname.endsWith("admin.html")){
const token = localStorage.getItem("jwt");
if (!token) {
  // kein Login vorhanden → zurück zur Login-Seite
  window.location.href = "/login.html";
}


}

let createButtonActive = false;


const renderCalendar = () => {
    const firstDateOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    if (!weekmarketGlobal) {
     startDate = selectedStart
        ? new Date(selectedStart.year, selectedStart.month, selectedStart.day)
        : null;
     endDate = selectedEnd
        ? new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day)
        : startDate;

        }
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

       

// Bereich hervorheben (nur für normale Events, nicht für Wochenmärkte)
if ((!weekmarketGlobal || weekmarketGlobal == false) && startDate && endDate && currentDate >= startDate && currentDate <= endDate) {
    className += (className ? " " : "") + "circle";
}

         // Termine markieren (datesOfEvents)
      
       if (Array.isArray(datesOfEvents) && datesOfEvents.length > 0) {
            for (const d of datesOfEvents) {
                let day, month;
          if (typeof d === "string") {
              const [dayStr, monthStr] = d.split(".");
              const day = parseInt(dayStr, 10);
              const month = parseInt(monthStr, 10);
          }else if (d && typeof d === "object") {
              day = d.day;
                month = d.month + 1;   
          }
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


if (!window.daysClickBound) {
  document.querySelector(".days").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-day]");
    if (!li) return;

    const day = parseInt(li.dataset.day, 10);
    if (isNaN(day)) return;

    if (!createButtonActive && !isUpdate) {
      console.warn("⚠️ Erst 'Create' klicken, um einen Tag zu wählen.");
      return;
    }

    onDayClick(day);
  });

  window.daysClickBound = true; // Markierung, dass der Listener schon gesetzt wurde
}



  
   
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

  if (!listofRegionGlobal) {
    console.warn(`Region "${region}" nicht gefunden.`);
    return;
  }

  const regionData = listofRegionGlobal[region];

  if (!regionData) {
    console.warn(`❌ Keine Daten für Region "${region}" gefunden.`);
      // 🔹 Benutzerfreundliche Meldung im Dropdown anzeigen:

    showDropdownMenu({}, region); // leeres Objekt anzeigen
    return;
  } 

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
          if(createButtonActive == false){
            let prevView = document.getElementById("prevView");
              if (prevView) {
                prevView.style.display = "none";
              }
              let eventName = document.getElementById("eventName");
              if (eventName) {
                eventName.style.display = "none";
              }
            let  weekmarket = document.getElementById("Weekmarket");
              if (weekmarket) {
                weekmarket.style.display = "none";
              }
            }
        
       
  if (oberrhein.checked ) {
    if(createButtonActive == false){  resetEventState(); }
   
    region = oberrhein.value;

      try {
        await ladeDatenFürRegion(region);  // lädt Daten + baut Dropdown
        
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

      if(createButtonActive == false){
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
    }
   datesOfEvents.length= 0;
  

     
      if (mittelrhein.checked ) {
         if(createButtonActive == false){  resetEventState(); }
    
   
          region = mittelrhein.value;

          try {
            await ladeDatenFürRegion(region);  // lädt Daten + baut Dropdown
         
          } catch (err) {
            console.error("❌ Fehler beim Laden der Mittelrhein-Daten:", err);
          }
      }
});




      
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
if ( selectedFromClick) {
    // User hat ein Datum direkt geklickt → diese Werte nutzen
  const  newStart = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
   const newEnd   = selectedEnd
        ? new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day)
        : newStart;
 
        	const zeitraum = `${selectedStart.day}. ${selectedStart.month+1}.` + 
          (selectedEnd ?` -  ${selectedEnd.day}. ${selectedEnd.month+1}.` : '' ) 
          + `(${currYear})`;
        

    // Nach Verwendung wieder zurücksetzen
    selectedFromClick = false;
    showConfirmation(region, eventnametmp, zeitraum, finalName, currMonth, currYear, isWeekly,newStart, newEnd);

} else if(isUpdate && isUpdate == true){
 
   const monatName = getMonatsname(currMonth + 1);
      let monatObj = eventDataGlobal.find(m => m.month === monatName);
      let eventObj =monatObj[marktNameGlobal];
       const  newStart = new Date(currYear,eventObj.dates[0].month, eventObj.dates[0].day);
       const endOfArray   = eventObj.dates[eventObj.dates.length - 1];
       const newEnd = new Date(currYear,endOfArray.month, endOfArray.day);
    
      

      const zeitraum = `${eventObj.dates[0].day}. ${eventObj.dates[0].month+1}` + 
      (newEnd ?` - ${endOfArray .day}. ${endOfArray.month+1}.` : '' ) +
        `(${currYear})`;

      showConfirmation(region, eventnametmp, zeitraum, finalName, currMonth, currYear, isWeekly,newStart, newEnd);

}else{

					const zeitraum = `${selectedStart.day}. ${selectedStart.month+1}.` + 
          (selectedEnd ?` -  ${selectedEnd.day}. ${selectedEnd.month+1}.` : '' ) 
          + `(${currYear})`;
      if (selectedStart == null){
        
        alert("Bitte ein Startdatum für den Wochenmarkt angeben."); 
        return;
        
      }
    showConfirmation(region, eventnametmp, zeitraum, finalName, currMonth, currYear, isWeekly,selectedStart, selectedEnd);
}
  		


    });
	function showConfirmation(region, eventName, zeitraum, finalName, currMonth, currYear, isWeekly,newStart, newEnd) {
    const modal = document.getElementById("confirmModal");
    document.getElementById("regionField").textContent = region;
    document.getElementById("eventField").textContent = eventName;
    document.getElementById("zeitraumField").textContent = zeitraum;
    const weekmarketEl = document.getElementById("showWeekmarket");
// Buttons
    const saveBtn = document.getElementById('saveBtn');
    const udBtn = document.getElementById('udBtn');
    const oldName = marktNameGlobal;

   
   
    if (isWeekly) {
          weekmarketEl.style.display = "block";
            weekmarketEl.textContent = "Dieses Event ist ein Wochenmarkt";
          } else {
            weekmarketEl.style.display = "none";
          }
    // Modal öffnen
    modal.showModal();

    

    // Save
    const saveHandler = async () => {

      try {
       let newStart, newEnd;
if (selectedStart) {
    newStart = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
    newEnd   = selectedEnd
      ? new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day)
      : newStart;
  } 
  else {
     const  newStart = new Date(currYear,eventObj.dates[0].month, eventObj.dates[0].day);
       const endOfArray   = eventObj.dates[eventObj.dates.length - 1];
       const newEnd = new Date(currYear,endOfArray.month, endOfArray.day);
      
      
  }
  

       await speichernEvent(finalName, currMonth, region, isWeekly, oldName, newStart, newEnd);
      modal.close();
       noneFormAttributes()
       isUpdate = false;
      } catch (err) {
       console.error("❌ Fehler im saveHandler:", err);
   } finally {
       saveBtn.removeEventListener("click", saveHandler);
   }
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
  
 
function mergeOrUpdateEvent(
  monatObj,
  oldName,
  newName,
  tagString,
  username,
  weekmarket,
  isUpdate,
  opts = {},
  isExistingWeekly = false
) {
  const toDate = o => new Date(Number(o.year), Number(o.month), Number(o.day));
  
  const addDateRangeToEvent = (event, startObj, endObj) => {
    const s = toDate(startObj);
    const e = endObj ? toDate(endObj) : s;
    if (s.getTime() === e.getTime()) {
      const d = { day: s.getDate(), month: s.getMonth(), year: s.getFullYear() };
      if (!event.dates.some(x => x.day === d.day && x.month === d.month && x.year === d.year)) {
        event.dates.push(d);
      }
      return;
    }
    const cur = new Date(s);
    let safety = 0;
    while (cur <= e && safety < 10000) {
      const d = { day: cur.getDate(), month: cur.getMonth(), year: cur.getFullYear() };
      if (!event.dates.some(x => x.day === d.day && x.month === d.month && x.year === d.year)) {
        event.dates.push(d);
      }
      cur.setDate(cur.getDate() + 1);
      safety++;
    }
    if (safety >= 10000) console.warn("addDateRangeToEvent: safety stop (very large range?)");
  };

  let eventData = eventDataGlobal || [];
  
  // 🔹 Prüfen, ob Event schon existiert
  let event = monatObj[oldName] || monatObj[newName];

  if (event) {
    // 🔹 Update bestehendes Event
    event.owner = event.owner || username;
    const previousWasWeekly = event.isWeekly === true;
    event.isWeekly = weekmarket === true;

 

    // Wochenmarkt → Einzel: normalize dates
    if (previousWasWeekly && !event.isWeekly) {
      event.dates = event.dates
        .filter(d => d && typeof d === 'object' && 'day' in d)
        .map(d => ({ day: d.day, month: d.month, year: d.year }));
    }

   

  if (!event.isWeekly && tagString) {
  const exists = event.dates.some(d =>
    Number(d.day) === Number(tagString.day) &&
    Number(d.month) === Number(tagString.month) &&
    Number(d.year) === Number(tagString.year)
  );
  if (!exists) {
     event.dates.push(tagString); //
  }
} else if (event.isWeekly && tagString) {
  console.log("tagString", tagString);
console.log("event.dates", event.dates);



 const tagDate = {
  day: Number(tagString.day),
  month: Number(tagString.month),
  year: Number(tagString.year)
};

// Normalisiere vorhandene Daten
//event.dates = event.dates.map(d => ({ day: Number(d.day), month: Number(d.month), year: Number(d.year) }));


  event.dates.push(tagDate);


}


    // Rename, falls nötig
    if (newName !== oldName && oldName && monatObj[oldName]) {
      monatObj[newName] = event;
      delete monatObj[oldName];
    }

  } else {
    // 🔹 Neues Event anlegen
    event = monatObj[newName] = {
      dates: [],
      owner: username,
      isWeekly: weekmarket === true
    };

    // Datum direkt hinzufügen
    if (!event.isWeekly && tagString) {
      event.dates.push({ day: tagString.day, month: tagString.month, year: tagString.year });
    } else if (event.isWeekly && tagString) {
      event.dates.push(tagString);
    }
  }

  // 🔹 Events-Array aktualisieren
  if (!Array.isArray(monatObj.events)) monatObj.events = [];
  if (!monatObj.events.includes(newName)) monatObj.events.push(newName);

  // 🔹 Doppelte Termine entfernen
  if (Array.isArray(event.dates)) {
    event.dates = event.dates.filter((d, i, arr) =>
      arr.findIndex(x => x.day === d.day && x.month === d.month && x.year === d.year) === i
    );
  }

  // 🔹 Globale Daten zurückschreiben
  eventDataGlobal = eventData;
}


// Utility zum Parsen von Datumstrings
function parseDate(d, fallbackYear) {
  if (typeof d === "object" && d !== null) {
    return { day: d.day, month: d.month, year: d.year ?? fallbackYear };
  }
  if (typeof d === "string") {
    const [day, month] = d.split(".").map(Number);
    return { day, month: month - 1, year: fallbackYear };
  }
  throw new Error("Ungültiges Datum: " + d);
}

async function speichernEvent(name, month, region, isWeekly, oldName = null, newStart, newEnd) {
 console.log("speichern aufgerufen");
 if (!isUpdate) {
  oldName = null;
}




    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("❌ Kein Token gefunden, bitte einloggen!");
        return;
    }

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
    if (!payload?.username) {
        console.error("❌ Kein Username im Token gefunden");
        return;
    }
    const username = payload.username;

    await loadRegionData();
    if (!eventDataGlobal || !Array.isArray(eventDataGlobal) || eventDataGlobal.length === 0) {
  console.warn("⚠️ eventDataGlobal leer – initialisiere neue Monatsstruktur...");
  eventDataGlobal = months.map(m => ({ month: m, events: [] }));
}


    let eventData = [...eventDataGlobal];
    let listofRegion = { ...listofRegionGlobal };

let existingEvent = eventData.find(e => e.events && e.events.includes(name));

if(existingEvent){
   alert(`⚠️ Das Event "${name}" existiert bereits im Monat ${existingEvent.month}!`);
   resetEventState();
   return;
}


    // ggf. alte Daten sichern (wenn umbenannt wurde)
    let oldEventData = null;
    if (oldName) {
        for (const monat of eventData) {
            if (monat[oldName]) {
                oldEventData = JSON.parse(JSON.stringify(monat[oldName]));
               
            }
        }
    }

    // Existiert dieses Event bereits in irgendeinem Monat?
const existingWeeklyEvent = eventData
  .map(m => m[oldName || name])
  .find(ev => ev !== undefined);

const isExistingWeekly = existingWeeklyEvent?.isWeekly === true;

    const oldDates = oldEventData?.dates || [];

    // Globale States setzen (damit alle Funktionen konsistent sind)
    selectedStart = { year: newStart.getFullYear(), month: newStart.getMonth(), day: newStart.getDate() };
    selectedEnd   = (newEnd && newEnd.getTime() !== newStart.getTime())
        ? { year: newEnd.getFullYear(), month: newEnd.getMonth(), day: newEnd.getDate() }
        : null;

    // Prüfen, ob Start- oder Enddatum geändert wurde
    let oldStart = oldDates.length ? new Date(oldDates[0].year, oldDates[0].month, oldDates[0].day) : null;
    let oldEnd   = oldDates.length ? new Date(oldDates[oldDates.length - 1].year, oldDates[oldDates.length - 1].month, oldDates[oldDates.length - 1].day) : null;

    let changeType = null;
    if (oldStart && oldStart.getTime() !== newStart.getTime()) changeType = "start";
    else if (oldEnd && oldEnd.getTime() !== newEnd.getTime()) changeType = "end";
const opts = { oldStart, oldEnd, changeType };
    // Sonderfall: vorher Wochenmarkt → jetzt kein Wochenmarkt
    if (changeType === "start" && oldEventData?.isWeekly && !isWeekly) {
        changeType = null;
    }

    // Jetzt Events eintragen
    let current = new Date(newStart);
     

   // Sonderfall: vorher Wochenmarkt → jetzt Einzeltermin
if (!isWeekly && oldEventData?.isWeekly) {
    eventData.forEach(monat => {
        if (monat[oldName]) {
            delete monat[oldName];
            if (Array.isArray(monat.events)) {
                monat.events = monat.events.filter(ev => ev !== oldName);
            }
        }
    });
}


    if (isWeekly ) {
        
        weekmarketGlobal = isWeekly;
        const { eventData: weeklyData, listofRegion: weeklyRegions } =
            await dateOfRecurringEvents(name, username, true,oldName, oldEventData);
            // === direkt nach:

if (oldName && oldName === name && oldEventData?.isWeekly) {
 
  eventData.forEach(m => {
    if (m[oldName] && Array.isArray(m[oldName].dates)) {
      m[oldName].dates = [];
    }
  });
}


        weeklyData.forEach(weekMonth => {
            let monatObj = eventData.find(m => m.month === weekMonth.month);

           
            if (!monatObj) {
                monatObj = { month: weekMonth.month, events: [] };
                eventData.push(monatObj);
            }
             // Alte Einzeltage löschen, falls jetzt Wochenmarkt
    if (oldName && oldEventData && !oldEventData.isWeekly && isWeekly) {
        if (monatObj[oldName]) {
           
            delete monatObj[oldName];
            if (Array.isArray(monatObj.events)) {
                monatObj.events = monatObj.events.filter(ev => ev !== oldName);
            }
        }
    }
            weekMonth.events.forEach(evName => {
               const isExistingWeekly = oldEventData?.isWeekly && oldName === evName;
                weekMonth[evName].dates.forEach(d => {
                    mergeOrUpdateEvent(monatObj, oldName, evName, d, username, true, true,opts,isExistingWeekly);
                    });
            });
        });
    } else {

if (!isWeekly && oldName) {
  // Alte Termine des Einzel-Events komplett löschen
  eventData.forEach(monat => {
    const e = monat[oldName];
    if (e && !e.isWeekly && Array.isArray(e.dates)) {
      e.dates = [];
    }
  });

  // Neues Datum eintragen
  const monthName = months[newStart.getMonth()];
  let monatObj = eventData.find(m => m.month === monthName);
  if (!monatObj) {
    monatObj = { month: monthName, events: [] };
    eventData.push(monatObj);
  }

  if (!monatObj[oldName]) {
    monatObj[oldName] = {
      dates: [],
      owner: username,
      isWeekly: false
    };
    if (!monatObj.events.includes(oldName)) monatObj.events.push(oldName);
  }

  monatObj[oldName].dates.push({
    day: newStart.getDate(),
    month: newStart.getMonth(),
    year: newStart.getFullYear()
  });
}






      
        //  normale Events → Zeitraum durchlaufen
       while (current <= newEnd) {
    const monthName = months[current.getMonth()];
    let monatObj = eventData.find(m => m.month === monthName);
    if (!monatObj) {
        monatObj = { month: monthName, events: [] };
        eventData.push(monatObj);
    }

    // Alte Wochenmarkt-Einträge löschen, falls Wochenmarkt -> Einzel
    if (isUpdate && oldEventData?.isWeekly && !isWeekly) {
        if (monatObj[oldName]) {
            console.log(`🧹 Wochenmarkt "${oldName}" wird zu Einzelevent – alte Termine entfernen`);
            delete monatObj[oldName];
            if (Array.isArray(monatObj.events)) {
                monatObj.events = monatObj.events.filter(ev => ev !== oldName);
            }
        }
    }

    // Tag-Objekt für mergeOrUpdateEvent
    const tagString = {
        day: current.getDate(),
        month: current.getMonth(),
        year: current.getFullYear(),
        start: { ...selectedStart },
        end: selectedEnd ? { ...selectedEnd } : null
    };

    // Event eintragen oder updaten
    mergeOrUpdateEvent(
        monatObj,
        oldName && oldName !== name ? oldName : null,
        name,
        tagString,
        username,
        isWeekly,
        true,
        { changeType, oldStart, oldEnd },
        isExistingWeekly
    );

    // events-Array aktuell halten
    if (!monatObj.events.includes(name)) monatObj.events.push(name);

    // Termine sortieren
    if (monatObj[name] && Array.isArray(monatObj[name].dates)) {
        monatObj[name].dates.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            if (a.month !== b.month) return a.month - b.month;
            return a.day - b.day;
        });
    }

    current.setDate(current.getDate() + 1);
}
    }

    // Alten Namen entfernen, falls geändert
    if (oldName && oldName !== name) {
        eventData.forEach(monat => {
            if (Array.isArray(monat.events)) {
                monat.events = monat.events.filter(ev => ev !== oldName);
            }
            delete monat[oldName];
        });
        for (const reg in listofRegion) {
            listofRegion[reg].regions =
                listofRegion[reg].regions.filter(ev => ev !== oldName);
        }
    }

    // Regionenliste aktualisieren
    if (!listofRegion[region]) {
        listofRegion[region] = { regions: [] };
    }
    if (!listofRegion[region].regions.includes(name)) {
        listofRegion[region].regions.push(name);
    }

    // Globale Daten setzen
    eventDataGlobal = eventData;
    listofRegionGlobal = listofRegion;

    // Payload an Server senden
    const payloadToServer = {
        eventData: eventDataGlobal,
        listofRegion: listofRegionGlobal,
        weekmarket: isWeekly,
        oldName: oldName,
        newName: name
    };

    try {
        await fetch('/save-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payloadToServer) 
        });
       

        // UI aktualisieren
        const monatObj = eventDataGlobal.find(m => m.month === months[month]);
        // Direkt nach mergeOrUpdateEvent
if (!monatObj[name]) {
    console.warn(`Event "${name}" existiert noch nicht in ${monatObj.month}, lege leeres Array an`);
    monatObj[name] = { dates: [], owner: username, isWeekly: isWeekly };
}

datesOfEvents = monatObj[name].dates;

        datesOfEvents = monatObj?.[name]?.dates || [];


        // 🔹 Nach erfolgreichem Speichern: State sauber zurücksetzen


        await renderEvents();
        await showDropdownMenu(listofRegionGlobal, region);
        renderCalendar();
        createButtonActive = false;

    } catch (err) {
        console.error("❌ Fehler in speichernEvent:", err);
    }
}




function checkEventConsistency(eventData) {
  eventData.forEach(monatObj => {
    const keys = Object.keys(monatObj).filter(k => !["month", "events", "owner"].includes(k));
    const list = monatObj.events;
  
    const diff1 = list.filter(l => !keys.includes(l));
    const diff2 = keys.filter(k => !list.includes(k));
    if (diff1.length || diff2.length) {
      console.warn("⚠️ Inkonsistenz gefunden!", { diff1, diff2 });
    }
  });
}
async function loeschenEvent(name, region) {
    await loadRegionData();
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("❌ Kein Token gefunden, bitte einloggen!");
        return;
    }

    // 🔹 Kopien der globalen Daten
    let eventData = [...eventDataGlobal];
    let listofRegion = { ...listofRegionGlobal };

    // 🔹 Alle Monate, die dieses Event enthalten
    const monateMitEvent = eventData.filter(m => m[name]); // Direkt auf Eventobjekt prüfen

    if (monateMitEvent.length === 0) {
        console.warn(`⚠️ Event "${name}" nicht gefunden!`);
        return;
    }

    try {
        // 🔹 Server-Requests parallel
        await Promise.all(monateMitEvent.map(async (monatObj) => {
            const payload = { month: monatObj.month, eventName: name };
            try {
                const res = await fetch('/delete-event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) {
                    console.warn(`Server-Fehler für ${monatObj.month}: ${res.status}`);
                }
            } catch (error) {
                console.error(`❌ Fehler beim Löschen von ${monatObj.month}:`, error);
            }
        }));

        // 🔹 Lokale Daten aktualisieren
        eventData.forEach(monat => {
            const e = monat[name];
            if (e) {
                // Wochenmärkte: global löschen
                if (e.isWeekly) {
                    delete monat[name];
                    monat.events = monat.events.filter(ev => ev !== name);
                } else {
                    // Normale Events: nur aus dem aktuellen Monat löschen
                    if (monat.events.includes(name)) {
                        delete monat[name];
                        monat.events = monat.events.filter(ev => ev !== name);
                    }
                }
            }
        });

        // 🔹 Regionsliste bereinigen
        if (region && listofRegion[region] && Array.isArray(listofRegion[region].regions)) {
            listofRegion[region].regions = listofRegion[region].regions.filter(ev => ev !== name);
            if (listofRegion[region].regions.length === 0) delete listofRegion[region];
        }

        // 🔹 Globale Daten setzen
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

function bindEvents(){
  if (window._showEventsBound) return;
window._showEventsBound = true;
}




function showEvents(currMonth) {
  // Alten Listener entfernen, falls vorhanden
  if (window._showEventsHandler) {
    document.body.removeEventListener("click", window._showEventsHandler);
  }

  // Neuer Handler
  const handler = async e => {
    if (e.target.closest(".update-btn") || e.target.closest(".delete-btn")) return;

    const item = e.target.closest(".dropdown-item");
    if (!item) return;

    const menu = item.closest(".dropdown-menu");
    if (!menu) return;

    e.preventDefault();
    recurringDaysOfEvents.length = 0;

    menu.querySelectorAll(".dropdown-item.active").forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    const createBtn = document.getElementById("create");
    if (createBtn) createBtn.style.display = "block";
    noneFormAttributes();
  let period = document.getElementById("period");
      if(period){
      period.style.display = "block";
      }

    const a = await getData();
    eventDataGlobal = a.eventData;

    const monatName = getMonatsname(currMonth + 1);
    const monatObj = eventDataGlobal.find(m => m.month === monatName);
    const marktName = item.dataset.name;

    if (monatObj && monatObj[marktName]) {
      weekmarketGlobal = monatObj[marktName].isWeekly;
      datesOfEvents = monatObj[marktName].dates || [];
      eventId = marktName;
      renderCalendar();
    } else {
      weekmarketGlobal = false;
      datesOfEvents = [];
    }
  };

  // Speichern, damit wir ihn beim nächsten Mal entfernen können
  window._showEventsHandler = handler;
  document.body.addEventListener("click", handler); 
}









const renderEvents = async () => {
 
    let found = false;
    let isInEvents = false;
    actualEvents = [];
  const mittelrhein = document.getElementById('MittelrheinAdmin');
	const oberrhein = document.getElementById('OberrheinAdmin');

const currentMonthName = months[currMonth]; // 0-basiert
const monthObj = eventDataGlobal.find(m => m.month === currentMonthName);
if (!monthObj) {
  console.warn("Kein Monatsobjekt gefunden:", currentMonthName);
}

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
   
    currentRegion= region;
    return;
  }
	const params = new URLSearchParams(window.location.search);
	   currentRegion = params.get('region');
	  
 
	   if (currentRegion ) {
			await loadRegionData();
		 if (!listofRegionGlobal[currentRegion]) {
            console.warn(`Region "${currentRegion}" nicht gefunden.`);
            //navigateToRegionDisplay();
           // return;
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

    if (!Array.isArray(monthObj.events)) return copy;

    monthObj.events.forEach(name => {
      const event = monthObj[name];

      if (Array.isArray(event)) {
        // Altes Schema → Array von Strings
        copy[name] = event
          .filter(Boolean)
          .map(str => {
            const [day, month] = str.split(".").map(Number);
            return { day, month: month - 1, year };
          });

      } else if (event && Array.isArray(event.dates)) {
        // Neues Schema → Objekt mit dates[]
        copy[name] = {
          owner: event.owner,
          isWeekly: !!event.isWeekly,
          dates: event.dates
            .filter(Boolean)              // nur gültige Einträge
            .map(d => {
              if (typeof d === "string") {
                const [day, month] = d.split(".").map(Number);
                return { day, month: month - 1, year };
              }
              if (typeof d === "object") {
                return {
                  ...d,
                  year: d.year != null ? d.year : year
                };
              }
              return null;                // alles andere überspringen
            })
            .filter(Boolean)
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
    console.log("create button geklickt!");
     createButtonActive = true;
      e.preventDefault(); 
      resetEventState();
      getFormAttributes();
  
   });
   renderCalendar();
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
async function showDropdownMenu(listofRegion, regionName) {

     const dropdownList = document.querySelector(".dropdown-menu");
    dropdownList.innerHTML = ""; // immer leeren
    if (typeof listofRegion !== 'object' || listofRegion === null || Array.isArray(listofRegion)) {
        console.error("❌ Fehler: listofRegion ist kein gültiges Objekt:", listofRegion);
        alert(`⚠️ Für diese Region existiert noch kein Eintrag.`);
        return;
    }

   const regionData = listofRegion[regionName];
    if (!regionData || !Array.isArray(regionData.regions)) {
        console.warn(`⚠️ Region "${regionName}" enthält keine Events oder Wochenmärkte.`);
        dropdownList.innerHTML = `
            <div class="dropdown-item" style="text-align:center; color:#999;">
                ⚠️ Für diese Region wurden noch keine Termine eingetragen.
            </div>
        `;
        return;
    }

 

    const currMonthName = months[currMonth];
    const monthObj = eventDataGlobal.find(m => m.month === currMonthName);
    if (!monthObj) { dropdownList.innerHTML = `
            <div class="dropdown-item" style="text-align:center; color:#999;">
                ⚠️ Für diesen Monat gibt es noch keine Veranstaltungen.
            </div>
        `;
        return;
    }

    const actualEvents = monthObj.events.filter(evName => regionData.regions.includes(evName));
    if (!actualEvents.length){dropdownList.innerHTML = `
        <div class="dropdown-item" style="text-align:center; color:#999;">
            ⚠️ Für diese Region wurden noch keine Termine im aktuellen Monat eingetragen.
        </div>
    `;
   return;
  }
      
     

    // 🔹 Dropdown Items erzeugen
    actualEvents.forEach(marktName => {
        const evObj = monthObj[marktName];
        if (!evObj || !Array.isArray(evObj.dates) || evObj.dates.length === 0) return;

        const isActive = (eventId === marktName) ? "active" : "";
        const owner = evObj.owner || null;
        const currentOwner = localStorage.getItem("currentOwner");
        const isOwner = owner === currentOwner || currentOwner === "admin";

        let singleEvent = `
            <div class="dropdown-item ${isActive}" data-name="${marktName}"
                 style="display:flex; justify-content:space-between; align-items:center; padding:12px 8px;">
                <span class="name">${marktName}</span>`;

        if (window.location.pathname.endsWith("admin.html") && isOwner) {
            singleEvent += `
               <div style="display:flex; gap:6px;">
                        <button type="button" class="update-btn" title="Bearbeiten" aria-label="Bearbeiten"
                                style="background:#4CAF50; border:none; color:white; padding:4px 6px; border-radius:4px; cursor:pointer;">✎</button>
                        <button type="button" class="delete-btn" title="Löschen" aria-label="Löschen"
                                style="background:#f44336; border:none; color:white; padding:4px 6px; border-radius:4px; cursor:pointer;">🗑</button>
                    </div>`;
        }

        singleEvent += `</div>`;
        dropdownList.insertAdjacentHTML("beforeend", singleEvent);
    });

    // 🔹 Klick-Handler für Dropdown (delegation)
    dropdownList.onclick = async (e) => {
        const item = e.target.closest(".dropdown-item");
        if (!item) return;
     
        //  EventId setzen
        eventId = item.dataset.name;
        marktNameGlobal = eventId;

        //  Active-Klasse setzen
      dropdownList.querySelectorAll(".dropdown-item").forEach(el => {
    // Active-Klasse entfernen
    el.classList.remove("active");

    // Bild ausblenden, falls vorhanden
    const img = el.querySelector(".langosIcon");
    if (img) img.style.display = "none";
});

  item.classList.add("active");
      
 // Bild ausblenden, falls vorhanden
      
      
        let img = item.querySelector(".langosIcon");
         
    if (!img) {
        // Bild noch nicht erstellt? Dann anfügen
        img = document.createElement("img");
        img.src = "./imagesOptimized/images/langosIcon.png";
        img.alt = "langosIcon";
        img.classList.add("langosIcon");
        img.style.marginLeft = "2em";
        img.style.marginTop = "2em";
        
        item.appendChild(img);
    }
    img.style.display = "block";

        //  Prüfen ob Update oder Delete
        if (e.target.closest(".update-btn")) {

          if (window.innerWidth < 768) {
                    document.getElementById("calendar").scrollIntoView({ behavior: "smooth" });
                }
            isUpdate = true;
            noneFormAttributes();
            const period = document.getElementById("period");
            if (period) period.style.display = "block";

            document.getElementById("eventname").value = eventId;
            await loadEvents();
            renderEventTimeRange(eventId);
            getFormAttributes();
        } else if (e.target.closest(".delete-btn")) {
            const isWeekly = item.dataset.weekly === "true";
            showDeleteConfirmation(regionName, eventId, currMonth, currYear, isWeekly);
        } else {
            // Klick auf das Event selbst (nicht Button)
            isUpdate = false;
            renderEventTimeRange(eventId);
        }
    };

    // 🔹 Mobile Layout Anpassung
    requestAnimationFrame(() => {
        const height = dropdownList.getBoundingClientRect().height;
        const calendar = document.querySelector(".calendar");
        if (!calendar) return;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
            let newTop = 10;
            if (height > 253) newTop = 10;
            else if (height > 157 && height <= 252) newTop = 8;
            else if (height > 252 && height <= 253) newTop = 15;

            calendar.style.setProperty("position", "relative", "important");
            calendar.style.setProperty("top", newTop + "%", "important");
        }
    });
}

// 🔹 Hilfsfunktion: Zeitraum berechnen & anzeigen
function renderEventTimeRange(marktName) {
    const monatObj = eventDataGlobal.find(m => m.month === months[currMonth]);
    if (!monatObj) return;

    const eventObj = monatObj[marktName];
    if (!eventObj || !eventObj.dates) return;

    const dates = [...eventObj.dates];
    dates.sort((a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day));

    selectedStart = parseDate(dates[0]);
    selectedEnd = parseDate(dates[dates.length - 1]);

    const startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
    const endDate = new Date(selectedEnd.year, selectedEnd.month, selectedEnd.day);

    let zeitraum = (startDate.getTime() === endDate.getTime())
        ? `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`
        : `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()} - ` +
          `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;

    const eventTemp = document.getElementById("eventTemp");
    if (eventTemp) eventTemp.innerHTML = `<span><strong>Zeitraum: </strong></span>` + zeitraum;
}



prevNextIcon.forEach(icon => {
  
    icon.addEventListener("click", async handleClick => {
        await loadRegionData();
        clearMessage();
   if (weekmarketGlobal) {
      selectedStart = null; 
      selectedEnd   = null;
    }
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
    
      
    
    await getRegions();
    const monatName = getMonatsname(currMonth + 1);
    const monatObj = eventDataGlobal.find(m => m.month === monatName);
    if (eventId && monatObj && monatObj[eventId]) {
        datesOfEvents = monatObj[eventId].dates || [];
    } else {
        datesOfEvents = [];
    }
    
    await renderEvents();
    await showDropdownMenu(listofRegionGlobal, currentRegion);
    renderCalendar();   
    
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
    console.log("toggle");
    // Body overflow toggeln
    document.body.style.overflow = checkbox.checked ? 'hidden' : 'auto';

    // Main ausblenden
    main.classList.toggle('hidden', checkbox.checked);
    main.classList.remove('open');

    // Footer ausblenden
    footer.classList.toggle('hidden', checkbox.checked);
    footer.classList.remove('open');
  });
});


const dateOfRecurringEvents = async (eventName, username, weekmarket, oldName = null, oldEventData = null) => {
    const serverData = await getData();

    let eventData = serverData?.eventData || [];
    let listofRegion = serverData?.listofRegion || {};
    recurringMarketDates.length = 0;

    // Alte Daten bereinigen
    if (oldName && oldEventData) {
        for (const monat of eventData) {
            if (monat[oldName]) {
                delete monat[oldName];
                if (Array.isArray(monat.events)) {
                    monat.events = monat.events.filter(ev => ev !== oldName);
                }
            }
        }
    }
// 🔹 Alte Wochenmarkt-Einträge vollständig entfernen, falls Update des gleichen Namens
if (oldName && oldName === eventName) {
  for (const monat of eventData) {
    if (monat[eventName]?.isWeekly) {
      delete monat[eventName]; // Event-Objekt löschen
      if (Array.isArray(monat.events)) {
        monat.events = monat.events.filter(ev => ev !== eventName); // auch aus events[] entfernen
      }
    }
  }
}

    const monthName = months[selectedStart.month];
    let monatObj = eventData.find(m => m.month === monthName);
    if (!monatObj) {
        monatObj = { month: monthName, events: [] };
        eventData.push(monatObj);
    }

    if (!monatObj[eventName]) {
        monatObj[eventName] = { dates: [], owner: username, isWeekly: weekmarket };
    }

    const event = monatObj[eventName];
    event.owner = event.owner || username;
    event.isWeekly = weekmarket;

    // Termine vorbereiten (UTC)
    const startDate = new Date(selectedStart.year, selectedStart.month, selectedStart.day);

    // Wochentage für Wochenmarkt ermitteln
    if (weekmarket) {
        const dtfBerlin = new Intl.DateTimeFormat('de-DE', { weekday: 'long', timeZone: 'Europe/Berlin' });

        // Vorwärts durch das Jahr
        let forward = new Date(startDate);
        const currYear = startDate.getFullYear();

        while (forward.getFullYear() === currYear) {
            recurringMarketDates.push({
                day: forward.getDate(),
                month: forward.getMonth(),
                year: forward.getFullYear()
            });
            forward.setDate(forward.getDate() + 7);
        }

        // Rückwärts durch das Jahr
        let backward = new Date(startDate);
        backward.setDate(backward.getDate() - 7);
        while (backward.getFullYear() === currYear) {
            recurringMarketDates.push({
                day: backward.getDate(),
                month: backward.getMonth(),
                year: backward.getFullYear()
            });
            backward.setDate(backward.getDate() - 7);
        }

        // Sortieren
        recurringMarketDates.sort((a, b) =>
            a.year - b.year ||
            a.month - b.month ||
            a.day - b.day
        );
    } else {
        // Einzeltermine: einfach den Start nehmen
        recurringMarketDates.push({
            day: startDate.getDate(),
            month: startDate.getMonth(),
            year: startDate.getFullYear()
        });
    }



    // Termine pro Monat eintragen
    recurringMarketDates.forEach(dateObj => {
        const monthName = months[dateObj.month];
        let monthEntry = eventData.find(e => e.month === monthName);
        if (!monthEntry) {
            monthEntry = { month: monthName, events: [] };
            eventData.push(monthEntry);
        }

        if (!monthEntry.events.includes(eventName)) monthEntry.events.push(eventName);

        if (!monthEntry[eventName]) {
            monthEntry[eventName] = { dates: [], owner: username, isWeekly: weekmarket };
        }

        const exists = monthEntry[eventName].dates.some(d =>
    d && 
    Number(d.day) === Number(dateObj.day) &&
    Number(d.month) === Number(dateObj.month) &&
    Number(d.year) === Number(dateObj.year)
);

        if (!exists) monthEntry[eventName].dates.push(dateObj);
    });

    eventData.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

    // Globale Daten aktualisieren
    eventDataGlobal = eventData;
    listofRegionGlobal = listofRegion;
    renderCalendar();

    return { eventData, listofRegion };
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
