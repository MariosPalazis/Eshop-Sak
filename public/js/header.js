document.addEventListener('DOMContentLoaded',() =>{
    const mobile=document.getElementById("mobile");
    const desktop=document.getElementById("desktop");
    //take width
    window.addEventListener("resize", resizer);
    resizer();
    
    
    function resizer(){
     let width=window.innerWidth;
 
     if(width>780){
       mobile.classList.add("hide");
       desktop.classList.remove("hide");

       
        // When the user scrolls the page, execute myFunction
      window.onscroll = function() {myFunction()};
  
      // Get the navbar
        let navbar = document.getElementById("desktop");
        const logo=document.getElementById("logo");

        const content=document.querySelector(".content");
      // Get the offset position of the navbar
        let sticky = navbar.offsetTop;
    
      // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function myFunction() {
        if (window.pageYOffset >= sticky) {
          logo.style.width="20%";
          navbar.classList.add("stickymenu");
          content.style.paddingTop="100px";
        } else {
          logo.style.width="100%";
          navbar.classList.remove("stickymenu");
          content.style.paddingTop="0px";
        }
      }
      
     }
     else{
      mobile.classList.remove("hide");
      desktop.classList.add("hide");
        //Mobile
      const humb=document.getElementById("hamburger");

      humb.addEventListener("click", function(){
        let x = document.getElementById("myLinks");
         if (x.style.display === "flex") {
           x.style.display = "none";
           mobile.classList.toggle("mobile-show");
         } else {
           x.style.display = "flex";
           mobile.classList.toggle("mobile-show");
         }
      }); 
     }
    }
    
 });