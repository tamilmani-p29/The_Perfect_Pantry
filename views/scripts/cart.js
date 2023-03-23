let cartContainer = document.querySelector("#cart-items");
let cartPage = document.querySelector("#cart-page");
let cartButton = document.querySelector("#cart-img");
let totalValue = document.querySelector("#total-value");
let buyButton = document.querySelector("#buy-btn");
let buyContainer = document.querySelector("#buy-container");
let closeButton = document.querySelector("#close-btn");

let cartItems;
let currentMail;
let orderedItems = [];

(function () {
  console.log("getusercart");
  fetch("/getUserCartItems")
    .then((response) => response.json())
    .then((data) => {
      cartItems = data;
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
  // fetch("/getPastOrders")
  //   .then((data) => data.json())
  //   .then((result) => {
  //     let newCartArr = [];
  //     let oldCartItems = result;
  //     console.log(result);
  //     for (let i = 0; i < cartItems.length; i++) {
  //       if (cartItems[i].currentUserMail === currentMail) {
  //         for (let j = 0; j < cartItems[i].groceryDetails.length; j++) {
  //           console.log(cartItems[i].groceryDetails[j]);
  //           newCartArr.push(cartItems[i].groceryDetails[j]);
  //         }
  //       }
  //     }
  //     let userAlreadyExists = false;
  //     for (let key in oldCartItems) {
  //       if(oldCartItems[key].currentUserMail === currentMail){
  //         userAlreadyExists = true;
  //         oldCartItems[key].orders.concat(newCartArr);
  //         // for( let i=0; i<newCartArr.length; i++){
  //         //   oldCartItems[key].orders.push(newCartArr[i]);
  //         // }
  //       }
  //     }
  //     if (!userAlreadyExists) {
  //       oldCartItems.currentMail= {currentUserMail: currentMail, orders: newCartArr};
  //     }
  //     console.log(oldCartItems);
  //     fetch("/sendPastorders", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json; charset=UTF-8",
  //       },
  //       body: JSON.stringify({
  //         ...oldCartItems,
  //       }),
  //     });
  //   });
});

function displayCartItems() {
  let items = "";
  let totalPrice = 0;
  console.log(cartItems);
  for (let i = 0; i < cartItems.length; i++) {
    for (let j = 0; j < cartItems[i].groceryDetails.length; j++) {
      if (cartItems[i].currentUserMail == currentMail) {
        totalPrice +=
          cartItems[i].groceryDetails[j].price *
          cartItems[i].groceryDetails[j].quantity;
        items += `<div class="cart-item">
                            <div class="product-name">${
                              cartItems[i].groceryDetails[j].name
                            }</div>
                            <div class="quantity">${
                              cartItems[i].groceryDetails[j].quantity
                            }</div>
                            <div class="price">${
                              cartItems[i].groceryDetails[j].price *
                              cartItems[i].groceryDetails[j].quantity
                            }</div>
                          </div>`;
      }
    }
  }
  if (items === "") {
    cartPage.innerHTML = "Your Cart seems to be empty";
  } else {
    cartContainer.innerHTML = items;
  }
  totalValue.innerHTML = totalPrice; 
  console.log(currentMail);
}
