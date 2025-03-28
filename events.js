
// getting new date, current year and month

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth(),
currDay = date.getDay();


const currentDate = document.querySelector(".current-date");
let daysTag = document.querySelector(".days");
let prevNextIcon = document.querySelectorAll(".icons span");
let dropdownItems = document.querySelectorAll(".dropdown-menu span");
let daysInput = document.querySelector(".days ").children;
let eventsInput = document.querySelector(".slideEventcontainer");
let numberOfSlides = document.querySelector(".numberOfSlide");
let dropdownList = document.querySelector(".dropdown-menu");
//var displayTable = $("#tableEvents").css('display');
let slideMonths = document.querySelector(".slideshowHeadline")
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

				if((inactiveLastDays < daysOfEvents[0] ||inactiveLastDays >= lastDateOfMonth ) && (currMonth < daysOfEvents[3]-1 && currMonth > daysOfEvents[1]-1 )){
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
					if(recurringdaysOfCurrentMonth.length != 0)
						for (let z= 0; z< recurringdaysOfCurrentMonth.length;z++){

							if(i == recurringdaysOfCurrentMonth[z] && z % 2 ==0 ){
								
								liTag += `<li id = ${i} class="circle"> ${i} </li>`;	
								i++;
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
					
	/*for (let i =lastDayOfMonth; i < 6; i++){

		let inactiveFirstDays = i-lastDayOfMonth +1;	

		if (eventId!=""){
			if (inactiveFirstDays < lastDateOfMonth && currMonth == daysOfEvents[1]-1 ){
				console.log(inactiveFirstDays);
				liTag += `<li id = ${inactiveFirstDays} class="circleInactive"> ${inactiveFirstDays} </li>`;
			}else{
				liTag += `<li class="inactive">${inactiveFirstDays}</li>`;
			}
		
		}else{
			liTag += `<li class="inactive">${inactiveFirstDays}</li>`;
		}
	}*/
	
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	
	daysTag.innerHTML = liTag;
	recurringdaysOfCurrentMonth.length = 0;
	
	
}

const showEvents = ()=>{
		
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
									eventId = a[i].events[y];
									dropdownHeader.innerHTML = eventId;
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
			

			if(e.innerHTML == "Ehrenbreitsteiner<br>Wochenmarkt"){
				eventId = e.innerHTML;
				dropdownHeader.innerHTML = eventId;
				dateOfRecurringEvents();
				
				}
					
				
		});
	});
	
}
					

prevNextIcon.forEach(icon => {
	
    icon.addEventListener("click", () => {
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
			slideMonths.innerHTML = `Veranstaltungen für ${months[currMonth]}`;
        }    
		renderEvents();
		showEvents();
		renderCalender();
		//if bedingung für eventId Löschen!!!
		
		
    });
});


const renderEvents = () => {	
	let singleEvent = "";
	let slideCounter = 0;
	var object = getData().then((c)=> {
		
	for (let y=0; y<c.length;y++){
		if (months[currMonth] == c[y].month){
		 	actualEvents = c[y].events;
			
			 singleEvent +=`<span class="slideEvents" id="${actualEvents[0]}">${actualEvents[0]}</span>`
			  slideMonths.innerHTML = `Veranstaltungen für ${months[currMonth] } ${currYear}`	
		}
		
	} 
	actualEvents.push( "Ehrenbreitsteiner<br>Wochenmarkt");
	actualEvents.push( "Wochenmarkt<br/>Donnerstag");	
	SlideCounter = 1 ;
	
	numberOfSlides.innerHTML = SlideCounter;


	for (let i = 0; i<actualEvents.length; i++){
	if(eventId ==`${actualEvents[i]}`){
		console.log(eventId);
		 singleEvent =`<span class="slideEvents" id="${eventId}">${eventId}</span>`
		 eventsInput.innerHTML = singleEvent;
	}else{
		eventsInput.innerHTML = singleEvent;		
		eSelector = document.querySelectorAll('.slideEvents');	
	}
}	
	showEvents();	
		
	})	  
	
}


	
let dropdown = document.getElementById("dropdown");
	dropdown.addEventListener("click", () => {
		
		showDropdownMenu();
		let dropdownMenuStyle = document.getElementById("dropdown-menu");
		if (dropdownMenuStyle.style.display === "block") {
			dropdownMenuStyle.style.display = "none";
		} else {
			dropdownMenuStyle.style.display = "block";
		}
	});
	

renderEvents();

function showDropdownMenu(){

		let singleEvent = "";
		for (let i = 0; i<actualEvents.length; i++){
			singleEvent+=`<span class="dropdown-item" id="${actualEvents[i]}">${actualEvents[i]}</span></br>`
			dropdownList.innerHTML = singleEvent;
		}
		eSelector  = document.querySelectorAll(".dropdown-menu span")
		showEvents();
	
};



let currentSlide = "";
let counter = 0;

prevNextSlideshow.forEach(slide => {
	
	slide.addEventListener("click", () => {
		
		let singleEvent = "";
		currentSlide = slide.id === "slidePrev" ? (counter-- , SlideCounter--)  : (counter++ , SlideCounter++) ;
		console.log(counter);

			if (counter == actualEvents.length  ){
				counter = 0;
			}
			if (counter < 0){
				counter = actualEvents.length -1;
			}

		singleEvent+=`<span class="slideEvents" id="${actualEvents[counter]}">${actualEvents[counter]}</span>`
		

		if(SlideCounter <= actualEvents.length  && SlideCounter>0){
			numberOfSlides.innerHTML = SlideCounter;
			eventsInput.innerHTML = singleEvent;
		}else if(SlideCounter> actualEvents.length){
			SlideCounter = 1;
			numberOfSlides.innerHTML = SlideCounter;
			eventsInput.innerHTML = singleEvent;
		
		}else{
			SlideCounter= actualEvents.length  ;
			numberOfSlides.innerHTML = SlideCounter;
			eventsInput.innerHTML = singleEvent;
		}
		

		eSelector = document.querySelectorAll('.slideEvents');	

		showEvents();
			
	});
	
	
})


const dateOfRecurringEvents = () =>{
	let liTag = "";
	recurringdaysOfEvents.length = 0;
	recurringdaysOfCurrentMonth.length = 0;
	const wednesdays = [];
	const startDate = new Date(2025, 0, 1);
	let firstWednesdayOfTheYear = startDate;

	while (firstWednesdayOfTheYear.getDay() !== 3) {
        firstWednesdayOfTheYear.setDate(firstWednesdayOfTheYear.getDate() + 1);
    }

	let currentWednesday = new Date(firstWednesdayOfTheYear);
    while (currentWednesday.getFullYear() === 2025) {
        wednesdays.push(new Date(currentWednesday));
        currentWednesday.setDate(currentWednesday.getDate() + 7);
    }
	


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
				console.log(recurringdaysOfCurrentMonth);
		}
	}	
}
renderCalender();


