

let datesOfEvents = []; 
let eventId = ""; 
let actualEvents = [];
let eventData = [];
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
let prevNextIcon = document.querySelectorAll(".icons span");


//let daysInput = document.querySelector(".days").children;


const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
				"Oktober", "November", "Dezember"]

function getMonatsname(monatNummer) {
  const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });
  const date = new Date(2025, parseInt(monatNummer) - 1, 1);
  return formatter.format(date); // z. B. "März"
}
async function loadEventData() {
  const lang = window.location.pathname.split("/")[2];
  try {
    const response = await fetch(`../data/cursos-${lang}.json`); // Name deiner externen Datei
    if (!response.ok) throw new Error("JSON konnte nicht geladen werden");
     const jsonData = await response.json();
	 eventData = Array.isArray(jsonData) ? jsonData : jsonData.eventData;
    console.log("EventData geladen:", eventData);
    renderCalender(); // Kalender rendern, sobald die Daten geladen sind
  } catch (error) {
    console.error("Fehler beim Laden der Events:", error);
  }
}

const renderCalender = () => {
	let firstDateOfMonth = new Date(currYear, currMonth, 1).getDay(), //get first Day of Month
	lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), //get last Date of Month
	lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth ).getDay(),//get last days of previous Month
	lasttDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();//get last days of previous Month
	const monthName = months[currMonth];
    const monthObj = eventData.find(m => m.month && m.month.trim().toLowerCase() === monthName.toLowerCase());
	let liTag = "";

	for (let i = firstDateOfMonth; i > 0; i--){ // creating li of last days of prev month
			
		liTag += `<li class="inactive">${lasttDateOfLastMonth -i +1}</li>`;
	}
	
	
	for (let i = 1; i<=lastDateOfMonth; i++){ 
		//adding active class to list if the current day , month and year matched
		let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
		 
	
		// ISO-Datum für jedes li erzeugen
			let isoDate = `${currYear}-${String(currMonth + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
// Events für diesen Tag
    let dropdownHTML = "";



			liTag += `<li id="${i}" class="${isToday} " data-iso-date="${isoDate}">
            ${i}
          </li>`;
		
	}
	for (let i =lastDayOfMonth; i < 6; i++){
			
		liTag += `<li class="inactive">${i-lastDayOfMonth +1}</li>`;
	}
	
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	daysTag.innerHTML = liTag;
  

    const eventListDiv = document.getElementById("eventList");
    eventListDiv.innerHTML = ""; // vorher leeren

    if (monthObj && monthObj.events.length > 0) {
        monthObj.events.forEach(ev => {
            const eventDates = ev.dates.map(d => `${d.day}.${d.month+1}.${d.year}`).join(", ");
            const div = document.createElement("div");
            div.className = "event-item";
            div.innerHTML = `<span><strong>${ev.name}</strong></span>`;
            console.log("EV:", ev);
            div.dataset.event = JSON.stringify(ev);
            eventListDiv.appendChild(div); 
        });
    }

}	 

prevNextIcon.forEach(icon => {
 
    icon.addEventListener("click", async handleClick => {

        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
    
    const monatName = getMonatsname(currMonth + 1);

    renderCalender();   

    });
});




function selectEvent(item) {
  const ev = JSON.parse(item.dataset.event);

  document.querySelectorAll(".selected-day").forEach(el => {
    el.classList.remove("selected-day");
    el.classList.remove("active");
  });

  document.querySelectorAll(".event-item").forEach(el => {
    el.classList.remove("active");
  });

  item.classList.add("active");

  const start = new Date(ev.dates[0].year, ev.dates[0].month, ev.dates[0].day);
  const end   = new Date(
    ev.dates[ev.dates.length - 1].year,
    ev.dates[ev.dates.length - 1].month,
    ev.dates[ev.dates.length - 1].day
  );

  let current = new Date(start);

  while (current <= end) {
    const iso = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2,'0')}-${String(current.getDate()).padStart(2,'0')}`;
    const dayEl = document.querySelector(`[data-iso-date="${iso}"]`);

    if (dayEl) {
      dayEl.classList.add("selected-day");
    }

    current.setDate(current.getDate() + 1);
  }
}

function showEvents() {
  const eventList = document.getElementById("eventList");
  if (!eventList) return;

  eventList.addEventListener("click", (e) => {
    const item = e.target.closest(".event-item");
    if (item) selectEvent(item);
  });

  // 👉 DEFAULT: erstes Event auswählen
  const firstItem = eventList.querySelector(".event-item");
  if (firstItem) {
    selectEvent(firstItem);
  }
}




function showDropdownMenu() {
  const dropdown = document.getElementById("monthDropdown");
  const eventItem = 
  
  // Alle Monate aus JSON hinzufügen
  eventData.forEach(monthObj => {
    const option = document.createElement("option");
    option.value = monthObj.month;
    option.textContent = monthObj.month;
    dropdown.appendChild(option);
  });
}



loadEventData();
showEvents();

/*languagePicker*/
const selected = document.getElementById("selectedLang");
const dropdown = document.getElementById("langDropdown");

// Dropdown öffnen/schließen
selected.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

// Auswahl
document.querySelectorAll(".option").forEach(el => {
  el.addEventListener("click", () => {

    const lang = el.dataset.lang;

    // Flagge oben ändern
    selected.textContent = el.textContent.split(" ")[0];

    // aktuelle Seite bestimmen
    let path = window.location.pathname;
    let file = path.split("/").pop();

    if (!file || !file.includes(".")) {
      file = "index.html";
    }

    const basePath = path.split("/")[1];

    // Weiterleitung
    window.location.href = `/${basePath}/${lang}/${file}`;
  });
});



