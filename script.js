console.log("script.js");

document.addEventListener('DOMContentLoaded', () => {
const checkbox = document.getElementById('side-menu');
const menu = document.getElementById('nav');
const main = document.getElementById('main');
console.log("📦 checkbox:", checkbox);
console.log("📦 main:", main);

  console.log("✅ DOM loaded");
checkbox.addEventListener('click', () => {
  main.classList.toggle('hidden', checkbox.checked);
});
});
/*checkbox.addEventListener('click', () => {
  if (checkbox.checked) {
    // Wenn gecheckt → Menü einblenden
    main.style.display = 'none';
   
  } else {
    // Wenn NICHT gecheckt → Menü ausblenden
   
    main.style.display = 'grid';
    
   
  }
});*/