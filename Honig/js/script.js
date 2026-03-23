

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
let daysInput = document.querySelector(".days ").children;

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
				"Oktober", "November", "Dezember"]

function getMonatsname(monatNummer) {
  const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });
  const date = new Date(2025, parseInt(monatNummer) - 1, 1);
  return formatter.format(date); // z. B. "März"
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
		
		//liTag += `<li id = ${i} class="${isToday}" >${i}</li>`;
		// ISO-Datum für jedes li erzeugen
			let isoDate = `${currYear}-${String(currMonth + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;

			liTag += `<li id="${i}" class="${isToday}" data-iso-date="${isoDate}">${i}</li>`;
		
	}
	for (let i =lastDayOfMonth; i < 6; i++){
			
		liTag += `<li class="inactive">${i-lastDayOfMonth +1}</li>`;
	}
	
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	daysTag.innerHTML = liTag;

}

prevNextIcon.forEach(icon => {
 
    icon.addEventListener("click", async handleClick => {


   
   
  
 
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
    
      
    
    //
    const monatName = getMonatsname(currMonth + 1);
    //const monatObj = eventDataGlobal.find(m => m.month === monatName);

 


// nur prüfen wenn KEIN neues Event erstellt wird
/*if (startDate == null && (!monatObj || !eventId || !monatObj[eventId])) {
    eventId = null;
    datesOfEvents = [];
} else if (monatObj && monatObj[eventId]) {
    datesOfEvents = monatObj[eventId].dates || [];
}

if (eventId == null && actualEvents.length > 0) {
    eventId = actualEvents[0];
}*/

  
    //await renderEvents();
    

   // await showDropdownMenu(listofRegionGlobal,currentRegion);

    renderCalender();   

    });
});


renderCalender();
