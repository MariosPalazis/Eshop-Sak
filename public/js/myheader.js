const headerContainer = document.querySelector(".site-wide-header");
const hamburger = document.querySelector(".hamburger");
const navigationContainer = document.querySelector(".navigation-container");
const accountContainer = document.querySelector(".account-container");
const navigationSubmenu = document.querySelector(".submenu");
const submenuLink = document.querySelector(".submenu-link");
const topmenu = document.querySelector(".topmenu");
const submenuAccountContainer = document.querySelector(".submenu-account-container");
const submenuAccount = document.querySelector(".submenu-account");



hamburger.addEventListener("click", toggleMenu);
submenuLink.addEventListener("click", toggleSubmenu);
submenuAccountContainer.addEventListener("click", toggleAccountMenu);

function toggleMenu() {
  if (navigationContainer.classList.contains("toggle-visibility")) navigationContainer.classList.remove("toggle-visibility");
  else navigationContainer.classList.add("toggle-visibility");

  if (accountContainer.classList.contains("toggle-visibility")) accountContainer.classList.remove("toggle-visibility");
  else accountContainer.classList.add("toggle-visibility");
}


function toggleSubmenu() {
  if (navigationSubmenu.classList.contains("toggle-submenu")) navigationSubmenu.classList.remove("toggle-submenu");
  else navigationSubmenu.classList.add("toggle-submenu");

}

function toggleAccountMenu() {
  if (submenuAccount.classList.contains("toggle-submenu")) submenuAccount.classList.remove("toggle-submenu")
  else submenuAccount.classList.add("toggle-submenu");
}



