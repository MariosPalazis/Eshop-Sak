// GET DOM ELEMENTS
const products = document.querySelectorAll(".product");

for (const product of products) {
  product.addEventListener("click", figureOutEventActuator);
}



// figure out if user pressed the add button or the delete button
// depending on the case call the relevant function which sends the product id
// to the server to have the proper operation applied.
function figureOutEventActuator(event) {
  event.stopPropagation();
  const productId = extractProductId(event.currentTarget);
  if (event.target.classList.contains("add")) {
    addProduct(productId);
  } else if (event.target.classList.contains("remove")) {
    removeProduct(productId);
  }
}


// domElement = the event ORIGINAL TARGET
// this function is invoked through the figureOutEventActuator. it
// is passed on the event original target after which it locates
// the node child with class product-Id and extracts the inner html
function extractProductId(domElement) {

  for (const child of domElement.children) {
    if (child.classList.contains("product-id")) {
      return child.innerText;
    }
  }
  return null;
}

function addProduct(productId) {
  if (!productId) {
    alert("no productid");
    return undefined;
  }

  fetch(`/product/add/${productId}`, {
    method: "GET",
  })
    .then(response => {
      console.log("product added");
      window.location.reload();
    })
    .catch(err => {
      alert("problem adding product");
    })
}

function removeProduct(productId) {
  if (!productId) {
    alert("no productid");
    return undefined;
  }
  fetch(`/product/remove/${productId}`, {
    method: "GET",
  })
    .then(response => {
      console.log("product removed");
      window.location.reload();
    })
    .catch(err => {
      alert("problem removing product");
    })
}


