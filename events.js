
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

//var displayTable = $("#tableEvents").css('display');
//let slideMonths = document.querySelector(".slideshowHeadline")
let SlideCounter = 0;
let datesOfEvents = []; 
let eventId = ""; 
let dayOfEvent = null;
let daysOfEvents = [];
let recurringdWedsOfEvents = [];
let recurringThuesOfEvents = [];
let actualEvents = [];
let eSelector = [];
let keyValueOfEvents = [];
let recurringWedOfCurrentMonth= [];
let recurringThuOfCurrentMonth= [];
let prevNextSlideshow = document.querySelectorAll(".slideshowIcons span");
let dropdownHeader = document.getElementById("dropdownMenu");
let eventData = [];
let ehrenEl ;
let seltersEl ;


var endOfEvent= null;

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
				"Oktober", "November", "Dezember"]

		async function getData() {
					const url = "./Events.json";
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
				  getData();
			



const renderCalender = () => {
	let firstDateOfMonth = new Date(currYear, currMonth, 1).getDay(), //get first Day of Month
	lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), //get last Date of Month
	lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth ).getDay(),//get last days of previous Month
	lasttDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();//get last days of previous Month
	
	
	let liTag = "";

	  // Vorbereitend: Wiederkehrende Events in Set packen
  		const recurringDaysSet = new Set();

	for (let i = firstDateOfMonth; i > 0; i--){ // creating li of last days of prev month
		
				
			let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "inactive" : "";				
			let inactiveLastDays = lasttDateOfLastMonth -i +1;
	
			if (eventId!=""){
			//same event in multiple months

				if((inactiveLastDays < daysOfEvents[0] || inactiveLastDays >= lastDateOfMonth )
					&& (currMonth < daysOfEvents[3]-1 && currMonth > daysOfEvents[1]-1 )){
					liTag += `<li id = ${inactiveLastDays} class=" circleInactive"> ${inactiveLastDays} </li>`;
				}else if(currMonth < daysOfEvents[3] && currMonth > daysOfEvents[1]-1  && inactiveLastDays > daysOfEvents[3]
					&& inactiveLastDays>= daysOfEvents[0]
				){
					liTag += `<li id = ${inactiveLastDays} class=" circleInactive"> ${inactiveLastDays} </li>`;
				}
				else{
					liTag += `<li class="inactive">${lasttDateOfLastMonth -i +1}</li>`;
				}
									
				}else

				liTag += `<li class="inactive">${lasttDateOfLastMonth -i +1}</li>`;
	}	
		
	
		
	for (let i = 1; i<=lastDateOfMonth; i++){
					
			if (eventId!=""){
			
				
					let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";	
					
				//recurring events

					//if(recurringWedOfCurrentMonth.length != 0 || recurringThuOfCurrentMonth !=0){
					if (ehrenEl) {
						if (ehrenEl.classList.contains("active")) {
							for (let z = 0; z < recurringWedOfCurrentMonth.length; z += 2) {
								if (recurringWedOfCurrentMonth[z + 1] === currMonth + 1) {
									recurringDaysSet.add(recurringWedOfCurrentMonth[z]);
								} 
							}		
								//else if (recurringThuOfCurrentMonth[z + 1] === currMonth + 1) {
						}else if (seltersEl.classList.contains("active")) {
								for (let z = 0; z < recurringThuOfCurrentMonth.length; z += 2) {
									if (recurringThuOfCurrentMonth[z + 1] === currMonth + 1) {
									recurringDaysSet.add(recurringThuOfCurrentMonth[z]);
									}
							}	
						}
					}
					
			
	

				 	let className = isToday;
					// Priorität 1: Wiederkehrende Events
					if (recurringDaysSet.has(i)) {
					className = "circle";
					liTag += `<li id="${i}" class="${className}">${i}</li>`;
					i++;
					}	


						//same event in multiple months 
						if(daysOfEvents[1]<daysOfEvents[3]){
							
							if((i>=daysOfEvents[0] && currMonth == daysOfEvents[1]-1) || ( i<=daysOfEvents[2] && currMonth == daysOfEvents[3]-1)
								|| (currMonth < daysOfEvents[3]-1 && currMonth > daysOfEvents[1]-1 )){

								liTag += `<li id = ${i} class="circle"> ${i} </li>`;
											
							}else if(i>=daysOfEvents[2] && currMonth == daysOfEvents[3]-1 ) {
								liTag += `<li id = ${i} class="${isToday}"> ${i} </li>`;
							}else{
								liTag += `<li id = ${i} class="${isToday}"> ${i} </li>`;
						}
						

						}  
						
						// one event in one Month
						else if((i<=daysOfEvents[2] && i>=daysOfEvents[0]) && currMonth == daysOfEvents[1]-1){
								liTag += `<li id = ${i} class="circle"> ${i} </li>`;
								
						}else if(i== daysOfEvents[0] && daysOfEvents.length == 2 ){
								liTag += `<li id = ${i} class="circle"> ${i} </li>`;
								
						}
						else{
								liTag += `<li id = ${i} class="${isToday}"> ${i} </li>`;
								
						}

			


			}else{
			let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
									
			liTag += `<li id = ${i} class="${isToday}"> ${i} </li>`;
			
			}
			

	}
	

					
	for (let i =lastDayOfMonth; i < 6; i++){

		let inactiveFirstDays = i-lastDayOfMonth +1;	

		if (eventId!=""){
			if ((inactiveFirstDays <= lastDateOfMonth )
				&& (currMonth < daysOfEvents[3]-1 && currMonth >= daysOfEvents[1]-1 )){
				
				liTag += `<li id = ${inactiveFirstDays} class="circleInactive"> ${inactiveFirstDays} </li>`;
			}else{
				liTag += `<li class="inactive">${inactiveFirstDays}</li>`;
			}
		
		}else{
			liTag += `<li class="inactive">${inactiveFirstDays}</li>`;
		}
	}
	
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	
	daysTag.innerHTML = liTag;
	recurringWedOfCurrentMonth.length = 0;

	
}

async function showEvents  (){
	
	eSelector  = document.querySelectorAll(".dropdown-item");
	let spanEl = document.querySelector("#dropdown-menu span");
	let marketId = spanEl.id;
	eSelector.forEach( e => {
		
		e.addEventListener('click', () => {		
		
		daysOfEvents.length = 0;
		datesOfEvents.length = 0;
		
		
		
		var jSObject = getData().then((a) =>{	
			
			//show events in calender
				for (let i = 0; i<a.length;i++){
					
						if(typeof a[i].events !== 'undefined'){
							 
							for (let y=0;y<a[i].events.length;y++){
								
								if(e.id == a[i].events[y]){
									
									
										eventId =a[i].events[y];
										
										for (let key in a[i] ){
											
											if (key == [eventId]){
												datesOfEvents = a[i][key];	
											}
										}	
									
																																																																												
								}
							}
					}
				}
				for(let z=0 ;z<datesOfEvents.length; z++){
											
					let days = datesOfEvents[z].split(".");
					let day = days[0];
					day = +day; //convert String into Number
					let month = days[1];
					month = +month;
					daysOfEvents.push(day,month);
					
					
				}
				
				renderCalender(); 	
				let marketId = eventId;
				setActiveMarket(marketId)							
			});	
			
			if(e.innerHTML == "Ehrenbreitsteiner<br>Wochenmarkt" || e.innerHTML == "Selters<br>Wochenmarkt"){
				eventId = e.innerHTML;
				
				dateOfRecurringEvents();
				
				}
					
				
		});
	});
	
}

const renderEvents = async () => {	

	let data = await getData();	

	// Warte auf die getData() Funktion! getData() ist eine asynchrone Funktion!!!
	//var object = await getData().then((c)=> { // Warten auf die Rückgabe von getData()!
		
	for (let y=0; y<data.length;y++){
		if (months[currMonth] == data[y].month){
		 	actualEvents = data[y].events;		
		}
		
	} 
	actualEvents.push( "Ehrenbreitsteiner<br>Wochenmarkt");
	actualEvents.push( "Selters<br>Wochenmarkt");	 
	
}
function navigateToRegionDisplay(){
window.location.href = "index.html#regionDisplay";

}
function getRegions(){
	const params = new URLSearchParams(window.location.search);
	   const region = params.get('region');
	   if (region) {
		fetch('Events.json')
		.then(response => response.json())
		.then(data => {
			 eventData = data[10][region];
			
			selectRegions(region);
			// ✅ Sicherstellen, dass Events erst dann geladen und angezeigt werden
			renderEvents().then( ()=> {
				showDropdownMenu(); 

			});			
		});
	} else{
		console.warn("Keine Region angegeben.");
		navigateToRegionDisplay();
	}
		
	
  }
getRegions();

function setActiveMarket(market) {
  // Aktive Klasse setzen
  if (market === "Ehrenbreitsteiner-Wochenmarkt") {
    ehrenEl.classList.add("active");
    seltersEl.classList.remove("active");
  } else if(market === "Selters-Wochenmarkt") {
    seltersEl.classList.add("active");
    ehrenEl.classList.remove("active");
  }else{
	ehrenEl.classList.remove("active");
	seltersEl.classList.remove("active");
  }
 

}
function selectRegions(regions) {
	
	let dropdownText = "";
	let region = document.getElementById("dropdownText");
	dropdownText = `Wir sind in den nächsten Monaten viel unterwegs am <strong class="strong">${regions}</strong> .
	 Schauen Sie gerne bei einer der Veranstaltungen  an unserem Langosstand vorbei.`
	 region.innerHTML = dropdownText;
}

async function showDropdownMenu(){


	
	let dropdownList = document.querySelector(".dropdown-menu");
	
		let singleEvent = "";
		for (let i = 0; i<actualEvents.length; i++){

			if(eventData.includes(actualEvents[i]) ){
				if(actualEvents[i] == "Ehrenbreitsteiner<br>Wochenmarkt"){
						singleEvent+=`<span class="dropdown-item" id="Ehrenbreitsteiner-Wochenmarkt">${actualEvents[i]}</span> <br class="line-break">`
				
					}else if(actualEvents[i] == "Selters<br>Wochenmarkt"){

						singleEvent+=`<span class="dropdown-item" id="Selters-Wochenmarkt">${actualEvents[i]}</span> <br class="line-break">`
					}else{
						singleEvent+=`<span class="dropdown-item" id="${actualEvents[i]}">  ${actualEvents[i]}</span> <br class="line-break">`}
				
			
		}else{
			console.warn("Kein <span> in #dropdown-menu gefunden.");
		}
	}


	dropdownList.innerHTML = singleEvent;

 // Jetzt die Event-Listener für die dynamisch erstellten Elemente hinzufügen
	ehrenEl = document.getElementById("Ehrenbreitsteiner-Wochenmarkt");
    seltersEl = document.getElementById("Selters-Wochenmarkt");
		if (ehrenEl && seltersEl) {
			ehrenEl.addEventListener("click", () => {
				setActiveMarket("Ehrenbreitsteiner-Wochenmarkt");
			});

			seltersEl.addEventListener("click", () => {
				setActiveMarket("Selters-Wochenmarkt");
			});
			}
		else {
			
			console.warn("Kein Dropdown-Menü gefunden.");
		}

	// Wait one frame to allow layout update
	await new Promise(requestAnimationFrame);

	const height = dropdownList.getBoundingClientRect().height;
	console.log('Height:', height);
	

	const calendar = document.querySelector(".calendar");
	let positionOfCalendar = calendar.getBoundingClientRect();
	const percentTop = (positionOfCalendar.top / window.innerHeight) * 100;
	const isMobile = window.matchMedia("(max-width: 768px)").matches;



	if (isMobile) {
		let newTop;
  	console.log("top= "+ percentTop);


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
	showEvents();

}

 



prevNextIcon.forEach(icon => {
	
    icon.addEventListener("click", handleClick => {

 	

		//recurringdaysOfCurrentMonth.length = 0;
		if (daysOfEvents.length == 2){
			daysOfEvents.length = 0;
		}
	
        currMonth = icon.id === "prev" ? currMonth -1 : currMonth +1;
        
        if (currMonth < 0 || currMonth > 11){
        date = new Date(currYear,currMonth),
        
        currYear = date.getFullYear(), //updating current year with new date year 
        currMonth = date.getMonth(); //updating current month with new date month

		

        }
        else{ //pass new date as date value
        	let date = new Date();
			
        }    
	
		
		renderEvents().then( ()=> {
			showDropdownMenu(); 

		});	
		showDropdownMenu().then( ()=> {
			showEvents();
		});	
		
		renderCalender();
			
    });
	
});

document.addEventListener("DOMContentLoaded", function () {

let dropdownMenu = document.querySelector(".dropdown-menu");
let calenderView = document.getElementById("calendar")
	if (dropdownMenu.length > 0){
		dropdownMenu.addEventListener("click", () => {
			
			showDropdownMenu();			
		
		});
	} else {
		// Kein <span> vorhanden
		console.warn("Kein <span> in #dropdown-menu gefunden.");
	  }
});

renderEvents();



const checkbox = document.getElementById('side-menu');
const menu = document.getElementById('nav');
const main = document.getElementById('main');


checkbox.addEventListener('click', () => {
  main.classList.toggle('hidden', checkbox.checked);
});


const dateOfRecurringEvents = () =>{
	
	recurringdWedsOfEvents.length = 0;
	recurringThuesOfEvents.length = 0;
	recurringWedOfCurrentMonth.length = 0;
	const wednesdays = [];
	const thuesdays = [];
	
	const startDate = new Date(Date.UTC(2025, 0, 1));

	const dtfBerlin = new Intl.DateTimeFormat('de-DE', {
	weekday: 'long',
	timeZone: 'Europe/Berlin'
	});

	const tempDi = new Date(startDate); // Kopie

	while (dtfBerlin.format(tempDi) !== 'Dienstag') {
	tempDi.setDate(tempDi.getDate() + 1);
	}

	// Schleife: Finde ersten Mittwoch nach dem Dienstag
	const tempMi = new Date(tempDi); 
	while (dtfBerlin.format(tempMi) !== 'Mittwoch') {
	tempMi.setDate(tempMi.getDate() + 1);
	}

	const firstThuesdayOfTheYear = new Date(tempDi);
	const firstWednesdayOfTheYear = new Date(tempMi);


	let currentWednesday = new Date(Date.UTC(
	firstWednesdayOfTheYear.getUTCFullYear(),
	firstWednesdayOfTheYear.getUTCMonth(),
	firstWednesdayOfTheYear.getUTCDate()
	));

	let currentThuesday = new Date(Date.UTC(
	firstThuesdayOfTheYear.getUTCFullYear(),
	firstThuesdayOfTheYear.getUTCMonth(),
	firstThuesdayOfTheYear.getUTCDate()
	));

    while (currentWednesday.getUTCFullYear() === 2025 
		|| currentThuesday.getUTCFullYear() === 2025) {

		if (currentWednesday.getUTCFullYear() === 2025 && dtfBerlin.format(currentWednesday) === 'Mittwoch') {
        wednesdays.push(new Date(currentWednesday));
        
    	}
		if(currentThuesday.getUTCFullYear() === 2025 && dtfBerlin.format(currentThuesday) === 'Dienstag'){
		thuesdays.push(new Date(currentThuesday));
        
		}
		
		currentWednesday.setUTCDate(currentWednesday.getUTCDate() + 7);
		currentThuesday.setUTCDate(currentThuesday.getUTCDate() + 7);
	}


for (let i = 0; i< wednesdays.length; i++){

	const wed = wednesdays[i];
	const we = wed.toISOString().split('T')[0];

	const partsWe = we.split("-");

	let day = partsWe[2];
		day = +day; //convert String into Number
	let month = partsWe[1];
		month = +month;
		recurringdWedsOfEvents.push(day,month);

		
	}

for (let i = 0; i< thuesdays.length; i++){

	const thu = thuesdays[i];
	const th = thu.toISOString().split('T')[0];

	const partsTh = th.split("-");

	let day = partsTh[2];
		day = +day; //convert String into Number
	let month = partsTh[1];
		month = +month;
		recurringThuesOfEvents.push(day,month);

		
	}

	for (let y = 1; y<=recurringdWedsOfEvents.length; y++){	

		if((currMonth + 1 )== recurringdWedsOfEvents[y] && (y-1) %2 == 0){
			
			recurringWedOfCurrentMonth.push(recurringdWedsOfEvents[y-1], currMonth + 1 );
				
		}
	}	
	for (let y = 1; y<=recurringThuesOfEvents.length; y++){	

		if((currMonth + 1 )== recurringThuesOfEvents[y] && (y-1) %2 == 0){
			
			recurringThuOfCurrentMonth.push(recurringThuesOfEvents[y-1], currMonth + 1 );
				
		}
	}	
	console.log("Alle Mittwoche in 2025:", wednesdays);
console.log("Alle Dienstage in 2025:", thuesdays);
console.log("Mi im aktuellen Monat:", recurringWedOfCurrentMonth);
console.log("Di im aktuellen Monat:", recurringThuOfCurrentMonth);
	
}
renderCalender();

