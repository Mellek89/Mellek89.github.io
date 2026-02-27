

const menuitem = document.getElementById("tspan148");
const logo = document.getElementById("g6");
menuitem.addEventListener("click", (e) => {

    console.log( e +"wurde geklickt");
     window.location.href = "productos.html";

});

logo.addEventListener("click", (e) => {

    console.log( e +"wurde geklickt");
     window.location.href = "index.html";

});