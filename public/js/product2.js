let toSendArray=[-1,-1,-1,-1];

function Toggle(option,val){
    option.classList.toggle("options-show");
    paintValue(val , option.classList.contains("options-show"));
}

const ln =document.getElementById("length");
const lc =document.getElementById("leatherColor");
const cs =document.getElementById("colorOfSpokes");
const th =document.getElementById("thickness");

const lno =document.getElementById("lno");
const lco=document.getElementById("lco");
const cso =document.getElementById("cto");
const tho=document.getElementById("tho");

ln.addEventListener("click",function(){
    Toggle(lno,lengthvalue);
    lco.classList.remove("options-show");
    cso.classList.remove("options-show");
    tho.classList.remove("options-show");
    paintValue(thicknessvalue,false);
    paintValue(leathervalue,false);
    paintValue(spokescolorvalue,false);
  });
th.addEventListener("click",function(){
    lno.classList.remove("options-show");
    Toggle(tho,thicknessvalue);
    lco.classList.remove("options-show");
    cso.classList.remove("options-show");
    paintValue(lengthvalue,false);
    paintValue(leathervalue,false);
    paintValue(spokescolorvalue,false);
  });
lc.addEventListener("click",function(){
    lno.classList.remove("options-show");
    tho.classList.remove("options-show");
    Toggle(lco,leathervalue);
    cs.classList.remove("options-show");
    paintValue(lengthvalue,false);
    paintValue(thicknessvalue,false);
    paintValue(spokescolorvalue,false);
  });
cs.addEventListener("click",function(){
    lno.classList.remove("options-show");
    tho.classList.remove("options-show");
    lco.classList.remove("options-show");
    Toggle(cso,spokescolorvalue);
    paintValue(lengthvalue,false);
    paintValue(thicknessvalue,false);
    paintValue(leathervalue,false);
  });

  //Change value length
const lengthvalue =document.getElementById("length-value");
const lengthcircle =document.getElementById("length-circle");

const lengthOptions = document.querySelectorAll("#length .value");

for(const lengthOption of lengthOptions){
  lengthOption.addEventListener("click",function(){
    lengthvalue.innerHTML=this.innerHTML;
    lengthcircle.style.backgroundColor=" #99ff99";
    popValid(lengthvalidation,false);
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
//Change value spokescolor
const spokescolorvalue =document.getElementById("thread-value");
const spokescolorcircle =document.getElementById("thread-circle");
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
const lengthvalidation =document.getElementById("length-validation");
const thicknessvalidation=document.getElementById("thickness-validation");
const leathervalidation =document.getElementById("leather-validation");
const colorspokesvalidation=document.getElementById("thread-validation");

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
    if(lengthvalue.innerHTML=="Choose an option"){
        x=false;
        lengthcircle.style.backgroundColor="red";
        popValid(lengthvalidation,true);
    }
    else{
        lengthcircle.style.backgroundColor="#99ff99";
        popValid(lengthvalidation,false);
        toSendArray[0]= lengthvalue.lastElementChild.innerHTML;
    }
    if(thicknessvalue.innerHTML=="Choose an option"){
        x=false;
        thicknesscircle.style.backgroundColor="red";
        popValid(thicknessvalidation,true);
    }
    else{
        thicknesscircle.style.backgroundColor="#99ff99";
        popValid(thicknessvalidation,false);
        toSendArray[3]= thicknessvalue.lastElementChild.innerHTML;
    }
    if(leathervalue.innerHTML=="Choose an option"){
        x=false;
        leathercircle.style.backgroundColor="red";
        popValid(leathervalidation,true);
    }
    else{
        leathercircle.style.backgroundColor="#99ff99";
        popValid(leathervalidation,false);
        toSendArray[1]= leathervalue.lastElementChild.innerHTML;
    }
    if(spokescolorvalue.innerHTML=="Choose an option"){
        x=false;
        spokescolorcircle.style.backgroundColor="red";
        popValid(colorspokesvalidation,true);
    }
    else{
        spokescolorcircle.style.backgroundColor="#99ff99";
        popValid(colorspokesvalidation,false);
        toSendArray[2]= spokescolorvalue.lastElementChild.innerHTML;
    }
    return x;
  }

  function sendData(){
    const payload={
      meta:{
        operation:"add",
        repeat:1,
        productId:"200"
      },
      rows:{
        length: toSendArray[0],
        leatherColor: toSendArray[1],
        threadColor: toSendArray[2],
        thickness: toSendArray[3]
      }
    };
  
    // send the data to the server and then
    // receive the response and perform the
    // proper action
    console.log(toSendArray);
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
