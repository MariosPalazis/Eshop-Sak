var stripe = Stripe("pk_test_51IG0iBIcyuDodgYRXCmyC1skZfnYRssCUNAxz1PEVQyJEzVFiTyAhLdP16FORg3dEUUkCAic5d709z1L7drVGerc00masx1HRd");

// the items the customer wants to buy

var purchase = {
  items: [{id: "x1-tshirt"}],
};

// disable the button until we hav estripe set up on the page
document.querySelector("button").disabled = true;

fetch("/create-payment-intent", {
  method: "POST",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify(purchase),
}).then( result => {
  return result.json();
}).then ( data => {
  var elements = stripe.elements();

  var style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a",
    }
  };

  var card = elements.create("card", {style: style});

  // stripe injects an iframe into the DOM
  card.mount("#card-element");

  card.on("change", function(event) {
    // disable the pay button if there are no card details in the element
    document.querySelector("button").disabled = event.empty;
    document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
  });

  var form = document.getElementById("payment-form");
  form.addEventListener("submit", (event ) => {
    event.preventDefault();
    // complete payment when the submit button is clicked
    payWithCard(stripe, card, data.clientSecret);
  });
})


// calls stripe.confirmCardPayment
// if the card requires authentication stripe show a pop-up modal to
// prompt the user to enter the authentication details without leaving your page
var payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      }
    })
    .then(function(result) {
      if(result.error) {
        // show error to your customer
        showError(result.error.message);
      } else {
        // the payment succeeded!
        orderComplete(result.paymentIntent.id);
      }
    });
};

/* -------------- UI helpers ---------- */

// shows a success message when the payment is complete
var orderComplete = function(paymentIntentId) {
  loading(false);

  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );

  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;

};


// show the customer the error from Stripe if their card fails to charge

var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(() => {
    errorMsg.textContent = "";
  }, 4000);
};

// show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) {
    // disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  };
};



