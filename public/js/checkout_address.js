// DOM elements
const form = document.getElementById("address-form");




// register event handlers
form.addEventListener("submit", sendForm);



function sendForm(event) {
  event.preventDefault();
  const formData = new FormData(form);
  let data = {};

  for (const element of formData.keys()) {
    data[element] = formData.get(element);
  }
  console.log(data);

  fetch("/checkout/address", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  }).then(response => {
    return response.text();
  }).then(response=> {
    alert(response);
  }).catch(err => {
    alert(err);
  })
}
