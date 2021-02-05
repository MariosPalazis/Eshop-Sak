//DOM elements
const submit = document.getElementById("submit");
const form = document.getElementById("address-form");
const shippingInputs = document.querySelectorAll(".form-input");

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


form.addEventListener("submit", sendForm);


function validateSubmit(){
    corr=true;
    let i;
    for (i = 0; i < shippingInputs.length; i++){
        var z=shippingInputs[i].value;
        if(z.trim() == ""){
            corr=false;
            shippingInputs[i].style.borderColor="red";
        }
        else{
            shippingInputs[i].style.borderColor="green";
        }
    }
    return corr;
}
function sendForm(event) {
    event.preventDefault();
    if(validateSubmit()){
        alert("correctREEE");
    }
    else{
        alert("notcorr")
    }
    const formData= new FormData(form);
    let data = {
        contact: "",
        shipping: {},
    };

    if (billingContainer.classList.contains("show")) {
        for (const element of formData.keys()) {
            if (element.match(/email/)) {
                data.contact = formData.get(element);
            } else if (element.match(/shipping/)) {
                data.shipping[element] = formData.get(element);
            } else if (element.match(/billing/)) {
                data.billing[element] = formData.get(element);
            }
        }
    } else {
        for (const element of formData.keys()) {
            if (element.match(/email/)) {
                data.contact = formData.get(element);
            } else if (element.match(/shipping/)) {
                data.shipping[element] = formData.get(element);
                data.billing[element.replace(/shipping/, "billing")] = formData.get(element);
            } else if (element.match(/billing/)) {
                break;
            }
        }
      }
    fetch("/checkout/address", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(data => {
        alert(data);
    }).catch(err => {
        alert(err);
    });
}
//New Js


///old job
const oldAddresses = document.querySelectorAll(".sub-address");
const checkedLabel = document.getElementById("pop-old-label");
let i;
uncheckOldLabels();
for (i = 0; i < oldAddresses.length; i++){
  oldAddresses[i].addEventListener("click",function(){
      this.firstElementChild.checked=true;
      checkedLabel.firstElementChild.innerHTML = this.childNodes[2].innerHTML;
  });
}
function uncheckOldLabels(){
  let i;
  for (i = 0; i < oldAddresses.length; i++){
    oldAddresses[i].firstElementChild.checked=false;
  }
}
function toggleOldLabel(x){
    if(x){
      checkedLabel.classList.remove("hide");
      checkedLabel.classList.add("show");
    }
    else{
      checkedLabel.classList.remove("show");
      checkedLabel.classList.add("hide");
    }
}

//Pop-Down Divs
//Taking Popups
const popactive = document.getElementById("pop-active");
const popadd = document.getElementById("pop-new");
//Taking labels
const active = document.getElementById("label-active");
const add = document.getElementById("label-new");
active.addEventListener("click", openActive);
add.addEventListener("click", openAdd);
Toggle("active");
active.classList.add("label-checked");
add.classList.remove("label-checked");
function openActive(event){
    event.preventDefault();
    Toggle("active");
    active.classList.add("label-checked");
    add.classList.remove("label-checked");
}
function openAdd(event){
    event.preventDefault();
    Toggle("add");
    active.classList.remove("label-checked");
    add.classList.add("label-checked");
}
function Toggle(label){
    switch(label){
        case "active":
            popactive.classList.toggle("show-on");
            popadd.classList.remove("show-on");
            break;
        case "add":
            popactive.classList.remove("show-on");
            popadd.classList.toggle("show-on");
            break;
        default:
            break;
    }
}

