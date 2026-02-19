document.querySelectorAll(".toggle-header").forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

function toggleElements(){
    let nutricion = document.getElementById("nutricion");
    let hNutricion = document.getElementById("hNutricion");

   nutricion.addEventListener('click', () => {
    if (hNutricion.style.display === 'none') {
        hNutricion.style.display = 'block';
    } else {
        hNutricion.style.display = 'none';
    }
});
}
toggleElements();


