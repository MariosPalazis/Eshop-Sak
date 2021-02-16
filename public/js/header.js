const headerContainer = document.querySelector(".site-wide-header");
const hamburger = document.querySelector(".hamburger");
const navigationContainer = document.querySelector(".navigation-container");
const accountContainer = document.querySelector(".account-container");
const navigationSubmenu = document.querySelector(".submenu");
const submenuLink = document.querySelector(".submenu-link");
const topmenu = document.querySelector(".topmenu");
const submenuAccountContainer = document.querySelector(".submenu-account-container");
const submenuAccount = document.querySelector(".submenu-account");
const logoContainer = document.querySelector(".logo-container");
let shop = document.querySelector(".shoppingCart-container");



hamburger.addEventListener("click", toggleMenu);
submenuLink.addEventListener("click", toggleSubmenu);
if (submenuAccountContainer) submenuAccountContainer.addEventListener("click", toggleAccountMenu);
window.addEventListener("scroll", navbarOneRow)

function navbarOneRow() {
  if (window.pageYOffset > 80 && window.innerWidth > 950) {
    if (!logoContainer.classList.contains("logo-aside")) logoContainer.classList.add("logo-aside");
    shop.classList.add("shoppingCart-logo-left");
    accountContainer.classList.add("account-logo-left");

  } else if (window.pageYOffset < 80 && window.innerWidth > 950) {
    if (logoContainer.classList.contains("logo-aside")) logoContainer.classList.remove("logo-aside");
    shop.classList.remove("shoppingCart-logo-left");
    accountContainer.classList.remove("account-logo-left");
  }
}
function toggleMenu() {
  if (navigationContainer.classList.contains("toggle-visibility")) {
    headerContainer.style.height = "auto";
    navigationContainer.classList.remove("toggle-visibility");
  }  else {
    headerContainer.style.height = "100vh";
    navigationContainer.classList.add("toggle-visibility");
  }


  if (accountContainer.classList.contains("toggle-visibility")) {
    accountContainer.classList.remove("toggle-visibility");
  }  else {
    accountContainer.classList.add("toggle-visibility");
  }
}


function toggleSubmenu() {
  if (window.innerWidth > 950) return;
  if (navigationSubmenu.classList.contains("toggle-submenu")) navigationSubmenu.classList.remove("toggle-submenu");
  else navigationSubmenu.classList.add("toggle-submenu");

}

function toggleAccountMenu() {
  if (window.innerWidth > 950) return;
  if (submenuAccount.classList.contains("toggle-submenu")) submenuAccount.classList.remove("toggle-submenu")
  else submenuAccount.classList.add("toggle-submenu");
}


if (document.querySelector(".logged-in-account")) {
  let shop = document.querySelector(".shoppingCart-container");
  shop.classList.add("shoppingCart-logged-in");
}

if (document.querySelector(".logo-aside")) {
  let shop = document.querySelector(".shoppingCart-container");
  shop.classList.add("shoppingCart-logo-left");
  accountContainer.classList.add("account-logo-left");
}


