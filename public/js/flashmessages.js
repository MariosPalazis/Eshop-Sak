document.addEventListener("DOMContentLoaded", function(){

//get Xbutton and remove flash
const flashes=document.querySelectorAll("aside");
flashes.forEach(toDelete);

function toDelete(flash){

    flash.addEventListener("click", function(event){
        if(event.target.parentElement.className=="popup-close"){
            flash.remove();
        }
    });
}
});
