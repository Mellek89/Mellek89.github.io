
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
let recurringdaysOfEvents = [];
let actualEvents = [];
let eSelector = [];
let keyValueOfEvents = [];
let recurringdaysOfCurrentMonth = [];
let prevNextSlideshow = document.querySelectorAll(".slideshowIcons span");
let dropdownHeader = document.getElementById("dropdownMenu");
let eventData = [];


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
					if(recurringdaysOfCurrentMonth.length != 0){
						for (let z= 0; z< recurringdaysOfCurrentMonth.length;z++){

							if(i == recurringdaysOfCurrentMonth[z] && z % 2 ==0 ){
								
								liTag += `<li id = ${i} class="circle"> ${i} </li>`;	
								i++;
							}
							
							}
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
								
						}else{
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
	recurringdaysOfCurrentMonth.length = 0;

	
}

async function showEvents  (){
	
	eSelector  = document.querySelectorAll(".dropdown-item");
	
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
			});	
			
			if(e.innerHTML == "Ehrenbreitsteiner<br>Wochenmarkt" || e.innerHTML == "Selters<br/>Wochenmarkt"){
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
	actualEvents.push( "Selters<br/>Wochenmarkt");	 
	
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
			singleEvent+=`<span class="dropdown-item" id="${actualEvents[i]}">${actualEvents[i]}</span> <br class="line-break">`
			
		}else{
			console.warn("Kein <span> in #dropdown-menu gefunden.");
		}
	}
	dropdownList.innerHTML = singleEvent;

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

 	

		recurringdaysOfCurrentMonth.length = 0;
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
	
	let liTag = "";
	recurringdaysOfEvents.length = 0;
	recurringdaysOfCurrentMonth.length = 0;
	const wednesdays = [];
	const startDate = new Date(2025, 0, 1);
	const berlinFormatter = new Intl.DateTimeFormat('de-DE', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'short',
			timeZone: 'Europe/Berlin'
			});

	const dtf = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  timeZone: 'Europe/Berlin'
});

console.log(dtf); 
// → "Mittwoch
// Schleife: Finde ersten Mittwoch aus deutscher Sicht
while (dtf.format(startDate) !== 'Mittwoch') {
  startDate.setDate(startDate.getDate() + 1);
}

const firstWednesdayOfTheYear = new Date(startDate);

const newDateGermany = berlinFormatter.format(firstWednesdayOfTheYear);
console.log(firstWednesdayOfTheYear);
	let currentWednesday = new Date(firstWednesdayOfTheYear);
    while (currentWednesday.getFullYear() === 2025) {
        wednesdays.push(new Date(currentWednesday));
        currentWednesday.setDate(currentWednesday.getDate() + 7);
    }
	console.log(currentWednesday);


for (let i = 0; i< wednesdays.length; i++){

	const wed = wednesdays[i];
	const we = wed.toISOString().split('T')[0];

	const partsWe = we.split("-");

	let day = partsWe[2];
		day = +day; //convert String into Number
	let month = partsWe[1];
		month = +month;
		recurringdaysOfEvents.push(day,month);

		
	}

	for (let y = 1; y<=recurringdaysOfEvents.length; y++){	

		if((currMonth + 1 )== recurringdaysOfEvents[y] && (y-1) %2 == 0){
			
			recurringdaysOfCurrentMonth.push(recurringdaysOfEvents[y-1], currMonth + 1 );
				
		}
	}	
	
}
renderCalender();


