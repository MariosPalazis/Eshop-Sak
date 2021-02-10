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