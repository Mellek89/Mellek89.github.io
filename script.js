


if (window.location.pathname.endsWith('item.html')) {
// Calendar Logik
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();


const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
let prevNextIcon = document.querySelectorAll(".icons span");
let daysInput = document.querySelector(".days ").children;


console.log(date, currYear,currMonth);

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
				"Oktober", "November", "Dezember"]
const selectDate = () =>{


	let dSelector = document.querySelectorAll('.days li');
	const calendar = document.getElementById("calendarDropdown");
	const calendarText = document.getElementById("calendarText");
	

	dSelector.forEach( day => {
		
		day.addEventListener('click', () => {		
				currentDate.innerText = `${months[currMonth]} ${currYear}`;					
				 calendarText.textContent =
    				day.id + " " + currentDate.innerText;

				calendar.classList.add("hidden");
				
		});
		
	  });

		
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
		
		liTag += `<li id = ${i} class="${isToday}" >${i}</li>`;
		
	}
	for (let i =lastDayOfMonth; i < 6; i++){
			
		liTag += `<li class="inactive">${i-lastDayOfMonth +1}</li>`;
	}
	
	currentDate.innerText = `${months[currMonth]} ${currYear}`;
	daysTag.innerHTML = liTag;
	selectDate();
}

renderCalender();



prevNextIcon.forEach(icon => {
		icon.addEventListener("click", () => {
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
			

		});

	});

	
	
	
	toggleCalendar();
	
	
	

function toggleCalendar(){
  const toggleBtn = document.getElementById("calendarToggle");
  const calendar = document.getElementById("calendarDropdown");

  toggleBtn.addEventListener("click", (e) => {
	e.stopPropagation();
    calendar.classList.toggle("hidden");
  });

  // optional: schließen bei Klick außerhalb
	document.addEventListener("click", (e) => {
		if (!toggleBtn.contains(e.target) && !calendar.contains(e.target)) {
		calendar.classList.add("hidden");
		}
	});
	}
}

	//reverseArrows
  const reverse = document.querySelector('.reverseArrows');
  const send = document.querySelector('.takeItemsWithMe');
  const offer = document.querySelector('.searchTravelers');

  function toggleSendung() {
    if (send.checked) {
      offer.checked = true;
    } else {
      send.checked = true;
    }
  }

  reverse.addEventListener('click', toggleSendung);
  reverse.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSendung();
    }
  });
  function toggleItems(){

		const sendItems = document.getElementById("sendItemsWithMe");
		const takeItems = document.getElementById("takeItemsWithMe");
		const items = document.querySelector(".Items");
			if (!sendItems || !takeItems || !items) return;

			  const showItems = () => {
					items.style.display = "grid";
					items.style.gridTemplateColumns = "repeat(2, 1fr)";
					items.style.gap = "5em";
					
				};

			sendItems.addEventListener("change", showItems);
			takeItems.addEventListener("change", showItems);
			}
toggleItems();
const paket = document.querySelector(".paket");
const dokument = document.querySelector(".document")
const packageFormular = document.querySelector(".paket-formular");
const documentFormular = document.querySelector(".document-formular");
	function chooseItems(){
			let paketAktiv = false;
  			let dokumentAktiv = false;

				paket.addEventListener("click", () => {

				if(paketAktiv == true  ){
					dokument.style.display = "block";
					paket.style.display = "none";
					documentFormular.style.display ="block";
					packageFormular.style.display ="none";
					dokumentAktiv = true;
					paketAktiv = false;
					return;
				}
				paket.style.display = "block";
				dokument.style.display = "none";
					documentFormular.style.display ="none";
					packageFormular.style.display ="block";
				paketAktiv = true;
				dokumentAktiv = false;
				});

				dokument.addEventListener("click", () => {
					if(dokumentAktiv == true  ){
					paket.style.display = "block";
					dokument.style.display = "none";
					documentFormular.style.display ="none";
					packageFormular.style.display ="block";
					paketAktiv = true;
					return;
				}
				 dokument.style.display = "block";
    			 paket.style.display = "none";
				 documentFormular.style.display ="block";
				 packageFormular.style.display ="none";
				 paketAktiv = false;
				 dokumentAktiv = true;
			});

		}
		chooseItems();
		
		
			
	
	

	  

	
	

			

