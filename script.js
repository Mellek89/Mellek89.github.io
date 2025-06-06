console.log("script");
 let currentSlide = 0;
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('side-menu');
    
    const main = document.getElementById('main');
         
  checkbox.checked = false;
  main.classList.remove('hidden');
    checkbox.addEventListener('click', () => {
         main.classList.toggle('hidden', checkbox.checked);
    });
});

document.querySelectorAll('#nav a').forEach(link => {
  link.addEventListener('click', () => {
    checkbox.checked = false;
    main.classList.remove('hidden');
  });
});

                
 document.addEventListener("DOMContentLoaded", () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".uns_prev");
    const nextBtn = document.querySelector(".uns_next");

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    function changeSlide(direction) {
      currentSlide += direction;
      if (currentSlide >= slides.length) currentSlide = 0;
      if (currentSlide < 0) currentSlide = slides.length - 1;
      showSlide(currentSlide);
    }

    // Initial anzeigen
    showSlide(currentSlide);

    // Event-Listener
    if(prevBtn != null){
    prevBtn.addEventListener("click", () => changeSlide(-1));
    nextBtn.addEventListener("click", () => changeSlide(1));
    }
  });



