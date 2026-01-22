
let sendItem = null;
let selectedDate = null; 
let goal = null;
if (window.location.pathname.endsWith('item.html') || window.location.pathname.endsWith('showTravelers.html') ) {

  goal = localStorage.getItem("selectedItem");
  console.log("Goal from storage:", goal);

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



/*document.addEventListener("DOMContentLoaded", () => {

	
	const item = localStorage.getItem("selectedItem");
	const chooseStart = document.getElementById("chooseStart-card");
	const routeCard = document.getElementById("route-card");
	const svgPyToDe = document.getElementById("svgPyToDe");
	const svgPyToAt = document.getElementById("svgPyToAt");
	const svgPyToEs = document.getElementById("svgPyToEs");

	if (item === "4" && chooseStart) {
		chooseStart.style.display = "grid";
		chooseStart.style.gridRow = "2";
		svgPyToDe.style.display = "none";
		routeCard.style.display = "none";

	} 
	if(item === "1" && chooseStart){ 
		chooseStart.style.display = "none";
		routeCard.style.display = "grid";
		svgPyToDe.style.display = "block";
	}
	if(item === "2" && chooseStart){ 
		chooseStart.style.display = "none";
		routeCard.style.display = "grid";
		svgPyToAt.style.display = "block";
	}
	if(item === "3" && chooseStart){ 
		chooseStart.style.display = "none";
		routeCard.style.display = "grid";
		svgPyToEs.style.display = "block";
	}
	
	
	
});*/




const selectDate = () =>{


	let dSelector = document.querySelectorAll('.days li');
	const calendar = document.getElementById("calendarDropdown");
	const calendarText = document.getElementById("calendarText");
	const svgDeToPy = document.getElementById("svgDeToPy")
	

	dSelector.forEach( day => {
		
		day.addEventListener('click', () => {	
			
			console.log(day.dataset.isoDate);
				currentDate.innerText = `${months[currMonth]} ${currYear}`;					
				 calendarText.textContent =
    			day.id + " " + currentDate.innerText;
 				selectedDate = day.dataset.isoDate; 
				calendar.classList.add("hidden");
				svgDeToPy.style.gridRow = "2";
				
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

}
	
if (window.location.pathname.endsWith('item.html')){
	 goal = localStorage.getItem("selectedItem");
   console.log("Goal from storage:", goal);	
	toggleCalendar();	
	toggleWrapper();

function toggleCalendar(){
  const toggleBtn = document.getElementById("calendarToggle");
  const calendarDropdown = document.getElementById("calendarDropdown");
  const calendar = document.getElementById("calendar");
  const wrapperCard = document.getElementById("wrapper-card");
  
  const svgDeToPy = document.getElementById("svgDeToPy");

  let isOpen = false;

toggleBtn.addEventListener("click", (e) => {
	e.stopPropagation();

	isOpen = !isOpen;

	calendarDropdown.classList.toggle("hidden", !isOpen);
	calendar.classList.toggle("is-open", isOpen);
	//wrapperCard.classList.toggle("is-shifted", isOpen);

	svgDeToPy.style.gridRow = isOpen ? "1" : "2";
  
	});
}

function toggleWrapper(){
  const toggleBtn = document.getElementById("type-grid");
  const wrapperCard = document.getElementById("wrapper-card");
  const itemsCard = document.querySelector(".card.items-card");

  let isOpen = false;

  toggleBtn.addEventListener("change", (e) => {
	e.stopPropagation();

	isOpen = !isOpen;
  	wrapperCard.classList.toggle("is-shifted", isOpen);
    itemsCard.style.gridRow = "3";
	});
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
		 let reverseHeadSendAndOffer = document.querySelector('.reverse-head');
			if (!sendItems || !takeItems || !items) return;

			  const showItems = () => {
  reverseHeadSendAndOffer.style.display = 'flex';

    items.style.display = 'grid';
    items.style.gridTemplateColumns = 'repeat(2, 1fr)';
    items.style.gap = '3em';
    items.style.justifyItems = 'center';

    // Flex zurücksetzen
    items.style.flexDirection = '';
    items.style.alignItems = '';
  
};


			sendItems.addEventListener("change", () => {
				sendItem = true;
				showItems();
				});

			takeItems.addEventListener("change", () => {
				sendItem = false;
				showItems();
				});
			}
toggleItems();
document.addEventListener("DOMContentLoaded", () => {
  const items = document.getElementById("Items");
    
if (window.innerWidth < 1024) {
 
       items.style.display = 'grid';
    items.style.gridTemplateColumns = 'repeat(2, 1fr)';
    items.style.gap = '3em';
    items.style.justifyItems = 'center';
   

    // Grid zurücksetzen (wichtig!)
    items.style.gridTemplateColumns = '';
    items.style.justifyItems = '';

  } else {
    // 🖥 DESKTOP
    items.style.display = 'grid';
    items.style.gridTemplateColumns = 'repeat(2, 1fr)';
    items.style.gap = '35em';
    items.style.justifyItems = 'center';

    // Flex zurücksetzen
    items.style.flexDirection = '';
    items.style.alignItems = '';
  }
});

   
   


let activeItem = null;
function render() {
  const isPackage = activeItem === "PACKAGE";

  paket.classList.toggle("active", isPackage);
  dokument.classList.toggle("active", !isPackage);

  paket.style.display = isPackage ? "block" : "none";
  dokument.style.display = isPackage ? "none" : "block";

  packageFormular.style.display = isPackage ? "block" : "none";
  documentFormular.style.display = isPackage ? "none" : "block";

  items.style.marginLeft = "60px";
  items.style.gap = "3em";
  items.style.justifyItems = "center";
  
}


const paket = document.querySelector(".paket");
const dokument = document.querySelector(".document")
const items = document.getElementById("Items");
const packageFormular = document.querySelector(".paket-formular");
const documentFormular = document.querySelector(".document-formular");

paket.addEventListener("click", () => {
  if (activeItem === "PACKAGE") {
    activeItem = "LETTER"; 
  } else {
    activeItem = "PACKAGE";
  }
  render();
});

dokument.addEventListener("click", () => {
  if (activeItem === "LETTER") {
    activeItem = "PACKAGE"; 
  } else {
    activeItem = "LETTER";
  }
  render();
});
 


	

		const submitBtn = document.getElementById("submitSendung");

if (submitBtn) {
  submitBtn.addEventListener("click", () => {

    const typ = document.querySelector(".item.paket.active")
      ? "PACKAGE"
      : "LETTER";

let format = null;
let weight = null;

if (typ === "LETTER") {
  format = document.getElementById("letter_format")?.value;
  if (!format) {
    alert("Bitte DIN-Format für den Brief auswählen");
    return;
  }
}

if (typ === "PACKAGE") {
  weight = document.getElementById("weight")?.value;
  if (!weight) {
    alert("Bitte Gewicht für das Paket angeben");
    return;
  }
}

	


    const data = {
	  goal_country: goal,
      typ: typ,
      weight: typ === "PACKAGE"
        ? document.getElementById("weight")?.value || null
        : null,
      format: typ === "LETTER"
        ? document.getElementById("letter_format")?.value || null
        : null,
      titel: document.getElementById("titel")?.value || "",
      description: document.getElementById("description")?.value || "",
      date: selectedDate,
      sender_id: 1   // später: vom Login
    };

    if ((!data.date || !data.titel) && data.typ === "PACKAGE" ) {
      alert("Titel und Datum sind Pflichtfelder");
      return;
    }else if ((!data.date || !data.format) && data.typ === "LETTER" ){
			 alert(" Format und Datum sind Pflichtfelder");
      return;
	}

    fetch("http://127.0.0.1:8000/api/consignment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      alert("Sendung gespeichert!");
    })
    .catch(err => console.error(err));
  });
} 
	function chooseItem(){
		const item = localStorage.getItem("selectedItem");
		const chooseStart = document.getElementById("chooseStart-card");
		const routeCard = document.getElementById("route-card");
		const svgDeToPy = document.getElementById("svgDeToPy");
		const svgAtToPy = document.getElementById("svgAtToPy");
		const svgEsToPy = document.getElementById("svgEsToPy");

		
		if(item === "5" && chooseStart){
			chooseStart.style.display = "none";
			svgDeToPy.style.display = "block";
			routeCard.style.display = "grid"
		} else if (item === "6" && chooseStart){
			chooseStart.style.display = "none";
			svgAtToPy.style.display = "block";
			routeCard.style.display = "grid"
		} else if (item === "7" && chooseStart){
			chooseStart.style.display = "none";
			svgEsToPy.style.display = "block";
			routeCard.style.display = "grid"
		}

		document.querySelector(".svgChooseStart").addEventListener("click", e => {
			const g = e.target.closest("g[data-item]");
			if (!g) return;

			e.preventDefault();

			const item = g.dataset.item;
			console.log("Selected:", item);
			localStorage.setItem("selectedItem", item);
			chooseItem();
		});
	}
//chooseItem();
}
		

if (window.location.pathname.endsWith('index.html')) {
	

	document.querySelector(".svgAirplane").addEventListener("click", e => {
	const g = e.target.closest("g[data-country-id]");
	if (!g) return;

	e.preventDefault();

	goal = g.dataset.countryId;
	console.log("Selected:", goal);
	localStorage.setItem("selectedItem", goal);
	
	window.location.href = "./item.html";

	});
}



			
	
	

	  

	
	

			

