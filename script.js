console.log("script");
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('side-menu');
    const menu = document.getElementById('nav');
    const main = document.getElementById('main');
                
    checkbox.addEventListener('click', () => {
         main.classList.toggle('hidden', checkbox.checked);
    });
});
                
