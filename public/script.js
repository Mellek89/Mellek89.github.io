let zaehler = 0;
const maxKlicks = 8;

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



function handleClicksOnLogo(){
  console.log("klicke auf logo!!");
zaehler++;
if(zaehler >=maxKlicks){
   window.location.href = "admin.html";
}
 
}

const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) { document.getElementById("logoDiv").addEventListener("click", handleClicksOnLogo);
        }else{ document.getElementById("logo").addEventListener("click", handleClicksOnLogo);}



                
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

if (!window.location.pathname.endsWith("events.html")){	
document.addEventListener('DOMContentLoaded', () => {
  
  const checkbox = document.getElementById('side-menu');
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');

  checkbox.addEventListener('change', () => {
    console.log("toggle");
    // Body overflow toggeln
    document.body.style.overflow = checkbox.checked ? 'hidden' : 'auto';

    // Main ausblenden
    main.classList.toggle('hidden', checkbox.checked);
    main.classList.remove('open');

    // Footer ausblenden
    footer.classList.toggle('hidden', checkbox.checked);
    footer.classList.remove('open');
  });
});
}

