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

  // Schließt Dropdown, wenn man außerhalb klickt
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('open');
    }
  });