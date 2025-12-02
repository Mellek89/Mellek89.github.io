// Elemente
const langBtn = document.getElementById('langBtn');
const dropdownLang = document.getElementById('langDropdown');


const currentFlag = document.getElementById('currentFlag');
const currentName = document.getElementById('currentName');



// Setze Sprache (Lade von localStorage oder Fallback)
function getSavedLang(){
return localStorage.getItem('site_lang') || (navigator.language || navigator.userLanguage || 'de').slice(0,2);
}



function setLang(lang){
lang = ['de','es','en'].includes(lang) ? lang : 'de';
document.documentElement.lang = lang;
// Update Button
const map = {de: '🇩🇪', es: '🇪🇸', en: '🇬🇧'};
const names = {de: 'Deutsch', es: 'Español', en: 'English'};
currentFlag.textContent = map[lang];
currentName.textContent = names[lang];
// Update visible text
document.querySelectorAll('[data-i18n]').forEach(el => {
const key = el.getAttribute('data-i18n');
el.textContent = I18N[lang][key] || el.textContent;
});
// Highlight active option
document.querySelectorAll('.option').forEach(opt => opt.classList.toggle('active', opt.dataset.lang === lang));
// save
localStorage.setItem('site_lang', lang);
}




// Open/close dropdownLang
function toggleDropdownLang(){
const open = dropdownLang.classList.toggle('show');
langBtn.setAttribute('aria-expanded', open);
if(open){
// focus first item for keyboard users
const first = dropdownLang.querySelector('.option');
first && first.focus();
}
}




langBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdownLang(); });


// click on option
dropdownLang.addEventListener('click', (e) => {
const opt = e.target.closest('.option');
if(!opt) return;
setLang(opt.dataset.lang);
dropdownLang.classList.remove('show');
langBtn.setAttribute('aria-expanded', 'false');
langBtn.focus();
});



// keyboard navigation
dropdownLang.addEventListener('keydown', (e) => {
const items = Array.from(dropdownLang.querySelectorAll('.option'));
const idx = items.indexOf(document.activeElement);
if(e.key === 'ArrowDown'){
e.preventDefault(); items[(idx+1) % items.length].focus();
} else if(e.key === 'ArrowUp'){
e.preventDefault(); items[(idx-1 + items.length) % items.length].focus();
} else if(e.key === 'Escape'){
dropdownLang.classList.remove('show'); langBtn.setAttribute('aria-expanded','false'); langBtn.focus();
} else if(e.key === 'Enter' || e.key === ' '){
document.activeElement.click();
}
});



// close when clicking outside
document.addEventListener('click', (e) => { if(!dropdownLang.contains(e.target) && !langBtn.contains(e.target)){ dropdownLang.classList.remove('show'); langBtn.setAttribute('aria-expanded','false'); } });


// init
setLang(getSavedLang());

