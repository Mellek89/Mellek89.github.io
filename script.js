console.log("script");
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('side-menu');
    const menu = document.getElementById('nav');
    const main = document.getElementById('main');
                
    checkbox.addEventListener('click', () => {
         main.classList.toggle('hidden', checkbox.checked);
    });
});
                
function initSlideshow() {
  const slides = document.querySelectorAll('.Geschichte .slide');
  let currentIndex = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function startSlideshow() {
    showSlide(currentIndex);
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, 6000); // alle 6 Sekunden wechseln
  }

  function stopSlideshow() {
    clearInterval(interval);
    slides.forEach(slide => slide.classList.add('active'));
  }

  // Initial check
  if(window.innerWidth >= 768){
    startSlideshow();
  } else {
    stopSlideshow();
  }

  // Auf Fenstergröße reagieren
  window.addEventListener('resize', () => {
    if(window.innerWidth >= 768){
      if(!interval) startSlideshow();
    } else {
      stopSlideshow();
      interval = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', initSlideshow);