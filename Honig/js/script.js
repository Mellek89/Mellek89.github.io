

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
	
	let liTag = "";

	for (let i = firstDateOfMonth; i > 0; i--){ // creating li of last days of prev month
			
		liTag += `<li class="inactive">${lasttDateOfLastMonth -i +1}</li>`;
	}
	
	
	for (let i = 1; i<=lastDateOfMonth; i++){ //creating li of actual days of current month
		//adding active class to list if the current day , month and year matched
		let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
		
	
		// ISO-Datum für jedes li erzeugen
			let isoDate = `${currYear}-${String(currMonth + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
// Events für diesen Tag
    let dropdownHTML = "";



			liTag += `<li id="${i}" class="${isToday}" data-iso-date="${isoDate}">
            ${i}${dropdownHTML}
          </li>`;
		
	}
	for (let i =lastDayOfMonth; i < 6; i++){
			
		liTag += `<li class="inactive">${i-lastDayOfMonth +1}</li>`;
	}
	
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	daysTag.innerHTML = liTag;
	// 2️⃣ Hier kommt der Event-Sidebar-Code hin
    const monthName = months[currMonth];
    const monthObj = eventData.find(m => m.month && m.month.trim().toLowerCase() === monthName.toLowerCase());

    const eventListDiv = document.getElementById("eventList");
    eventListDiv.innerHTML = ""; // vorher leeren

    if (monthObj && monthObj.events.length > 0) {
        monthObj.events.forEach(ev => {
            const eventDates = ev.dates.map(d => `${d.day}.${d.month+1}.${d.year}`).join(", ");
            const div = document.createElement("div");
            div.className = "event-item";
            div.innerHTML = `<strong>${ev.name}</strong>`;
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

function showDropdownMenu() {
  const dropdown = document.getElementById("monthDropdown");
  
  // Alle Monate aus JSON hinzufügen
  eventData.forEach(monthObj => {
    const option = document.createElement("option");
    option.value = monthObj.month;
    option.textContent = monthObj.month;
    dropdown.appendChild(option);
  });
}

// Dropdown beim Laden der Seite anzeigen
//showDropdownMenu();

loadEventData();

/*languagePicker
let languagePicker = document.querySelectorAll(".lang-btn span");
let flagDe = document.getElementById("flagDe");
let flagEs = document.getElementById("flagEs");
let flagEn = document.getElementById("flagEn");


languagePicker.forEach(button => {



  button.addEventListener("click", (e) => {
  
    
    if (button.id == "flagDe"){
         window.location.href = "../de/index.html";


    }else if (button.id == "flagEs"){

        
      window.location.href = "../es/index.html";

      }else if (button.id){
         window.location.href = "../en/index.html";
      }

    });
});*/

document.querySelectorAll("[data-lang]").forEach(el => {
  el.addEventListener("click", (e) => {

    e.preventDefault(); // verhindert normales Link-Verhalten

    const lang = el.dataset.lang;

    let path = window.location.pathname;
    let file = path.split("/").pop();

    if (!file || !file.includes(".")) {
      file = "index.html";
    }

    const basePath = path.split("/")[1];

    window.location.href = `/${basePath}/${lang}/${file}`;
  });
});

