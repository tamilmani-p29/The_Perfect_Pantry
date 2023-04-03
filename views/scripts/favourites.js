let currentUserMail;
let favouritesData;
let stockDetails;
let favouriteCarousel = document.querySelector("#favourite-items-carousel");
let favouritesArr = [];
let pantryArr = [
  "apple",
  "banana",
  "grapes",
  "jackfruit",
  "orange",
  "papaya",
  "peer",
  "pomegranate",
  "strawberry",
  "watermelon",
  "beetroot",
  "brinjal",
  "carrot",
  "chilly",
  "ladysfinger",
  "mushroom",
  "onion",
  "potato",
  "pumpkin",
  "tomato",
  "butter",
  "buttermilk",
  "cheese",
  "curd",
  "ghee",
  "icecream",
  "milk",
  "mozarellacheese",
  "panneer",
  "yoghurt",
  "beer",
  "coffee",
  "coke",
  "greentea",
  "lassi",
  "milkshake",
  "orangejuice",
  "tea",
  "water",
  "wine",
  "bread",
  "strawberrycake",
  "chocolatecake",
  "croissant",
  "cupcake",
  "donut",
  "pancake",
  "pie",
  "samosa",
  "whiteforestcake",
  "bananachips",
  "burger",
  "cookies",
  "frenchfries",
  "masalapeanuts",
  "mixednuts",
  "popcorn",
  "potatochips",
  "puff",
  "waffles",
];

const stockArr = [
  "fruits",
  "vegetables",
  "dairy",
  "beverages",
  "pasteries",
  "snacks",
];

(function () {
  fetch("/getCurrentUserMail")
    .then((response) => response.json())
    .then((data) => {
      currentUserMail = data.email;
      console.log("the user mail is", currentUserMail);
    });
})();

(function () {
  fetch("/getStockData")
  
    .then((response) => response.json())
    .then((data) => {
      stockDetails = Object.values(data);
    });
})();

(function () {
  fetch("/getFavouritesData")
    .then((response) => response.json())
    .then((data) => {
      let favouritesDataObj = data;
      favouritesData = favouritesDataObj.filter((element) => {
        if (Object.keys(element).length !== 0) {
          return true;
        }

        return false;
      });
      console.log("the favourites data is", favouritesData);
      displayFavourites();
    });
})();

function removeFromFavourites(selectedGrocery, clickedCard) {
  let toBeRemovedItem = {currentUserMail: currentUserMail,
                        groceryDetails: selectedGrocery}
  console.log("the curent selected grocery is", selectedGrocery);
  fetch("/removeFromFavourites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      ...toBeRemovedItem,
    }),
  })

  clickedCard.remove();
}
function addProductToCart(selectedGrocery, quantity) {
  console.log("coming inside addproducttocart");
  selectedGrocery.quantity = quantity;
  console.log("selectedGrocery", selectedGrocery);
  let userCartDetails = {
    currentUserMail: currentUserMail,
    groceryDetails: selectedGrocery,
  };
  fetch("/addToCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      ...userCartDetails,
    }),
  });
}

function displayFavourites() {
  console.log("StockDetails", stockDetails);
  let favouritesExists = false;
  for (let i = 0; i < favouritesData.length; i++) {
    if (favouritesData[i].currentUserMail === currentUserMail) {
      favouritesExists = true;
      favouriteCards = ``;
      for (let j = 0; j < favouritesData[i].groceryDetails.length; j++) {
        if (
          !favouritesArr.includes(favouritesData[i].groceryDetails[j].name) &&
          favouritesData[i].groceryDetails[j].name !== undefined
        ) {
          favouritesArr.push(favouritesData[i].groceryDetails[j].name);
          let categoryIndex = parseInt(
            pantryArr.indexOf(favouritesData[i].groceryDetails[j].name) / 10
          );
          let secondIndex = parseInt(
            pantryArr.indexOf(favouritesData[i].groceryDetails[j].name) % 10
          );
          if (favouritesData[i].groceryDetails[j].stockleft > 0) {
            favouriteCards += ` 
                          <div id="grocery-card-${categoryIndex}-${secondIndex}" class="grocery-card">
                          <div class="grocery-img"><img class="img-item" src="../assets/groceries/${stockArr[categoryIndex]}/${favouritesData[i].groceryDetails[j].name}.jpg"></div>
                          <div id="grocery-name" class="grocery-name">${favouritesData[i].groceryDetails[j].name}</div>
                          <div class="count-price">${favouritesData[i].groceryDetails[j].stockleft} KG left | Rs.${favouritesData[i].groceryDetails[j].price}/KG </div>
                          <div class="add-options">
                              <div id="add-to-cart" class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                              <div class="favorite"><img title="Remove from favourites" id="remove-img" class="remove-img" src="./assets/general-images/cancel.png"></div>
                          </div>
                          </div>`;
          } else {
            favouriteCards += ` 
                          <div id="grocery-card-${categoryIndex}-${secondIndex}" class="grocery-card">
                          <div class="grocery-img"><img class="img-item" src="../assets/groceries/${stockArr[categoryIndex]}/${favouritesData[i].groceryDetails[j].name}.jpg"></div>
                          <div id="grocery-name" class="grocery-name">${favouritesData[i].groceryDetails[j].name}</div>
                          <div class="count-price">Out of Stock</div>
                          <div class="add-options">
                              <div id="add-to-cart" class="add-to-cart"><button id="cart-add" class="cart-add" disabled>Add to Cart</button></div>
                              <div class="favorite"><img title="Remove from Favourites" id="remove-img" class="remove-img" src="./assets/general-images/cancel.png"></div>
                          </div>
                          </div>`;
          }
        }
      }
    }
  }
  if (favouritesExists) {
    favouriteCarousel.innerHTML = favouriteCards;
  } else {
    favouriteCarousel.innerHTML = "Your Favourites looks empty";
  }
  let cartAddButtons = document.querySelectorAll(".cart-add");
  let removeButtons = document.querySelectorAll(".remove-img");
  for (let i = 0; i < cartAddButtons.length; i++) {
    if (document.addEventListener) {
      cartAddButtons[i].addEventListener("click", function (event) {
        let clickedCard =
          event.target.parentElement.parentElement.parentElement;
        console.log("the clicked card is", clickedCard);
        let currIndex = parseInt(clickedCard.id.split("-")[2]);
        let stockIndex = parseInt(clickedCard.id.split("-")[3]);
        let currQuantity = 1;
        if (currQuantity > 0) {
          addProductToCart(stockDetails[currIndex][stockIndex], currQuantity);
        }
      });
    }
  }
  for (let i = 0; i < removeButtons.length; i++) {
    if (document.addEventListener) {
      removeButtons[i].addEventListener("click", function (event) {
        let clickedCard =
          event.target.parentElement.parentElement.parentElement;
        console.log(clickedCard);
        isFavourite = true;
        let currIndex = parseInt(clickedCard.id.split("-")[2]);
        let stockIndex = parseInt(clickedCard.id.split("-")[3]);
        removeFromFavourites(stockDetails[currIndex][stockIndex], clickedCard);
      });
    }
  }
}
