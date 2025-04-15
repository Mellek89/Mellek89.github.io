console.log("script.js");
const customSelect = document.getElementById('customSelect');
  const display = document.getElementById('regionDisplay');
  const radios = document.querySelectorAll('input[name="choice"]');

  // Toggle dropdown
  display.addEventListener('click', () => {
    customSelect.classList.toggle('open');
  });

  // Auswahl anzeigen und Dropdown schließen
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      display.textContent = e.target.value;
      customSelect.classList.remove('open');
      console.log("Ausgewählt:", e.target.value);
    });
  });

  /* Schließt Dropdown, wenn man außerhalb klickt
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('open');
    }
  });
  function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const main = document.getElementById('main')
    if(menu.style.maxHeight === '300px'){
      main.style.display = 'none';
    }

  }

  let hamb = document.getElementById("hamb");
  hamb.addEventListener("click", () => {
  toggleMenu();
  });*/

const checkbox = document.getElementById('side-menu');
const menu = document.getElementById('nav');
const main = document.getElementById('main')

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    // Wenn gecheckt → Menü einblenden
    main.style.display = 'none';
  } else {
    // Wenn NICHT gecheckt → Menü ausblenden
    main.style.display = 'block';
  }
});