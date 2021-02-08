//validate new-address form inputs
function validateInp(){
    const fld= this.value.trim()
    if(fld==""){
        this.style.borderColor="red";
    }
    else{
        this.style.borderColor="lime";
    }
}
//Take Shipping Address fields
const fullnameS = document.getElementById("name");
const emailS = document.getElementById("email");
const addressS = document.getElementById("address1");
const address2S = document.getElementById("address2");
const cityS = document.getElementById("city");
const countryS = document.getElementById("country");
const postcodeS = document.getElementById("postcode");
fullnameS.addEventListener("blur", validateInp);
emailS.addEventListener("blur", validateInp);
addressS.addEventListener("blur", validateInp);
address2S.addEventListener("blur", validateInp);
cityS.addEventListener("blur", validateInp);
countryS.addEventListener("blur", validateInp);
postcodeS.addEventListener("blur", validateInp);

//taking textarea
const comments=document.getElementById("comments");
//clear inputs

function clearInp() {
    fullnameS.value="";
    emailS.value="";
    addressS.value="";
    address2S.value="";
    cityS.value="";
    countryS.value="";
    postcodeS.value="";
    comments.value="";
}
clearInp();