const flash200 = document.querySelector(".flash200");
if (flash200) {
  const flash200Action = document.querySelector(".action-flash200");
  flash200Action.addEventListener("click", sendFlash200Input)
}


function sendFlash200Input(event) {
  let clientResponse = {};
  if (/Yes/.test(event.target.innerText)) {
    clientResponse = {
      operation: "flash200",
      response: "yes",
    }
  } else {
    clientResponse = {
      operation: "flash200",
      response: "no",
    }
  }

  fetch("/shoppingCart/transfer", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(clientResponse),
  }).then(response => {
    return response.text();
  }).then(data => {
    if (data === "success") location.reload();
  }).catch(err => {
    console.log(err);
  })
}
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
