

let toSendArray=[-1,-1,-1,-1,-1,-1];

function Toggle(option,val){
  option.classList.toggle("options-show");
  paintValue(val , option.classList.contains("options-show"));
}

const wd =document.getElementById("wheelDiameter");
const th =document.getElementById("thickness");
const lc =document.getElementById("leatherColor");
const ct =document.getElementById("threadColor");
const sp =document.getElementById("spokes");
const cs =document.getElementById("colorOfSpokes");

const wdo =document.getElementById("wdo");
const tho=document.getElementById("tho");
const lco =document.getElementById("lco");
const cto=document.getElementById("cto");
const spo =document.getElementById("spo");
const cso=document.getElementById("cso");

wd.addEventListener("click",function(){
  Toggle(wdo,wheeldiamvalue);
  tho.classList.remove("options-show");
  lco.classList.remove("options-show");
  cto.classList.remove("options-show");
  spo.classList.remove("options-show");
  cso.classList.remove("options-show");
  paintValue(thicknessvalue,false);
  paintValue(leathervalue,false);
  paintValue(threadvalue,false);
  paintValue(spokesvalue,false);
  paintValue(spokescolorvalue,false);
});
th.addEventListener("click",function(){
  wdo.classList.remove("options-show");
  Toggle(tho,thicknessvalue);
  lco.classList.remove("options-show");
  cto.classList.remove("options-show");
  spo.classList.remove("options-show");
  cso.classList.remove("options-show");
  paintValue(wheeldiamvalue,false);
  paintValue(leathervalue,false);
  paintValue(threadvalue,false);
  paintValue(spokesvalue,false);
  paintValue(spokescolorvalue,false);
});
lc.addEventListener("click",function(){
  wdo.classList.remove("options-show");
  tho.classList.remove("options-show");
  Toggle(lco,leathervalue);
  cto.classList.remove("options-show");
  spo.classList.remove("options-show");
  cso.classList.remove("options-show");
  paintValue(wheeldiamvalue,false);
  paintValue(thicknessvalue,false);
  paintValue(threadvalue,false);
  paintValue(spokesvalue,false);
  paintValue(spokescolorvalue,false);
});
ct.addEventListener("click",function(){
  wdo.classList.remove("options-show");
  tho.classList.remove("options-show");
  lco.classList.remove("options-show");
  Toggle(cto,threadvalue);
  spo.classList.remove("options-show");
  cso.classList.remove("options-show");
  paintValue(wheeldiamvalue,false);
  paintValue(thicknessvalue,false);
  paintValue(leathervalue,false);
  paintValue(spokesvalue,false);
  paintValue(spokescolorvalue,false);
});
sp.addEventListener("click",function(){
  wdo.classList.remove("options-show");
  tho.classList.remove("options-show");
  lco.classList.remove("options-show");
  cto.classList.remove("options-show");
  Toggle(spo, spokesvalue);
  cso.classList.remove("options-show");
  paintValue(wheeldiamvalue,false);
  paintValue(thicknessvalue,false);
  paintValue(leathervalue,false);
  paintValue(threadvalue,false);
  paintValue(spokescolorvalue,false);
});
cs.addEventListener("click",function(){
  wdo.classList.remove("options-show");
  tho.classList.remove("options-show");
  lco.classList.remove("options-show");
  cto.classList.remove("options-show");
  spo.classList.remove("options-show");
  Toggle(cso, spokescolorvalue);
  paintValue(wheeldiamvalue,false);
  paintValue(thicknessvalue,false);
  paintValue(leathervalue,false);
  paintValue(threadvalue,false);
  paintValue(spokesvalue,false);
});
//Change value wheel diam
const wheeldiamvalue =document.getElementById("wheel-diam-value");
const wheeldiamcircle =document.getElementById("wheel-diam-circle");

const wheeldiamOptions = document.querySelectorAll("#wheelDiameter .value");

for(const wheeldiamOption of wheeldiamOptions){
  wheeldiamOption.addEventListener("click",function(){
    wheeldiamvalue.innerHTML=this.innerHTML;
    wheeldiamcircle.style.backgroundColor=" #99ff99";
    popValid(wheeldiamvalidation,false);
  })
}

//Change value THICKNESS
const thicknessvalue =document.getElementById("thickness-value");
const thicknesscircle =document.getElementById("thickness-circle");
const thicknessOptions = document.querySelectorAll("#thickness .value");


for(const thicknessOption of thicknessOptions){
  thicknessOption.addEventListener("click",function(){
    thicknessvalue.innerHTML=this.innerHTML;
    thicknesscircle.style.backgroundColor=" #99ff99";
    popValid(thicknessvalidation,false);
  })
}

//Change value LEATHER COLOR
const leathervalue =document.getElementById("leather-value");
const leathercircle =document.getElementById("leather-circle");

const leatherOptions = document.querySelectorAll("#leatherColor .value");


for(const leatherOption of leatherOptions){
  leatherOption.addEventListener("click",function(){
    leathervalue.innerHTML=this.innerHTML;
    leathercircle.style.backgroundColor=" #99ff99";
    popValid(leathervalidation,false);
  })
}

//Change value  COLOR of Thread
const threadvalue =document.getElementById("thread-value");
const threadcircle =document.getElementById("thread-circle");

const threadOptions = document.querySelectorAll("#threadColor .value");

for(const threadOption of threadOptions){
  threadOption.addEventListener("click",function(){
    threadvalue.innerHTML=this.innerHTML;
    threadcircle.style.backgroundColor="  #99ff99";
    popValid(threadvalidation,false);
  })
} 
//Change value spokes
const spokesvalue =document.getElementById("spokes-value");
const spokescircle =document.getElementById("spokes-circle");

const spokesOptions = document.querySelectorAll("#spokes .value");

for(const spokesOption of spokesOptions){
  spokesOption.addEventListener("click",function(){
    spokesvalue.innerHTML=this.innerHTML;
    spokescircle.style.backgroundColor=" #99ff99";
    popValid(spokesvalidation,false);
  })
} 
//Change value spokescolor
const spokescolorvalue =document.getElementById("spokes-color-value");
const spokescolorcircle =document.getElementById("spokes-color-circle");
const colorOfSpokesOptions = document.querySelectorAll("#colorOfSpokes .value");

for(const colorOfSpokesOption of colorOfSpokesOptions){
  colorOfSpokesOption.addEventListener("click",function(){
    spokescolorvalue.innerHTML=this.innerHTML;
    spokescolorcircle.style.backgroundColor=" #99ff99";
    popValid(colorspokesvalidation,false);
  })
} 

function paintValue(val,open){
  if(open){
    if(val.innerHTML!="Choose an option" && val.innerHTML!="None") {
      val.innerHTML=val.innerHTML.replace(" ~","");
      val.innerHTML=val.innerHTML.replace("~ ","");
      val.innerHTML="~ "+val.innerHTML+" ~";
    }
    else{
      val.innerHTML=val.innerHTML.replace(" ~","");
      val.innerHTML=val.innerHTML.replace("~ ","");
    }
  }
  else{
    val.innerHTML=val.innerHTML.replace(" ~","");
    val.innerHTML=val.innerHTML.replace("~ ","");
  }
}
//Submit-Add+Validations
const wheeldiamvalidation =document.getElementById("wheel-diam-validation");
const thicknessvalidation=document.getElementById("thickness-validation");
const leathervalidation =document.getElementById("leather-validation");
const threadvalidation=document.getElementById("thread-validation");
const spokesvalidation=document.getElementById("spokes-validation");
const colorspokesvalidation=document.getElementById("colorspokes-validation");
//toggle popups validations function
function popValid(validpop,bl){
  if(bl){
      validpop.style.visibility="visible";
      validpop.style.display="block";
      validpop.style.opacity=1;
  }
  else{
      validpop.style.visibility="hidden";
      validpop.style.display="none";
      validpop.style.opacity=0;
  }
}
function validateResults(){
  let x=true;
  if(wheeldiamvalue.innerHTML=="Choose an option"){
      x=false;
      wheeldiamcircle.style.backgroundColor="red";
      popValid(wheeldiamvalidation,true);
  }
  else{
      wheeldiamcircle.style.backgroundColor="#99ff99";
      popValid(wheeldiamvalidation,false);
      toSendArray[0]= wheeldiamvalue.lastElementChild.innerHTML;
  }
  if(thicknessvalue.innerHTML=="Choose an option"){
      x=false;
      thicknesscircle.style.backgroundColor="red";
      popValid(thicknessvalidation,true);
  }
  else{
      thicknesscircle.style.backgroundColor="#99ff99";
      popValid(thicknessvalidation,false);
      toSendArray[1]= thicknessvalue.lastElementChild.innerHTML;
  }
  if(leathervalue.innerHTML=="Choose an option"){
      x=false;
      leathercircle.style.backgroundColor="red";
      popValid(leathervalidation,true);
  }
  else{
      leathercircle.style.backgroundColor="#99ff99";
      popValid(leathervalidation,false);
      toSendArray[2]= leathervalue.lastElementChild.innerHTML;
  }
  if(threadvalue.innerHTML=="Choose an option"){
      x=false;
      threadcircle.style.backgroundColor="red";
      popValid(threadvalidation,true);
  }
  else{
      threadcircle.style.backgroundColor="#99ff99";
      popValid(threadvalidation,false);
      toSendArray[3]= threadvalue.lastElementChild.innerHTML;
  }
  
  if(spokesvalue.innerHTML=="Choose an option"){
    x=false;
    spokescircle.style.backgroundColor="red";
    popValid(spokesvalidation,true);
  }
  else{
    spokescircle.style.backgroundColor="#99ff99";
      popValid(spokesvalidation,false);
      toSendArray[4]= spokesvalue.lastElementChild.innerHTML;
  }
  if(spokescolorvalue.innerHTML=="Choose an option"){
      x=false;
      spokescolorcircle.style.backgroundColor="red";
      popValid(colorspokesvalidation,true);
  }
  else{
      spokescolorcircle.style.backgroundColor="#99ff99";
      popValid(colorspokesvalidation,false);
      toSendArray[5]= spokescolorvalue.lastElementChild.innerHTML;
  }
  return x;
}
function sendData(){
  const payload={
    meta:{
      operation:"add",
      repeat:1,
      productId:"100"
    },
    rows:{
      wheelDiameter: toSendArray[0],
      thickness: toSendArray[2],
      leatherColor: toSendArray[1],
      threadColor: toSendArray[3],
      spokes: toSendArray[4],
      colorOfSpokes: toSendArray[5]
    }
  };

  // send the data to the server and then
  // receive the response and perform the
  // proper action
  fetch("/shoppingCart/add", {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(payload)
  }).then(response => {
      return response.text();
  }).then(data => {
    if (data === "success") location.reload();
  }).catch(err => {
    alert(err);
  });
}
//send data
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", submit);
function submit(event){
  event.preventDefault()
  if(validateResults()){
      sendData();
  }
}
