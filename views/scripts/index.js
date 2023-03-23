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

(function () {
  fetch("/getCurrentUserMail")
    .then((response) => response.json())
    .then((data) => {
      currentUserMail = data.email;
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

searchInput.addEventListener("change", displaySearchedPantry);

function createDropDown() {
  let options = "";
  console.log(stockDetails);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < stockDetails.length; j++) {
      allGroceries.push(stockDetails[i][j].name);
      groceryDetails.push(stockDetails[i][j]);
      options += `<option>${stockDetails[i][j].name}</option>`;
    }
  }
  dropDownMenu.innerHTML = options;
}

function displaySearchedPantry() {
  let groceryExists = false;
  let groceryInput = searchInput.value;
  let searchResults = `<div class="search-result-heading">Your Search Result</div>
                       <div class="search-result-carousel">`;
  for (let i = 0; i < groceryDetails.length; i++) {
    let categoryIndex = parseInt(i / 6);
    let groceryCategory = stockArr[categoryIndex].toLowerCase();
    if (groceryDetails[i].name.startsWith(groceryInput)) {
      console.log(categoryIndex);
      groceryExists = true;
      searchResults += `
                      <div class="grocery-card">
                  <div class="grocery-img">
                    <img
                      class="img-item"
                      src="./assets/groceries/${groceryCategory}/${groceryDetails[i].name}.jpg"
                    />
                  </div>
                  <div class="grocery-name">${groceryDetails[i].name}</div>
                  <div class="count-price">${groceryDetails[i].stockleft}left | Rs.${groceryDetails[i].price}/KG</div>
                  <div class="add-options">
                      <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                      <div><input id="count-selector" class="count-selector" type="number" value="1" min="1" max="10"></div>
                      <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                  </div>
                </div>`;
    }
    console.log(groceryDetails[i]);
  }
  searchResults += `</div>`;
  if (groceryExists) {
    pantryContainer.innerHTML = searchResults;
  }
  if (!groceryExists) {
    pantryContainer.innerHTML = `<div class='sorry-container'>
                                  <div class='sorry-text'>Sorry We could not find what you are looking for<br><br>Try Again</div>
                                  <img class="sorry-background" src="./assets/general-images/sorry2.png">
                                </div>`;
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
}

function relaod(){
  window.location.reload();
}

function addProductToCart(selectedGrocery, category, quantity) { 
  selectedGrocery.quantity = quantity;
  console.log("selectedGrocery", selectedGrocery);
  let userCartDetails = {currentUserMail: currentUserMail,
                          groceryDetails: selectedGrocery}; 
  fetch("/addToCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      ...userCartDetails
    }),
  })
}

function displayGroceryCards(currGrocery) {
  let index = stockArr.indexOf(currGrocery);
  let lowerCurrGrocery = stockArr[index].toLowerCase();
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
                        <div id="grocery-card-${i}" class="grocery-card"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${currStock[i].name}.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${currStock[i].name}</div> 
                        <div class="count-price">${currStock[i].stockleft}left | Rs.${currStock[i].price}/KG </div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                            <div><input id="count-selector-${i}" class="count-selector" type="number" value="1" min="1" max="10"></div>
                            <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                        </div>
                        </div>`;
  }
  fruitDataCards += `<div class="scroll-btn"><img id="next-btn" class="next-btn" src="./assets/general-images/next.png"></div> `;
  pantryCarousel.innerHTML = fruitDataCards;

  pantryContainer.addEventListener("click", function (event) {
    let clickedCard = event.target.parentElement.parentElement.parentElement;
    let currIndex = parseInt(clickedCard.id.split("-")[2]);
    let currQuantity = document.querySelector(`#count-selector-${currIndex}`).value;
    addProductToCart(currStock[currIndex], lowerCurrGrocery, currQuantity);
  });

  document.querySelector("#next-btn").addEventListener("click", () => {
    console.log("inside scroll");
    pantryCarousel.scrollLeft += 334;
  });

  document.querySelector("#prev-btn").addEventListener("click", () => {
    console.log("inside scroll");
    pantryCarousel.scrollLeft -= 334;
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

