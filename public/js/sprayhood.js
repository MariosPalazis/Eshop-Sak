let toSendArray=[-1,-1,-1,-1];

function Toggle(option,val){
    option.classList.toggle("options-show");
    paintValue(val , option.classList.contains("options-show"));
}

const ln =document.getElementById("length");
const lc =document.getElementById("leatherColor");
const cs =document.getElementById("threadColor");
const th =document.getElementById("thickness");

const lno =document.getElementById("lno");
const lco=document.getElementById("lco");
const cso =document.getElementById("tco");
const tho=document.getElementById("tho");

/*values and circles*/
const lengthvalue =document.getElementById("length-value");
const lengthcircle =document.getElementById("length-circle");

const thicknessvalue =document.getElementById("thickness-value");
const thicknesscircle =document.getElementById("thickness-circle");

const leathervalue =document.getElementById("leatherColor-value");
const leathercircle =document.getElementById("leatherColor-circle");

const spokescolorvalue =document.getElementById("threadColor-value");
const spokescolorcircle =document.getElementById("threadColor-circle");

function ckeckstock(x){
    if(x.tagName=="SPAN"){
        if(x.parentElement.querySelector(".out-of-stock").classList.contains("show-out-of-stock")){
            return true;
        }
    }
    if(x.classList.contains("value")){
        if(x.querySelector(".out-of-stock").classList.contains("show-out-of-stock")){
            return true;
        }
    }
    return false;
}

ln.addEventListener("click",function(event){
    if(ckeckstock(event.target)==true){
        return null;
    }
   
    Toggle(lno,lengthvalue);
    
    
  });
th.addEventListener("click",function(){
    Toggle(tho,thicknessvalue);
    
  });
lc.addEventListener("click",function(){
    
    Toggle(lco,leathervalue);
  });
cs.addEventListener("click",function(){
    
    Toggle(cso,spokescolorvalue);
  });
 
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


  //Change value length

const lengthOptions = document.querySelectorAll("#length .value");

for(const lengthOption of lengthOptions){
    let stock= lengthOption.getElementsByClassName("stock");
    let stockDisable=lengthOption.getElementsByClassName("stock-disable");

    if(stockDisable[0].innerHTML=="true" && stock[0].innerHTML<=0){
        lengthOption.getElementsByClassName("out-of-stock")[0].classList.remove("hide");
        lengthOption.getElementsByClassName("out-of-stock")[0].classList.add("show-out-of-stock");
    }
    else{
        lengthOption.addEventListener("click",function(){
            lengthvalue.innerHTML=this.innerHTML;
            lengthcircle.style.backgroundColor=" #99ff99";
            popValid(lengthvalidation,false);
        })
    }
}
//Change value THICKNESS
const thicknessOptions = document.querySelectorAll("#thickness .value");


for(const thicknessOption of thicknessOptions){
  thicknessOption.addEventListener("click",function(){
    thicknessvalue.innerHTML=this.innerHTML;
    thicknesscircle.style.backgroundColor=" #99ff99";
    popValid(thicknessvalidation,false);
  })
}
//Change value LEATHER COLOR

const leatherOptions = document.querySelectorAll("#leatherColor .value");


for(const leatherOption of leatherOptions){
  leatherOption.addEventListener("click",function(){
    leathervalue.innerHTML=this.innerHTML;
    leathercircle.style.backgroundColor=" #99ff99";
    popValid(leathervalidation,false);
  })
}
//Change value spokescolor
const colorOfSpokesOptions = document.querySelectorAll("#threadColor .value");

for(const colorOfSpokesOption of colorOfSpokesOptions){
  colorOfSpokesOption.addEventListener("click",function(){
    spokescolorvalue.innerHTML=this.innerHTML;
    spokescolorcircle.style.backgroundColor=" #99ff99";
    popValid(colorspokesvalidation,false);
  })
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
