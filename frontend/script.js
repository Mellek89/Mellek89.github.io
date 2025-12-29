


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
let selectedDate = null; 


document.addEventListener("DOMContentLoaded", () => {

	
	const item = localStorage.getItem("selectedItem");
	const chooseStart = document.getElementById("chooseStart");
	const svgPyToDe = document.getElementById("svgPyToDe");
	const svgPyToAt = document.getElementById("svgPyToAt");
	const svgPyToEs = document.getElementById("svgPyToEs");

	if (item === "goal_py" && chooseStart) {
		chooseStart.style.display = "block";
		svgPyToDe.style.display = "none";

	} 
	if(item === "goal_de" && chooseStart){ 
		chooseStart.style.display = "none";
		svgPyToDe.style.display = "block";
	}
	if(item === "goal_at" && chooseStart){ 
		chooseStart.style.display = "none";
		svgPyToAt.style.display = "block";
	}
	if(item === "goal_es" && chooseStart){ 
		chooseStart.style.display = "none";
		svgPyToEs.style.display = "block";
	}
	
	
	
});




const selectDate = () =>{


	let dSelector = document.querySelectorAll('.days li');
	const calendar = document.getElementById("calendarDropdown");
	const calendarText = document.getElementById("calendarText");
	

	dSelector.forEach( day => {
		
		day.addEventListener('click', () => {		
				currentDate.innerText = `${months[currMonth]} ${currYear}`;					
				 calendarText.textContent =
    			day.id + " " + currentDate.innerText;
 				selectedDate = day.dataset.isoDate; 
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
document.addEventListener("DOMContentLoaded", () => {
  const items = document.getElementById("Items");
  items.style.display = "block";
   items.style.display = "grid";
   items.style.gridTemplateColumns = "repeat(2, 1fr)";
   items.style.gap =  "0em";
   

});

const paket = document.querySelector(".paket");
const dokument = document.querySelector(".document")
const packageFormular = document.querySelector(".paket-formular");
const documentFormular = document.querySelector(".document-formular");
 const items = document.getElementById("Items");
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
					items.style.marginLeft = "60px";
				    items.style.gap =  "0em";
					return;
				}
				paket.style.display = "block";
				dokument.style.display = "none";
				documentFormular.style.display ="none";
				packageFormular.style.display ="block";
				paketAktiv = true;
				dokumentAktiv = false;

				items.style.marginLeft = "60px";
				items.style.gap =  "0em";
				});

				dokument.addEventListener("click", () => {
					if(dokumentAktiv == true  ){
					paket.style.display = "block";
					dokument.style.display = "none";
					documentFormular.style.display ="none";
					packageFormular.style.display ="block";
					paketAktiv = true;

					items.style.marginLeft = "60px";
				 	items.style.gap =  "0em";
					return;
				}
				 dokument.style.display = "block";
    			 paket.style.display = "none";
				 documentFormular.style.display ="block";
				 packageFormular.style.display ="none";
				 paketAktiv = false;
				 dokumentAktiv = true;
				 items.style.marginLeft = "60px";
				 items.style.gap =  "0em";
			});

		}
		chooseItems();
		const selectedItem = localStorage.getItem("selectedItem") || "";

		const submitBtn = document.getElementById("submitSendung");

if (submitBtn) {
		submitBtn.addEventListener("click", () => {


	
		const data = {
		start_py: selectedItem === "start_py" ? selectedItem : "",
		goal_py: selectedItem === "goal_py" ? selectedItem : "",
		start_de: selectedItem === "start_de" ? selectedItem : "",
		goal_de: selectedItem === "goal_de" ? selectedItem : "",
		date: selectedDate || "",
		item_pa: selectedItem === "package" ? selectedItem : "",
		item_pa_weight: document.getElementById("item_pa_weight")?.value || null,
		item_pa_measurement: document.getElementById("item_pa_measurement")?.value || "",
		item_pa_description: document.getElementById("item_pa_description")?.value || "",
		item_doc: selectedItem === "document" ? selectedItem : "",
		item_doc_weight: document.getElementById("item_doc_weight")?.value || null,
		item_doc_measurement: document.getElementById("item_doc_measurement")?.value || "",
		item_doc_description: document.getElementById("item_doc_description")?.value || "",

		
		};

		if (!data.datum) {
		alert("Bitte und Datum auswählen");
		return;
		}

		fetch("http://127.0.0.1:8000/api/consignment/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		})
		.then(async res => {
		const text = await res.text();
		try {
			const json = JSON.parse(text);
			console.log(json);
		} catch {
			console.error("Response is not JSON:", text);
		}
		})
		.catch(err => console.error(err));
	});
}   
	function chooseItem(){
		const item = localStorage.getItem("selectedItem");
		const chooseStart = document.getElementById("chooseStart");
		const svgDeToPy = document.getElementById("svgDeToPy");
		const svgAtToPy = document.getElementById("svgAtToPy");
		const svgEsToPy = document.getElementById("svgEsToPy");

		
		if(item === "start_de" && chooseStart){
			chooseStart.style.display = "none";
			svgDeToPy.style.display = "block";
		} else if (item === "start_at" && chooseStart){
			chooseStart.style.display = "none";
			svgAtToPy.style.display = "block";
		} else if (item === "start_es" && chooseStart){
			chooseStart.style.display = "none";
			svgEsToPy.style.display = "block";
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
chooseItem();
}
		

if (window.location.pathname.endsWith('index.html')) {


	document.querySelector(".svgAirplane").addEventListener("click", e => {
	const g = e.target.closest("g[data-item]");
	if (!g) return;

	e.preventDefault();

	const item = g.dataset.item;
	console.log("Selected:", item);
	localStorage.setItem("selectedItem", item);
	
	window.location.href = "./item.html";

	});
}



			
	
	

	  

	
	

			

