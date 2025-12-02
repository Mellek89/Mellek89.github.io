/**
 * The User choose the item which he want to send
 */

const countries =  ["Paraguay", "Deutschland", "Schweiz"]
const currentCuntry = document.querySelector(".container .was");



const country = document.getElementById("Deutschland");
console.log(country);
country.addEventListener("click", () => {
currentCuntry.innerText = "Was möchten sie nach Deutschland versenden?"; 

});


//.innerHTML = "Was möchten sie nach" + currentCuntry.innerText + "versenden?";