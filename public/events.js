
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
  eventId = '';
  selectedStart = null;
  selectedEnd = null;
  period = '';
  document.getElementById('eventTemp').innerHTML = period; // Zeitraum leeren
  document.getElementById('eventname').value = period; // Eventname leeren
}

if (window.location.pathname.endsWith("admin.html")){
const token = localStorage.getItem("jwt");
if (!token) {
  // kein Login vorhanden → zurück zur Login-Seite
  window.location.href = "/login.html";
}


}

let createButtonActive = false;

// 🟢 Nur einmal definieren, außerhalb von renderCalendar()
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "create") {
    createButtonActive = true;
    console.log("✳️ Create-Modus aktiviert");
  }
});
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





// Klicks auf Tage nur zulassen, wenn Create-Modus aktiv ist
/*document.querySelectorAll(".days li").forEach(li => {
  const day = parseInt(li.dataset.day, 10);
  if (!isNaN(day)) {
    li.addEventListener("click", () => {
      if (!createButtonActive && !isUpdate) {
        console.warn("⚠️ Erst 'Create' klicken, um einen Tag zu wählen.");
        return;
      }
      onDayClick(day);
      // optional: Create-Modus wieder deaktivieren, wenn du nur 1x klicken willst
      // createButtonActive = false;
    });
  }
});*/
// Nur einmal am Anfang setzen:
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
        //renderCalendar();                  // danach Kalender zeichnen
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
          // renderCalendar();
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
  
 
 


/*function mergeOrUpdateEvent(
    monatObj,
    oldName,
    newName,
    tagString,
    username,
    weekmarket,
    isUpdate  ,
    opts = {}
) {


  if (oldName && monatObj[oldName]?.isWeekly && !weekmarket) {
    // Alte Wochenmarkt-Termine löschen
    monatObj[oldName].dates = [];
    monatObj[oldName].isWeekly = false;
}



    const changeType = opts.changeType; // "start" | "end" | null
  
const oldStart = opts.oldStart;
const oldEnd = opts.oldEnd;

    let eventData = eventDataGlobal;
    let event = null;
    // Wenn altes Event ein Einzeltermin war, aber jetzt Wochenmarkt wird → alte Einträge löschen
if (oldName && monatObj[oldName] && !monatObj[oldName].isWeekly && weekmarket) {
    // Alle Monate prüfen
    eventData.forEach(m => {
        if (m !== monatObj && m[oldName]) {
            delete m[oldName];
            if (Array.isArray(m.events)) {
                m.events = m.events.filter(ev => ev !== oldName);
            }
        }
    });
}

    // Event existiert unter altem Namen?
   if ((oldName && monatObj[oldName]) || monatObj[newName]) {

        event = monatObj[oldName] || monatObj[newName];
        event.owner = event.owner || username;
        event.isWeekly = weekmarket === true;

        // Wenn das Event NICHT wöchentlich ist, alte Monate löschen
        if (!event.isWeekly) {
            eventData.forEach(m => {
                if (m !== monatObj && m[newName]) {
                    delete m[newName];
                    if (Array.isArray(m.events)) {
                        m.events = m.events.filter(ev => ev !== newName);
                    }
                }
            });
        }
        if (event.isWeekly && !weekmarket) {
        event.dates = event.dates
            .filter(d => d && typeof d === 'object' && 'day' in d)
            .map(d => ({ day: d.day, month: d.month, year: d.year }));
    }

        // Start-End Logik für Updates (nur im aktuellen Monat)
if (!weekmarket && isUpdate && selectedStart) {
            const start = selectedStart;
            const end = selectedEnd || selectedStart;
    
            // Alte Termine innerhalb des Bereichs löschen
            if (!weekmarket && isUpdate && oldStart && oldEnd) {
    event.dates = event.dates.filter(d => {
        const date = new Date(d.year, d.month, d.day);
        const startDate = new Date(oldStart.year, oldStart.month, oldStart.day);
        const endDate = new Date(oldEnd.year, oldEnd.month, oldEnd.day);
        return date < startDate || date > endDate; // lösche nur die alten Tage
    });
}
          

            // Neue Termine hinzufügen
           let current = new Date(tagString.start.year, tagString.start.month, tagString.start.day);
           const last = tagString.end ? new Date(tagString.end.year, tagString.end.month, tagString.end.day) : current;

 if (current.getTime() === endDate.getTime()) {
        const day = current.getDate();
        const month = current.getMonth();
        const year = current.getFullYear();

        if (!event.dates.some(d => d.day === day && d.month === month && d.year === year)) {
            event.dates.push({ day, month, year });
        }
 }else{  while (current <= last) {
                if (!event.dates.some(d =>
                    d.day === current.getDate() &&
                    d.month === current.getMonth() &&
                    d.year === current.getFullYear()
                )) {
                    event.dates.push({
                        day: current.getDate(),
                        month: current.getMonth(),
                        year: current.getFullYear()
                    });
                }
                current.setDate(current.getDate() + 1);
            }
          
          }

          

        } else if (!weekmarket && tagString) {
            // Einzelne Tage hinzufügen (kein Update)
            if (!event.dates.some(d =>
                d.day === tagString.day &&
                d.month === tagString.month &&
                d.year === tagString.year
            )) {
                event.dates.push({
                    day: tagString.day,
                    month: tagString.month,
                    year: tagString.year
                });
            }
        } else if (weekmarket && tagString) {
            // Wöchentliche Events
            if (changeType === "start") {
                event.dates.push(tagString);
            } else if (changeType === "end") {
                if (!event.dates.some(d =>
                    d.day === tagString.day &&
                    d.month === tagString.month &&
                    d.year === tagString.year
                )) {
                    event.dates.push(tagString);
                }
            } else {
                if (!event.dates.some(d =>
                    d.day === tagString.day &&
                    d.month === tagString.month &&
                    d.year === tagString.year
                )) {
                    event.dates.push(tagString);
                }
            }
        }

        // Event umbenennen, falls Name geändert wurde
        if (newName !== oldName) {
            monatObj[newName] = event;
            delete monatObj[oldName];
        }

    } else {
        // Neues Event anlegen
        monatObj[newName] = {
            dates: (tagString && typeof tagString === "object") ? [tagString] : [],
            owner: username,
            isWeekly: weekmarket === true
        };
        event = monatObj[newName];
    }
            // am Ende von mergeOrUpdateEvent:
        if (!Array.isArray(monatObj.events)) monatObj.events = [];
        if (!monatObj.events.includes(newName)) {
            monatObj.events.push(newName);
        }


    // Globale Daten aktualisieren
    eventDataGlobal = eventData;
}*/
function mergeOrUpdateEvent(
  monatObj,
  oldName,
  newName,
  tagString,
  username,
  weekmarket,
  isUpdate,
  opts = {}
) {
  // Hilfsfunktionen
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

  // lokale Referenz auf globale Daten
  let eventData = eventDataGlobal || [];
  let event = null;

  // 1) Bestimme, ob Event bereits im aktuellen Monat existiert (unter oldName oder newName)
  const existingNameInThisMonth = (oldName && monatObj[oldName]) ? oldName : (monatObj[newName] ? newName : null);

  // 2) Wenn vorhanden: merke alten Weekly-State, denn wir müssen ggf. andere Monate bereinigen
  if (existingNameInThisMonth) {
    event = monatObj[existingNameInThisMonth];
    const wasWeekly = event.isWeekly === true;
    const isNowWeekly = weekmarket === true;

    // Wenn sich der Weekly-Status ändert (egal in welche Richtung),
    // entferne Kopien/Einträge des gleichen Eventnamens in anderen Monaten.
    if (wasWeekly !== isNowWeekly) {
      eventData.forEach(m => {
        if (m !== monatObj && m[existingNameInThisMonth]) {
          delete m[existingNameInThisMonth];
          if (Array.isArray(m.events)) {
            m.events = m.events.filter(e => e !== existingNameInThisMonth);
          }
        }
      });
    }
  }

  // 3) Wenn Event unter altem oder neuem Namen existiert: updaten (auch falls oldName null)
  if ((oldName && monatObj[oldName]) || monatObj[newName]) {
    event = monatObj[oldName] || monatObj[newName];
    event.owner = event.owner || username;

    // Merke vorherigen Zustand, falls du später darauf referenzieren willst
    const previousWasWeekly = event.isWeekly === true;
    event.isWeekly = weekmarket === true;

    // Wenn das Event NICHT wöchentlich ist, entferne event unter neuem Namen in anderen Monaten
    if (!event.isWeekly) {
      eventData.forEach(m => {
        if (m !== monatObj && m[newName]) {
          delete m[newName];
          if (Array.isArray(m.events)) {
            m.events = m.events.filter(ev => ev !== newName);
          }
        }
      });
    }

    // Falls wir von Wochenmarkt -> Einzel wechseln: normalisiere dates-Form
    if (event.isWeekly && !weekmarket) {
      event.dates = event.dates
        .filter(d => d && typeof d === 'object' && 'day' in d)
        .map(d => ({ day: d.day, month: d.month, year: d.year }));
    }

    // Start/End-Update-Logik (nur für Nicht-Wochenmärkte)
    const changeType = opts.changeType;
    const oldStart = opts.oldStart;
    const oldEnd = opts.oldEnd;
console.log("🧭 oldStart:", oldStart);
console.log("🧭 oldEnd:", oldEnd);

    if (!event.isWeekly && isUpdate && selectedStart) {
      // Alte Termine im alten Bereich löschen (wenn oldStart/oldEnd angegeben)
      if (oldStart && oldEnd) {
        const sOld = toDate(oldStart);
        const eOld = toDate(oldEnd);
       event.dates = event.dates.filter(d => {
  if (!d || typeof d !== "object") return false;

  const date = new Date(d.year, d.month - 1, d.day); // 👈 month - 1!
  const startDate = new Date(oldStart.year, oldStart.month - 1, oldStart.day);
  const endDate = new Date(oldEnd.year, oldEnd.month - 1, oldEnd.day);

  // Wenn Tag im Bereich liegt (inklusive Start/Ende) → löschen
  const inRange = date >= startDate && date <= endDate;
  return !inRange;
});
      }

      // Neue Termine hinzufügen (Range in tagString)
      if (tagString && tagString.start) {
        addDateRangeToEvent(event, tagString.start, tagString.end);
      }
    } else if (!event.isWeekly && tagString) {
      // Einzelne Tage hinzufügen (kein Update)
      if (!event.dates.some(d => d.day === tagString.day && d.month === tagString.month && d.year === tagString.year)) {
        event.dates.push({ day: tagString.day, month: tagString.month, year: tagString.year });
      }
    } else if (event.isWeekly && tagString) {
      // Wöchentliche Events (push, falls nicht vorhanden)
      if (!event.dates.some(d => d.day === tagString.day && d.month === tagString.month && d.year === tagString.year)) {
        event.dates.push(tagString);
      }
    }

    // Rename, falls nötig
    if (newName !== oldName && oldName && monatObj[oldName]) {
      monatObj[newName] = event;
      delete monatObj[oldName];
    }

  } else {
    // 4) Neues Event anlegen
    monatObj[newName] = {
      dates: (tagString && typeof tagString === "object") ? [tagString] : [],
      owner: username,
      isWeekly: weekmarket === true
    };
    event = monatObj[newName];
  }

  // 5) Events-Array aktualisieren (einmalig)
  if (!Array.isArray(monatObj.events)) monatObj.events = [];
  if (!monatObj.events.includes(newName)) {
    monatObj.events.push(newName);
  }

  // 6) Doppelte dates entfernen (safety)
  if (Array.isArray(event.dates)) {
    event.dates = event.dates.filter((d, i, arr) =>
      arr.findIndex(x => x.day === d.day && x.month === d.month && x.year === d.year) === i
    );
  }

  // Globale Daten zurückschreiben
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

    let eventData = [...eventDataGlobal];
    let listofRegion = { ...listofRegionGlobal };

    // ggf. alte Daten sichern (wenn umbenannt wurde)
    let oldEventData = null;
    if (oldName) {
        for (const monat of eventData) {
            if (monat[oldName]) {
                oldEventData = JSON.parse(JSON.stringify(monat[oldName]));
                break;
            }
        }
    }

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


    if (isWeekly) {
        
        weekmarketGlobal = isWeekly;
        const { eventData: weeklyData, listofRegion: weeklyRegions } =
            await dateOfRecurringEvents(name, username, true,oldName, oldEventData);

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
                weekMonth[evName].dates.forEach(d => {
                    mergeOrUpdateEvent(monatObj, oldName, evName, d, username, true, true,opts);
                });
            });
        });
    } else {
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
        { changeType, oldStart, oldEnd }
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
        datesOfEvents = monatObj?.[name]?.dates || [];

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





function showEvents(currMonth) {


   document.querySelector(".dropdown-menu")?.addEventListener("click", async e => {
     
      const item = e.target.closest(".dropdown-item");
      recurringDaysOfEvents.length = 0;

      if (!item) return;
       e.preventDefault(); 
      const menu = item.closest(".dropdown-menu");
      const createBtn = document.getElementById("create");
      if(createBtn){
        createBtn.style.display = "block";
      }
     
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

      if(isUpdate && isUpdate == true){
           marktNameGlobal = marktName;
      }
   
     if (monatObj && monatObj[marktName]) {
     
      weekmarketGlobal = monatObj[marktName].isWeekly;
    }else {
    // fallback, z.B. für neue Events
    weekmarketGlobal = false;
    datesOfEvents = [];
}
      

      if (monatObj && monatObj.events.includes(marktName)) {
        eventId = marktName;
        const evObj = monatObj[marktName];
        datesOfEvents = evObj ? evObj.dates : [];
     
        renderCalendar();
      }

      
    
  });
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
async function showDropdownMenu(listofRegion,regionName){


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
      
    });

    break;
  }
}
		if(actualEvents.length != 0){
	   // --- Wochenmärkte der Region hinzufügen ---
   if (Array.isArray(actualEvents) && actualEvents.length) {
    for (const marktName of regionData.regions) {
      const monthObj = eventDataGlobal.find(m => m.month === months[currMonth]);
      const evObj = monthObj?.[marktName];
      if (actualEvents.includes(marktName) && evObj.dates.length >0) {
         const displayName = marktName; 


        // EIN Wrapper, Buttons darin; name zusätzlich als data-Attribut
        const isActive = (window.location.pathname.endsWith("admin.html") && eventId === marktName ) ? "active" : "";
const monthObj = eventDataGlobal.find(m => m.month === months[currMonth]);
// ➜ Owner für diesen Markt im aktuellen Monat auslesen
    const owner = monthObj[marktName]?.owner || null;
   

        // Wenn du den aktuell eingeloggten User prüfen willst:
    const currentOwner = localStorage.getItem("currentOwner"); // z.B. aus Login
    const isOwner = owner === currentOwner;

        singleEvent += `
           <div class="dropdown-item ${isActive}"
               data-name="${marktName}"
               style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; ">
            <span class="name">${displayName}</span>`
        if (window.location.pathname.endsWith("admin.html") && (isOwner || (currentOwner == "admin"))) {

             singleEvent += `<div style="display:flex; gap:6px;">
              <button type="button" class="update-btn" id="update-btn" title="Bearbeiten" aria-label="Bearbeiten"
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
if (window.location.pathname.endsWith("/admin.html")) {
  dropdownList.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("update-btn")) {
      if (window.innerWidth < 768) {
        document.getElementById("calendar").scrollIntoView({
          behavior: "smooth"
        });
      }
      // ggf. weitere Logik hier
    }
  });
}

  	

dropdownList.addEventListener("click", async function(e) {

    const item = e.target.closest(".dropdown-item");
    const marktName = item.dataset.name;

    

if (window.location.pathname.endsWith("/admin.html")){
   noneFormAttributes();
    let period = document.getElementById("period");
      if(period){
      period.style.display = "block";
      }
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
 let alleTermine = [];

for (const m of eventDataGlobal) {
  if (m.events?.includes(marktName) && m[marktName]?.dates) {
    alleTermine = alleTermine.concat(m[marktName].dates);
  }
}

// Jetzt die früheste und späteste Datumsangabe finden
if (alleTermine.length > 0) {
  // chronologisch sortieren
  alleTermine.sort((a,b)=>{
    const da = parseDate(a);
    const db = parseDate(b);
    return new Date(da.year, da.month, da.day) - new Date(db.year, db.month, db.day);
  });

  selectedStart = parseDate(alleTermine[0]);
  selectedEnd   = parseDate(alleTermine[alleTermine.length - 1]);
}
function getOldRange(datesArray = [], refYear) {
  const parsed = datesArray
    .map(d => parseDate(d, refYear))
    .map(p => new Date(p.year, p.month, p.day));
  if (!parsed.length) return { start: null, end: null };
  parsed.sort((a,b) => a - b);
  return { start: parsed[0], end: parsed[parsed.length - 1] };
}






      const startDate = new Date(
  selectedStart.year,
  selectedStart.month,
  selectedStart.day
);
const endDate = new Date(
  selectedEnd.year,
  selectedEnd.month,
  selectedEnd.day
);


   if(isUpdate && isUpdate== true){
      const monatName = getMonatsname(currMonth + 1);
      let monatObj = eventDataGlobal.find(m => m.month === monatName);
      let eventObj =monatObj[marktNameGlobal];
      const finalName =  marktNameGlobal;
      if (!monatObj) {
        console.warn("Kein Monatsobjekt gefunden:", monatName);
        return;
      }
     
       const endOfArray   = eventObj.dates[eventObj.dates.length - 1];
      

       zeitraum = `${eventObj.dates[0].day}. ${eventObj.dates[0].month+1}` + 
      (endOfArray ?` - ${endOfArray.day}. ${endOfArray.month+1}.` : '' ) +
        `(${currYear})`;

       


    }else{
          if (endDate.getTime() === startDate.getTime()) {
            // ein einzelner Tag
            zeitraum = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
          } else if(weekmarket == true){
        

          }else {
            // Zeitraum – Start und Ende jeweils mit eigenem Monat & Jahr
            zeitraum =
              `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()} - ` +
              `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;
          }
        }

    
  

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
			
		}
		else if (height > 157 && height <= 252){
			newTop = 8;
			

		}else if (height > 252 && height <= 253){
			newTop = 15;
	
		}
		 // Apply style with !important to override CSS
		 calendar.style.setProperty("position", "relative", "important");
		 calendar.style.setProperty("top", newTop + "%", "important");
	}

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

/*const dateOfRecurringEvents = async (eventName, username,oldName = null, oldEventData = null) => {
	  const serverData = await getData();
    

    eventData = serverData?.eventData || [];
    listofRegion = serverData?.listofRegion || {};
    recurringMarketDates.length = 0;
    let event = null;

    const newStart = new Date(selectedStart.year, selectedStart.month, selectedStart.day);
    let current = new Date(newStart);

    const tagString = {
            day: current.getDate(),
            month: current.getMonth(),
            year: current.getFullYear(),
            start: { ...selectedStart },
            end: selectedEnd ? { ...selectedEnd } : null
        };

    const firstDay = selectedStart.day; 
    const monthName = months[current.getMonth()];

    let monatObj = eventDataGlobal.find(m => m.month == monthName);
        if (!monatObj) {
    monatObj = { month: monthName, events: [] };
    eventData.push(monatObj);
}
if (!monatObj[eventName]) {
    monatObj[eventName] = {
        dates: [],
        owner: username,
        isWeekly: true
    };
}

     if (oldName && oldEventData && !oldEventData.isWeekly) {
        for (const monat of eventData) {
            if (monat[oldName]) {
                delete monat[oldName];
                if (Array.isArray(monat.events)) {
                    monat.events = monat.events.filter(ev => ev !== oldName);
                }
            }
        }
    }


    

    event = monatObj[eventName];
    event.owner = event.owner || username;
    event.isWeekly = weekmarket === true;

      if (tagString && typeof tagString === "object") {
            if (!event.dates.some(d =>
                d.day === tagString.day &&
                d.month === tagString.month &&
                d.year === tagString.year
            )) {
                event.dates.push(tagString);
            }
        }
    if (! firstDay) {
        console.error("❌ Kein Starttag in DaysSet gefunden!");
        return;
    }
    const month = currMonth;

  
    // Startdatum erzeugen (UTC damit es sauber bleibt)
    let currentUTCDate = new Date(Date.UTC(currYear, month,  firstDay));

    // Sicherstellen, dass es ein gültiges Datum ist
    if (isNaN(currentUTCDate)) {
    
        console.error("❌ Ungültiges Startdatum:", startDateStr);
       
        return;
    }
    if (event && event.isWeekly) {
    // ggf. alte Einzeltermine leeren, falls nur Wochenlogik zählt
    eventData[monthName ].dates = [];
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

        recurringMarketDates.push({
          day: forward.getUTCDate(),
        month: forward.getUTCMonth(),
        year: forward.getUTCFullYear()
    });
         
        forward.setUTCDate(forward.getUTCDate() + 7);
    }

    // --- Rückwärts durch Jahr gehen ---
    let backward = new Date(currentUTCDate);
    backward.setUTCDate(backward.getUTCDate() - 7);
    while (backward.getUTCFullYear() === currYear) {


         recurringMarketDates.push({
          day: backward.getUTCDate(),
        month: backward.getUTCMonth(),
        year: backward.getUTCFullYear()
    });
        backward.setUTCDate(backward.getUTCDate() - 7);
    }

    // Sortieren
    recurringMarketDates.sort((a, b) =>
  a.year - b.year ||
  a.month - b.month ||
  a.day - b.day
);


    // --- Pro Monat einsortieren ---
  

recurringMarketDates.forEach(dateObj => {
    const monthName = months[dateObj.month];
    let monthEntry = eventData.find(e => e.month === monthName);
    if (!monthEntry) {
        monthEntry = { month: monthName, events: [] };
        eventData.push(monthEntry);
    }

    if (!monthEntry.events.includes(eventName)) {
        monthEntry.events.push(eventName);
    }

    if (!monthEntry[eventName]) {
        monthEntry[eventName] = { dates: [], owner: username, isWeekly: true };
    }

    // Prüfen, ob dieses exakte Objekt schon existiert
    const exists = monthEntry[eventName].dates.some(d =>
        d.day === dateObj.day &&
        d.month === dateObj.month &&
        d.year === dateObj.year
    );
    if (!exists) {
        monthEntry[eventName].dates.push(dateObj); // <─ jetzt echtes Objekt
    }
});

eventData.sort((a, b) =>
    months.indexOf(a.month) - months.indexOf(b.month)
);




// Globale Variablen aktualisieren, damit speichernEvent sie mitschickt
eventDataGlobal = eventData;
listofRegionGlobal = listofRegion;
  
	renderCalendar();
  return { eventData, listofRegion };
};*/
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
            d.day === dateObj.day &&
            d.month === dateObj.month &&
            d.year === dateObj.year
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
