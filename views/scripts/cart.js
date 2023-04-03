let cartContainer = document.querySelector("#cart-items");
let cartPage = document.querySelector("#cart-page");
let cartButton = document.querySelector("#cart-img");
let totalValue = document.querySelector("#total-value");
let buyButton = document.querySelector("#buy-btn");
let buyContainer = document.querySelector("#buy-container");
let closeButton = document.querySelector("#close-btn");
let removeButton = document.querySelector("#remove");
let cartItem = document.querySelector("#cart-item");
let appDetails = document.querySelector("#app-details");

let cartItems;
let currentMail;
let orderedItems = [];
let removedItems = [];

(function () {
  console.log("getusercart");
  fetch("/getUserCartItems")
    .then((response) => response.json())
    .then((data) => {
      cartItemsNotFiltered = data;
      cartItems = cartItemsNotFiltered.filter((elem) => elem);
      fetch("/getCurrentUserMail")
        .then((response) => response.json())
        .then((data) => {
          currentMail = data.email;
          console.log(currentMail);
          console.log("the items in cart are", cartItems);
          displayCartItems();
        });
    });
})();


buyButton.addEventListener("click", function () {
  buyContainer.style.display = "block";
});

closeButton.addEventListener("click", function () {
  buyContainer.style.display = "none";
  let myOrders = {};
  myOrders.currentUserMail = currentMail;
  myOrders.orders = displayItems;
  fetch("/sendCartorders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      ...myOrders,
    }),
  });
  cartPage.innerHTML = "Your Cart seems to be empty";
});

let displayItems = {};
function displayCartItems() {
  console.log("user mail is", currentMail);
  let items = "";
  let totalPrice = 0;
  console.log(cartItems);
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i] !== null && cartItems[i].currentUserMail === currentMail) {
      let currGrocery = cartItems[i].groceryDetails;
      if (currGrocery !== null) {
        for (let val of currGrocery) {
          if (displayItems[val.name] == undefined) {
            displayItems[val.name] = {
              price: parseInt(val.price),
              quantity: parseInt(val.quantity),
            };
            console.log(displayItems[val.name]);
          } else {
            displayItems[val.name].price +=
              parseInt(val.price) * parseInt(val.quantity);
            displayItems[val.name].quantity += parseInt(val.quantity);
          }
        }
      }
    }
    console.log("displayitems", displayItems);
    let groceryIndex = 0;
    if (displayItems !== undefined) {
      for (let grocery in displayItems) {
        if (grocery !== "undefined") {
          totalPrice += displayItems[grocery].price;
          items += `<div id="cart-item" class="cart-item">
                              <div class="product-name">${grocery}</div>
                              <div class="quantity">${displayItems[grocery].quantity}</div>
                              <div class="price">${displayItems[grocery].price}</div>
                              <span title="Remove from Cart" id="remove" class="close-${groceryIndex} close-remove" onclick="removeElement(this)">&times;</span>
                            </div>`;
          groceryIndex++;
        }

        console.log(displayItems);
      }
    }
  }
  if (items === "") {
    cartPage.innerHTML = `<div class='cart-empty-container'>
                            <div class="cart-empty-text">Your Cart Seems to be Empty</div>
                            <div class="cart-empty-img"><img class='empty-background' src="../assets/general-images/emptycart.png" alt='empty-card-image'></div>
                          </div>`;
  } else {
    cartContainer.innerHTML = items;
document
  .querySelector("#cart-items")
  .addEventListener("click", function (event) {
    console.log(
      "the clicked item is",
      event.target.parentElement.parentElement
    );
  });
  }
  totalValue.innerHTML = totalPrice;
  console.log(currentMail);

}

function removeElement(event) {
  console.log(event.parentNode);
  console.log("clicked item", event.parentNode.children[0].innerHTML);
  console.log('the reduced price is', event.parentNode.children[2].innerHTML)
  totalValue.innerHTML -= event.parentNode.children[2].innerHTML;
  event.parentNode.remove();
  alert("Item is removed from Cart");
  fetch("/removeElementsFromCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      "currentMail": currentMail,
      "removeElement": event.parentNode.children[0].innerHTML,
    }),
  })
}

appDetails.addEventListener("click", function () {
  window.location.href = "/";
});
