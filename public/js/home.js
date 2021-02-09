document.addEventListener('DOMContentLoaded',() =>{
    //Carousel
    var slideIndex = 1;
    showSlides(slideIndex);
    const carprev = document.getElementById("car-prev");
    const carnext = document.getElementById("car-next");
    carprev.addEventListener("click", plusSlide);
    carnext.addEventListener("click", prevSlide);
    // Next/previous controls
    function plusSlide() {
        showSlides(slideIndex += 1);
    }
    function prevSlide() {
        showSlides(slideIndex -= 1);
    }

    function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
    }

});