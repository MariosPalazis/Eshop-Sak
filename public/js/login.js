import Validation from "./modules/validation.js";
let myValidation = new Validation();
//Take login inputs
const passwordControl = document.getElementById("password");
const emailControl = document.getElementById("email");

//Take helping dialogs
const emailValidation = document.getElementById("email-help");
const passwordValidation = document.getElementById("password-help");

//Toggle Password eye
const eye = document.getElementById("eye-password");
eye.addEventListener("click", toggleEye);
function toggleEye(){
    if (passwordControl.type === "password") {
        passwordControl.type = "text";
        eye.src="../assets/smalls/close_fill_minimal.svg";
    } else {
        passwordControl.type ="password";
        eye.src="../assets/smalls/open_fill_black.svg";
    }
}

// Do validation/helping windows
function VisibilityPop(obj,val){
    if(val){
        obj.classList.add("dialog-show");
    }
    else{
        obj.classList.remove("dialog-show");
    }
}
//email
emailControl.addEventListener("focus", function(){
    emailControl.classList.remove("input-correct");
    emailControl.classList.remove("input-wrong");
    emailControl.classList.add("input-default");
    VisibilityPop(emailValidation,true);
});
emailControl.addEventListener("blur", validateEmail);
function validateEmail(){
    if (emailControl.value==""){
        VisibilityPop(emailValidation,false);
    }
    else{
        if(myValidation.isValidEmail(emailControl.value)){
            VisibilityPop(emailValidation,false);
            emailControl.classList.remove("input-default");
            emailControl.classList.remove("input-wrong");
            emailControl.classList.add("input-correct");
        }
        else{
            emailControl.classList.remove("input-default");
            emailControl.classList.remove("input-correct");
            emailControl.classList.add("input-wrong");
            VisibilityPop(emailValidation,true);
        }
    }
}
    //Password
    passwordControl.addEventListener("focus", function(){
        passwordControl.classList.remove("input-correct");
        passwordControl.classList.remove("input-wrong");
        passwordControl.classList.add("input-default");
        VisibilityPop(passwordValidation,true);
    });
    passwordControl.addEventListener("blur", validatePassword);
    function validatePassword(){
        if (passwordControl.value==""){
            VisibilityPop(passwordValidation,false);
        }
        else{
          if(myValidation.isValidPass(passwordControl.value)){
                VisibilityPop(passwordValidation,false);
                passwordControl.classList.remove("input-wrong");
                passwordControl.classList.add("input-correct");
                passwordControl.classList.remove("input-default");
            }
            else{
                passwordControl.classList.remove("input-correct");
                passwordControl.classList.remove("input-default");
                passwordControl.classList.add("input-wrong");
                VisibilityPop(passwordValidation,true);
            }
        }
    }




// PAVLOS STARTS HERE

const form = document.getElementById("login-form");
const facebookLogin = document.getElementById("facebook-submit-button");
const googleLogin = document.getElementById("google-submit-button");
const register = document.getElementById("register-anchor");





// <<<------  REGISTERING EVENT HANDLERS  ------->>> //
form.addEventListener("submit", sendForm);
facebookLogin.addEventListener("click", socialRedirect);
googleLogin.addEventListener("click", socialRedirect);
register.addEventListener("click", registerURLAddQueryString);
// <<<------  END REGISTERING EVENT HANDLERS ------>>> //


function registerURLAddQueryString(event) {
  event.preventDefault();
  let myUrl = new URL(this);
  myUrl.searchParams.append("urlOrigin", window.location.pathname);
  window.location.href = myUrl;
}

function socialRedirect(event) {
  event.preventDefault();
  let myUrl = new URL(this);
  myUrl.searchParams.append("urlOrigin", window.location.pathname);
  window.location.href = myUrl;
}

function sendForm(event) {
  event.preventDefault();
  //CODE THAT VALIDATES INPUTS AND HANDLES SUBMIT
  if(myValidation.isValidEmail(emailControl.value)&&myValidation.isValidPass(passwordControl.value)){
    const formData = new FormData(form);

    let data = {};
    for (const key of formData.keys()) {
      data[key] = formData.get(key);
    }

    let myUrl = new URL("login/local", "http://localhost:3000/");
    myUrl.searchParams.append("urlOrigin", window.location.pathname);

    fetch(myUrl, {
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
    validateEmail();
    validatePassword();
  }
}
