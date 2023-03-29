let fruitSelection = document.querySelector("#category-fruits");
let vegetableSelection = document.querySelector("#category-vegetables");
let pasterySelection = document.querySelector("#category-pasteries");
let beverageSelection = document.querySelector("#category-beverages");
let dairySelection = document.querySelector("#category-dairy");
let snackSelection = document.querySelector("#category-snacks");
let pantrySelectionHeading = document.querySelector("#pantry-items-heading");
let pantryCarousel = document.querySelector("#pantry-items-carousel");
let dropDownMenu = document.querySelector("#search-dropdown");
let searchInput = document.querySelector("#search-input");
let pantryContainer = document.querySelector("#pantry-container");

let allGroceries = [];
let groceryDetails = [];
let currentUserMail;
let stockDetailsWithKeys;
let currStock;

const stockArr = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Beverages",
  "Pasteries",
  "Snacks",
];

const stockSelectorArr = [
  fruitSelection,
  vegetableSelection,
  dairySelection,
  beverageSelection,
  pasterySelection,
  snackSelection,
];

let stockDetails;
let lowerCurrGrocery;

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
      stockDetailsWithKeys = data;
      displayGroceryCards("Fruits");
      createDropDown();
    });
})();

function createDropDown() {
  let options = "";
  console.log(stockDetails);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < stockDetails[i].length; j++) {
      allGroceries.push(stockDetails[i][j].name);
      groceryDetails.push(stockDetails[i][j]);
      options += `<option>${stockDetails[i][j].name}</option>`;
    }
  }
  dropDownMenu.innerHTML = options;
}

function displaySearchedPantry() {
  userInputExists = false;
  searchOptions = `<div class="search-result">
                    <div class=search-result-heading>Your Search Results</div>`;
  let userInputGrocery = searchInput.value;
  for (let i = 0; i < groceryDetails.length; i++) {
    if (groceryDetails[i].name.startsWith(userInputGrocery)) {
      currStock = stockDetails[parseInt(i / 10)];
      currGrocery = currStock[i % 10];
      lowerCurrGrocery = stockArr[parseInt(i / 10)].toLowerCase();
      searchOptions += `<div id="grocery-card-${parseInt(i / 10)}-${parseInt(
        i % 10
      )}" class="grocery-card"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${
        groceryDetails[i].name
      }.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${
                          groceryDetails[i].name
                        }</div> 
                        <div class="count-price">${
                          groceryDetails[i].stockleft
                        }left | Rs.${groceryDetails[i].price}/KG </div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                            <div><input id="count-selector-${parseInt(
                              i / 10
                            )}-${parseInt(
        i % 10
      )}" class="count-selector" type="number" value="1" min="1" max="10"></div>
                            <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                        </div>
                        </div>`;
    }
  }
  searchOptions += "</div>";
  pantryContainer.innerHTML = searchOptions;
}

function addProductToCart(selectedGrocery, category, quantity) {
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

function displayGroceryCards(currGrocery) {
  let index = stockArr.indexOf(currGrocery);
  lowerCurrGrocery = stockArr[index].toLowerCase();
  currStock = stockDetails[index];
  let currStockSelector = stockSelectorArr[index];
  pantrySelectionHeading.innerHTML = currGrocery;
  currStockSelector.classList.add("background-color-adder");
  let fruitDataCards = `<div class="scroll-btn"><img id="prev-btn" class="prev-btn" src="./assets/general-images/previous.png"></div>`;

  for (let i = 0; i < stockSelectorArr.length; i++) {
    if (i != index) {
      stockSelectorArr[i].classList.remove("background-color-adder");
    }
  }
  for (let i = 0; i < currStock.length; i++) {
    fruitDataCards += `
                        <div id="grocery-card-${index}-${
       i
    }" class="grocery-card"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${
      currStock[i].name
    }.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${
                          currStock[i].name
                        }</div> 
                        <div class="count-price">${
                          currStock[i].stockleft
                        }left | Rs.${currStock[i].price}/KG </div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                            <div><input id="count-selector-${index}-${
       i
    }" class="count-selector" type="number" value="1" min="1" max="10"></div>
                            <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                        </div>
                        </div>`;
  }
  fruitDataCards += `<div class="scroll-btn"><img id="next-btn" class="next-btn" src="./assets/general-images/next.png"></div> `;
  pantryCarousel.innerHTML = fruitDataCards;

  document.querySelector("#next-btn").addEventListener("click", () => {
    console.log("inside scroll");
    pantryCarousel.scrollLeft += 334;
  });

  document.querySelector("#prev-btn").addEventListener("click", () => {
    console.log("inside scroll");
    pantryCarousel.scrollLeft -= 334;
  });
  fruitSelection.addEventListener("click", function () {
    displayGroceryCards("Fruits");
  });

  vegetableSelection.addEventListener("click", function () {
    displayGroceryCards("Vegetables");
  });

  dairySelection.addEventListener("click", function () {
    displayGroceryCards("Dairy");
  });

  beverageSelection.addEventListener("click", function () {
    displayGroceryCards("Beverages");
  });

  pasterySelection.addEventListener("click", function () {
    displayGroceryCards("Pasteries");
  });

  snackSelection.addEventListener("click", function () {
    displayGroceryCards("Snacks");
  });
}

fruitSelection.addEventListener("click", function () {
  displayGroceryCards("Fruits");
});

vegetableSelection.addEventListener("click", function () {
  displayGroceryCards("Vegetables");
});

dairySelection.addEventListener("click", function () {
  displayGroceryCards("Dairy");
});

beverageSelection.addEventListener("click", function () {
  displayGroceryCards("Beverages");
});

pasterySelection.addEventListener("click", function () {
  displayGroceryCards("Pasteries");
});

snackSelection.addEventListener("click", function () {
  displayGroceryCards("Snacks");
});

searchInput.addEventListener("change", displaySearchedPantry);

pantryContainer.addEventListener("click", function (event) {
  let clickedCard = event.target.parentElement.parentElement.parentElement;
  let currIndex = parseInt(clickedCard.id.split("-")[2]);
  let stockIndex = parseInt(clickedCard.id.split("-")[3]);
  let currQuantity = document.querySelector(
    `#count-selector-${currIndex}-${stockIndex}`
  ).value;
  console.log(stockDetails[currIndex][stockIndex],clickedCard, currQuantity);
  addProductToCart(
    stockDetails[currIndex][stockIndex],
    lowerCurrGrocery,
    currQuantity
  );
});
