
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
let listofevents =[];
let listofRegion = {};
let ehrenEl ;
let seltersEl ;
//Variablen für Eventauswahl für admin
const selectedDaysForEvent = [];
let tmp = [];


var endOfEvent= null;

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
				"Oktober", "November", "Dezember"]
console.log("events.js");
		async function getData() {
					const url = "/daten/events.json";
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
	
			if (eventId!="" || window.location.pathname.endsWith("admin.html")){
			//same event in multiple months

				if((inactiveLastDays <= daysOfEvents[0] || inactiveLastDays >= lastDateOfMonth )
					&& (currMonth < daysOfEvents[3] && currMonth >= daysOfEvents[1] )){
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
					
			if (eventId!="" || window.location.pathname.endsWith("admin.html")){
			
				
					let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";	
					
				//recurring events

					
					if (ehrenEl) {
						if (ehrenEl.classList.contains("active")) {
							for (let z = 0; z < recurringWedOfCurrentMonth.length; z += 2) {
								if (recurringWedOfCurrentMonth[z + 1] === currMonth + 1) {
									recurringDaysSet.add(recurringWedOfCurrentMonth[z]);
								} 
							}		
							
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
						
						else if((i<=daysOfEvents[2] && i>=daysOfEvents[0]) && currMonth+1 == daysOfEvents[1]){
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
	liTag = "";

	
}



function chooseEvents (month){ // für admin
	
daysOfEvents.length=0;

let listOfIDs = document.querySelectorAll('.days li' );

listOfIDs.forEach(item => {
	  
		item.addEventListener('click', () => {
			
			const id = parseInt(item.dataset.id || item.innerText);
	 		const fullID = id +'.' +(month+1);	

				if (selectedDaysForEvent.length === 2 && !selectedDaysForEvent.includes(fullID)) {
					
					selectedDaysForEvent.length = 0;
					daysOfEvents.length = 0;
					renderCalender();
					chooseEvents(currMonth); 
					//return;  break, wait for new klick
				}
				if (selectedDaysForEvent.length === 2 && selectedDaysForEvent.includes(fullID)) {
					selectedDaysForEvent.length=0;
					daysOfEvents.length = 0;
					renderCalender();
					chooseEvents(currMonth); 
				}
// normale Auswahl
  if (!selectedDaysForEvent.includes(fullID)) {
    if (selectedDaysForEvent.length < 2) {
      selectedDaysForEvent.push(fullID); 

	  // Daten zwischenspeichern für späteres Speichern
							window._eventTemp = {
									eventname: eventname,
									selectedDaysForEvent
									};	
					console.log("selectedDaysForEvent:", selectedDaysForEvent);
					document.getElementById('eventTemp').innerHTML = 
  `<strong>Zeitraum:</strong> ${selectedDaysForEvent[0]}${selectedDaysForEvent.length > 1 ? ' - ' + selectedDaysForEvent[1] : ''} (${currYear})`;

					
	
					
    }
  } else {
    selectedDaysForEvent.splice(selectedDaysForEvent.indexOf(selectedDaysForEvent[0]), 1);
  }

  console.log('Ausgewählte IDs:', selectedDaysForEvent);
			if (selectedDaysForEvent.length<2 &&  !selectedDaysForEvent.includes(fullID)) {
			console.log("Füge"+selectedDaysForEvent+"hinzu, wenn nur 1 Eintrag vorhanden!");
			selectedDaysForEvent.push(fullID);
			} 
			
				if (selectedDaysForEvent.length<=2 && selectedDaysForEvent.includes(fullID)){
					for (let i = 0; i < selectedDaysForEvent.length; i++) {
							
						console.log("Eintrag 0 in Nummer umwandeln!")
						let days = selectedDaysForEvent[i].split(".");
								let day = days[0];
								day = +day; //convert String into Number
								month = +month;
						if (!tmp.includes(day)) {
								tmp.push(day,month+1);
						}
					}
								
					}

				if(tmp.length!=0){
					if((tmp[0]>tmp[2] && tmp[1]===tmp[3])||(tmp[1]>tmp[3])){
						console.log("Werte tauschen "+selectedDaysForEvent);
						console.log(selectedDaysForEvent[0]);
						selectedDaysForEvent.push(selectedDaysForEvent[1],selectedDaysForEvent[0] );
						selectedDaysForEvent.splice(0, 2);
						 console.log("getauschte werte: "+selectedDaysForEvent);
						tmp.length =0;
						
					}
				}		
					for(let i=0 ;i<selectedDaysForEvent.length; i++){
						console.log("convert String into Number für selectedDaysForEvent"+selectedDaysForEvent)
								let days = selectedDaysForEvent[i].split(".");
								let day = days[0];
								day = +day; //convert String into Number
							
								let month = days[1];
								month = +month;
								daysOfEvents.push(day,month);
								console.log('Noch Mal:', daysOfEvents);
								
						}
							if( daysOfEvents.length<4){
						renderCalender();
						chooseEvents(currMonth);
							}else if (daysOfEvents.length===4){
								renderCalender();
								tmp.length=0;
								chooseEvents(currMonth);
					
							}
				
				
					
				});

  });
  

}
 function speichernEvent(name, month,selectedDaysForEvent,region) {

 const monatName = getMonatsname(month + 1);	
 let monatObj = eventData.find(e => e.month === monatName);

 if (!monatObj) {
  monatObj = {
    month: monatName,
    events: []
  };
  listofRegion[region]={
			regions:[]
			};
  eventData.push(monatObj);
}



     /* if (!eventData[month]) {
        eventData[month] = {
          month: getMonatsname(month+1), 
		  region: region,
          events: []
        };
		listofRegion[region]={
			regions:[]
		};

      }*/

     /* if (!eventData[month].events.includes(name)) {
        eventData[month].events.push(name);
		listofRegion[region].regions.push(name);

		 }

		// Termine-Array initialisieren (auch wenn name schon in events-Liste steht!)
			if (!eventData[month][name]) {
				eventData[month][name] = [];
			}

		 eventData[month][name].push(...events);
 		 eventData[month][name] = [...new Set(eventData[month][name])];  */
		 if (!monatObj.events.includes(name)) {
				monatObj.events.push(name);

				if (!listofRegion[region]) {
					listofRegion[region] = { regions: [] };
				}

				if (!listofRegion[region].regions.includes(name)) {
					listofRegion[region].regions.push(name);
				}
				}
				if (!monatObj[name]) {
					monatObj[name] = [];
				}
				monatObj[name].push(...selectedDaysForEvent); // z. B. "23.7"


      // Anzeige leeren
      document.getElementById('bestaetigung').innerHTML = '';
      //document.getElementById('ausgabe').innerHTML = `<strong>🎉 Event gespeichert!</strong>`;
      document.getElementById('zeitraumForm').reset();

const combinedData = {
  eventData: eventData,
  listofRegion: listofRegion
};
      // Vorschau aktualisieren
      document.getElementById('jsonPreview').textContent = JSON.stringify(combinedData, null, 2);

	  // ⬇⬇⬇⬇⬇ Speichern auf dem Server
fetch('/save-event', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(combinedData)  // nur den Teil senden, den dein Server erwartet
})
.then(response => response.json())
.then(data => {
  console.log('✅ Server-Antwort:', data.message);
})
.catch(error => {
  console.error('❌ Fehler beim Speichern:', error);
});

 window.location.href = `events.html?region=${encodeURIComponent(region)}`;
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


	function getMonatsname(monatNummer) {
  const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });
  const date = new Date(2025, parseInt(monatNummer) - 1, 1);
  return formatter.format(date); // z. B. "März"
}

if (window.location.pathname.endsWith("admin.html")){
	 // Formularauswertung
    document.getElementById('zeitraumForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const eventname = document.getElementById('eventname').value.trim();
	  let region = '';
     const mittelrhein = document.getElementById('MittelrheinAdmin');
	 const oberrhein = document.getElementById('OberrheinAdmin');

      if (!eventname ) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }
	  if (oberrhein.checked ) {
       
		 region = oberrhein.value;
        
      }
if (mittelrhein.checked ) {
        
		 region = mittelrhein.value;
        
      }
      

    			// Vorschau anzeigen
     
		document.getElementById('bestaetigung').innerHTML = `
				<p> Ist folgendes korrekt?</p>
				<ul>
				<li><strong>Region:</strong> ${region}</li>
				<li><strong>Event:</strong> ${eventname}</li>
				<li id="eventTemp">'<strong>Zeitraum:</strong> 
					${selectedDaysForEvent[0]} 
					${selectedDaysForEvent[1]+1 > 1 ? ' - ' + selectedDaysForEvent[1] : ''} 
					(${currYear})
				</li>
				</ul>
				<button id="saveBtn">✅ Speichern</button>
				`; 
				
				console.log(selectedDaysForEvent);
				const saveBtn= document.getElementById('saveBtn')
				  saveBtn.addEventListener('click', function handler() {
					speichernEvent(eventname, currMonth, selectedDaysForEvent,region);

					// Nur einmal ausführen: Eventlistener wieder entfernen
					saveBtn.removeEventListener('click', handler);
				});
			


    });
}




async function showEvents  (){
	
	eSelector  = document.querySelectorAll(".dropdown-item");

	eSelector.forEach( e => {
		
		e.addEventListener('click', () => {		
		
		daysOfEvents.length = 0;
		datesOfEvents.length = 0;

		eSelector.forEach(el => {
			if (el !== e) {
				el.style.color = 'rgb(240, 255, 255)';           // helle Farbe
				el.style.borderBottom = '1px solid rgb(255, 235, 59)'; // kein sichtbarer Rahmen
			}	
		});


		

		
		// 2. Wenn Farbe NICHT #F0FFFF, dann auf #F0FFFF setzen
				e.style.color = 'rgb(255, 235, 59)';
				e.style.borderBottom = ' 1px solid rgb(240, 255, 255)';
			
		
		
	getData().then((a) =>{	
			
			//show events in calender
				for (const key in a.eventData) {
					const item = a.eventData[key];
					if (Array.isArray(item.events)) {
					
						if(typeof a.eventData[key]!== 'undefined'){
							 
							for (let y=0;y<a.eventData[key].events.length;y++){
								
								if(e.id == a.eventData[key].events[y]){
									
									
										eventId =a.eventData[key].events[y];
										console.log("eventId:", eventId);
										for (let key1 in a.eventData[key] ){
											
											if (key1 == [eventId]){
												datesOfEvents = a.eventData[key][key1];	
											}
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
//	actualEvents = '';
}

const renderEvents = async () => {	

	let data = await getData();	
	let found = false;
	// Warte auf die getData() Funktion! getData() ist eine asynchrone Funktion!!!
	//var object = await getData().then((c)=> { // Warten auf die Rückgabe von getData()!
	
	for (let y=0; y<data.eventData.length;y++){
		if (months[currMonth] == data.eventData[y].month){
		 	actualEvents = data.eventData[y].events;
		if (!actualEvents || actualEvents.length === 0) {
			console.error('Keine Events für diesen Monat gefunden.');
			}
			found = true;
			break; // Schleife beenden, da passender Monat gefunden		
		}
		
	} 
	if (!found) {
  showError("Für diesen Monat gibt es keine Veranstaltungen.");
} else if (!actualEvents || actualEvents.length === 0) {
  showError("Keine Veranstaltungen für diesen Monat gefunden.");
}else{
	showError("");

}
	actualEvents.push( "Ehrenbreitsteiner<br>Wochenmarkt");
	actualEvents.push( "Selters<br>Wochenmarkt");	 
	showEvents();
}
function showError(msg) {
  const box = document.getElementById('error-box');
  box.textContent = msg;
  box.style.display = 'block';
}
function navigateToRegionDisplay(){
window.location.href = "index.html#regionDisplay";

}
function getRegions(){
	const params = new URLSearchParams(window.location.search);
	   const region = params.get('region');
	   console.log(region);
	   if( !window.location.pathname.endsWith("admin.html")){
	   if (region ) {
		fetch('daten/events.json')
		.then(response => response.json())
		.then(data => {
			  listofRegion = data.listofRegion[region];
			 
			  listofevents = data.eventData;
			
			 if (!listofRegion) {
            console.warn(`Region "${region}" nicht gefunden.`);
            navigateToRegionDisplay();
            return;
          }
			selectRegions(region);
			// ✅ Sicherstellen, dass Events erst dann geladen und angezeigt werden
			renderEvents().then( ()=> {
				showDropdownMenu(listofRegion); 

			});			
		});
	} else{
		console.warn("Keine Region angegeben.");
		navigateToRegionDisplay();
	}
}

		
	
  }
getRegions();

function setActiveMarket(market) {
  // Aktive Klasse setzen  
  if (market === "Ehrenbreitsteiner<br>Wochenmarkt") {
    ehrenEl.classList.add("active");
    seltersEl.classList.remove("active");
  } else if(market === "Selters<br>Wochenmarkt") {
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

function eventExistsInList(eventName, listofevents) {
  return listofevents.some(obj => 
    Array.isArray(obj.events) && obj.events.includes(eventName)
  );
}
function regionExistsInList(eventName,regionObj) {
  return Array.isArray(regionObj.regions) &&
    regionObj.regions.includes(eventName)
 
}
async function showDropdownMenu(){
	

	let dropdownList = document.querySelector(".dropdown-menu");
	
	
	
	
		let singleEvent = "";
		for (let i = 0; i < actualEvents.length; i++) {
			
  let name = actualEvents[i];

 
  

  const isInListEvents = eventExistsInList(name, listofevents);
   const isInListRegions = regionExistsInList(name, listofRegion);
  const isWochenmarkt = name === "Ehrenbreitsteiner<br>Wochenmarkt" || name === "Selters<br>Wochenmarkt";

  console.log(`🔎 Prüfe Event: ${name}`);
  console.log("➡ in listofevents:", isInListEvents);
  console.log("➡ in listofRegions:", isInListRegions);
  console.log("➡ ist Wochenmarkt:", isWochenmarkt);

  //console.log(listofRegions["Mittelrhein"].regions.includes("Andernach<br/>schmeckt"));

  if ((isInListEvents || isWochenmarkt)&& isInListRegions) {
    //let id = name.replace(/<br\s*\/?>/g, "-"); // Ersetze <br> durch -
    singleEvent += `<span class="dropdown-item" id="${name}">${name}</span><div class="line-break"></div>`;
  } else {
    console.warn("Event nicht gefunden in listofevents:", name);
  }
			
} 



	dropdownList.innerHTML = singleEvent;

 // Jetzt die Event-Listener für die dynamisch erstellten Elemente hinzufügen
	ehrenEl = document.getElementById("Ehrenbreitsteiner<br>Wochenmarkt");
    seltersEl = document.getElementById("Selters<br>Wochenmarkt");
		if (ehrenEl && seltersEl) {
			ehrenEl.addEventListener("click", () => {
				setActiveMarket("Ehrenbreitsteiner<br>Wochenmarkt");
			});

			seltersEl.addEventListener("click", () => {
				setActiveMarket("Selters<br>Wochenmarkt");
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
			renderCalender();
		if( !window.location.pathname.endsWith("admin.html")){
			renderEvents().then( ()=> {
				showDropdownMenu(listofRegion); 

			});	
		
		showDropdownMenu(listofRegion).then( ()=> {
			showEvents();
		});	
	}else{
		
		renderCalender();
		chooseEvents(currMonth);
		
		
	}
		
		
		
			
    });
	
});

if( !window.location.pathname.endsWith("admin.html")){
			document.addEventListener("DOMContentLoaded", function () {

				let dropdownMenu = document.querySelector(".dropdown-menu");


					if (dropdownMenu){
						dropdownMenu.addEventListener("click", () => {
							
							showDropdownMenu();			
						
						});
					} else {
						// Kein <span> vorhanden
						console.warn("Kein <span> in #dropdown-menu gefunden.");
					}
			});
		

			renderEvents();
}

const checkbox = document.getElementById('side-menu');
const menu = document.getElementById('nav');
const main = document.getElementById('main');

checkbox.addEventListener('click', () => {

  main.classList.toggle('hidden', checkbox.checked);
  main.classList.remove("open");

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

	while (dtfBerlin.format(tempDi) !== 'Donnerstag') {
	tempDi.setDate(tempDi.getDate() + 1);
	}

	// Schleife: Finde ersten Mittwoch nach dem Donnerstag
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
		if(currentThuesday.getUTCFullYear() === 2025 && dtfBerlin.format(currentThuesday) === 'Donnerstag'){
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
chooseEvents(currMonth);



