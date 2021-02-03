//import validation function
import Validation from "./modules/validation.js";
let myValidation = new Validation();

//All the controls are the type of nameControl

//Eye Toggle take password controls & eye images
const passwordControl = document.getElementById("password");
const confirmControl = document.getElementById("confirm-password");
const eyePassword = document.getElementById("eye-password");
const eyeConfirm = document.getElementById("eye-confirm");

//Password eye toggle
eyePassword.addEventListener("click", function (){
    if (passwordControl.type === "password") {
        passwordControl.type = "text";
        eyePassword.src="../assets/smalls/close_fill_minimal.svg";
    } else {
        passwordControl.type ="password";
        eyePassword.src="../assets/smalls/open_fill_black.svg";
    }
});
//Confirm password eye toggle
eyeConfirm.addEventListener("click",function(){
    if (confirmControl.type === "password") {
        confirmControl.type = "text";
        eyeConfirm.src="../assets/smalls/close_fill_minimal.svg";
    } else {
        confirmControl.type ="password";
        eyeConfirm.src="../assets/smalls/open_fill_black.svg";
    }
});

//validation
//Open-Close PopUps
//toggleFuction for Pop Help-Dialogs
function VisibilityPop(obj,val){
    if(val==true){
        obj.classList.remove("hide-dialog");
    }
    else{
        obj.classList.add("hide-dialog");
    }
}

// for Name
const nameValidation = document.getElementById("name-validation");
const nameControl=document.getElementById("name");
nameControl.addEventListener("focus", nameFocus);
function nameFocus(){
    nameControl.classList.remove("inputs-correct");
    nameControl.classList.add("inputs-default");
    nameControl.classList.remove("inputs-wrong");
    VisibilityPop(nameValidation,true);
}
nameControl.addEventListener("blur", nameBlur);
function nameBlur(){
    if (nameControl.value==""){
        VisibilityPop(nameValidation,false);
        nameControl.classList.remove("inputs-wrong");
        nameControl.classList.remove("inputs-correct");
        nameControl.classList.add("inputs-default");
    }
    else{
        nameControl.classList.remove("inputs-wrong");
        nameControl.classList.add("inputs-correct");
        nameControl.classList.remove("inputs-default");
        VisibilityPop(nameValidation,false);
     }
}

// for Email
const emailValidation = document.getElementById("email-validation");
const emailControl=document.getElementById("email");
emailControl.addEventListener("focus", emailFocus);
function emailFocus(){
    emailControl.classList.remove("inputs-wrong");
    emailControl.classList.remove("inputs-correct");
    emailControl.classList.add("inputs-default");
    VisibilityPop(emailValidation,true);
}
emailControl.addEventListener("blur", emailBlur);
function emailBlur(){
    if (emailControl.value==""){
        VisibilityPop(emailValidation,false);
        emailControl.classList.remove("inputs-wrong");
        emailControl.classList.remove("inputs-correct");
        emailControl.classList.add("inputs-default");
    }
    else{
        if(myValidation.isValidEmail(emailControl.value)){
            VisibilityPop(emailValidation,false);
            emailControl.classList.remove("inputs-wrong");
            emailControl.classList.add("inputs-correct");
            emailControl.classList.remove("inputs-default");
        }
        else{
            emailControl.classList.add("inputs-wrong");
            emailControl.classList.remove("inputs-correct");
            emailControl.classList.remove("inputs-default");
            VisibilityPop(emailValidation,true);
        }
    }
}
//for Password
const passwordValidation = document.getElementById("password-validation");
passwordControl.addEventListener("focus", passFocus);
function passFocus(){
    passwordControl.classList.remove("inputs-wrong");
    passwordControl.classList.remove("inputs-correct");
    passwordControl.classList.add("inputs-default");
    VisibilityPop(passwordValidation,true);
}
passwordControl.addEventListener("blur", passBlur);
function passBlur(){
    if (passwordControl.value==""){
        passwordControl.classList.remove("inputs-wrong");
        passwordControl.classList.remove("inputs-correct");
        passwordControl.classList.add("inputs-default");
        VisibilityPop(passwordValidation,false);
    }
    else{
        if(myValidation.isValidPass(passwordControl.value)){
            VisibilityPop(passwordValidation,false);
            passwordControl.classList.remove("inputs-wrong");
            passwordControl.classList.add("inputs-correct");
            passwordControl.classList.remove("inputs-default");
        }
        else{
            passwordControl.classList.add("inputs-wrong");
            passwordControl.classList.remove("inputs-correct");
            passwordControl.classList.remove("inputs-default");
            VisibilityPop(passwordValidation,true);
        }
    }
}

//for Confirm Password
    const confirmValidation = document.getElementById("confirm-validation");
    confirmControl.addEventListener("focus", confFocus);
    function confFocus(){
        confirmControl.classList.remove("inputs-wrong");
        confirmControl.classList.remove("inputs-correct");
        confirmControl.classList.add("inputs-default");
        VisibilityPop(confirmValidation,true);
    }
    confirmControl.addEventListener("blur", confBlur);
    function confBlur(){
        if (confirmControl.value==""){
            confirmControl.classList.remove("inputs-wrong");
            confirmControl.classList.remove("inputs-correct");
            confirmControl.classList.add("inputs-default");
            VisibilityPop(confirmValidation,false);
        }
        else{
            if(myValidation.isValidConfirmPass(confirmControl.value.normalize(),passwordControl.value.normalize())){
                VisibilityPop(confirmValidation,false);
                confirmControl.classList.remove("inputs-wrong");
                confirmControl.classList.add("inputs-correct");
                confirmControl.classList.remove("inputs-default");
            }
            else{
                confirmControl.classList.add("inputs-wrong");
                confirmControl.classList.remove("inputs-correct");
                confirmControl.classList.remove("inputs-default");
                VisibilityPop(confirmValidation,true);
            }
        }
    }

        // PAVLOS STARTS HERE

const form = document.getElementById("register-form");

// <<<------  REGISTERING EVENT HANDLERS  ------->>> //
form.addEventListener("submit", sendForm);


// <<<------  END REGISTERING EVENT HANDLERS ------>>> //


//onSubmit
function sendForm(event) {
    event.preventDefault();
    //CODE THAT VALIDATES INPUTS AND HANDLES SUBMIT
    if(myValidation.isValidEmail(emailControl.value)&&myValidation.isValidPass(passwordControl.value)){
        const formData = new FormData(form);
        let data = {};
        for (const key of formData.keys()) {
        data[key] = formData.get(key);
        }


        fetch("/login/local", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)
        }).then(response => {
        return response.text();
        }).then(data => {
        window.location.href = data;
        }).catch(err => {
        alert(err);
        })
    }
    else{
      nameBlur();
      emailBlur();
      passBlur();
      confBlur()
    }

}