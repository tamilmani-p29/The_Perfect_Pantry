let fruitSelection = document.querySelector("#category-fruits");
let vegetableSelection = document.querySelector("#category-vegetables");
let pasterySelection = document.querySelector("#category-pasteries");
let beverageSelection = document.querySelector("#category-beverages");
let dairySelection = document.querySelector("#category-dairy");
let snackSelection = document.querySelector("#category-snacks");
let pantrySelectionHeading = document.querySelector("#pantry-items-heading");
let pantryCarousel = document.querySelector("#pantry-items-carousel");
let popularCarousel = document.querySelector("#popular-items-carousel");
let dropDownMenu = document.querySelector("#search-dropdown");
let searchInput = document.querySelector("#search-input");
let pantryContainer = document.querySelector("#pantry-container");
let appDetails = document.querySelector("#app-details");

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
      displayPopularItems();
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

function displayPopularItems() {
  popularCards = `<div class="scroll-btn"><img id="popular-prev-btn" class="prev-btn" src="./assets/general-images/previous.png"></div>`;
  let randomIndex = 0;
  for (let i = 0; i < 10; i++) {
    if (currStock[i].stockleft > 0) {
      popularCards += `
                          <div id="grocery-card-${randomIndex}-${i}" class="grocery-card">
                          <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${currStock[i].name}.jpg"></div>
                          <div id="grocery-name" class="grocery-name">${currStock[i].name}</div>
                          <div class="count-price">${currStock[i].stockleft}KG left | Rs.${currStock[i].price}/KG </div>
                          <div class="add-options">
                              <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                              <div><input id="count-selector-${randomIndex}-${i}" class="count-selector" type="number" value="1" min="1" max="10"></div>
                              <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                          </div>
                          </div>`;
      randomIndex++;
    }
  }
  popularCards += `<div class="scroll-btn"><img id="popular-next-btn" class="next-btn" src="./assets/general-images/next.png"></div></div>`;
  popularCarousel.innerHTML = popularCards;
  document.querySelector("#popular-next-btn").addEventListener("click", () => {
    console.log("inside scroll");
    popularCarousel.scrollLeft += 334;
  });

  document.querySelector("#popular-prev-btn").addEventListener("click", () => {
    console.log("inside scroll");
    popularCarousel.scrollLeft -= 334;
  });
}

function displaySearchedPantry() {
  userInputExists = false;
  searchOptions = `<div class="search-result">
                    <div class=search-result-heading>Your Search Results</div>
                    <div class="search-container">`;
  let userInputGrocery = searchInput.value;
  for (let i = 0; i < groceryDetails.length; i++) {
    if (groceryDetails[i].name.startsWith(userInputGrocery) && userInputGrocery.length >=1) {
      currStock = stockDetails[parseInt(i / 10)];
      currGrocery = currStock[i % 10];
      lowerCurrGrocery = stockArr[parseInt(i / 10)].toLowerCase();
      userInputExists = true;
      if (groceryDetails[i].stockleft > 0) {
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
      } else {
        searchOptions += `<div id="grocery-card-${parseInt(i / 10)}-${parseInt(
          i % 10
        )}" class="grocery-card out-of-stock-grocery"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${
          groceryDetails[i].name
        }.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${
                          groceryDetails[i].name
                        }</div> 
                        <div class="count-price">Out of Stock</div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add" disabled>Add to Cart</button></div>
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
  }
  searchOptions += "</div></div>";
  if (userInputExists) {
    pantryContainer.innerHTML = searchOptions;
  } else {
    sorryContent = `<div class="sorry-container"> 
                      <div class="sorry-text">Sorry! <br><br> The item you searched for doesn't seem to exist<br></div>
                      <div class="sorry-background"><img src="../assets/general-images/sorry2.png" alt="sorry-background-image"></div>
                      <div class="sorry-text">Please Try Again</div>
                    </div>`;
    pantryContainer.innerHTML = sorryContent;
  }
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
    if (currStock[i].stockleft > 0) {
      fruitDataCards += `
                        <div id="grocery-card-${index}-${i}" class="grocery-card"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${currStock[i].name}.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${currStock[i].name}</div> 
                        <div class="count-price">${currStock[i].stockleft}left | Rs.${currStock[i].price}/KG </div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                            <div><input id="count-selector-${index}-${i}" class="count-selector" type="number" value="1" min="1" max="10"></div>
                            <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                        </div>
                        </div>`;
    } else {
      fruitDataCards += `
                        <div id="grocery-card-${index}-${i}" class="grocery-card out-of-stock-grocery"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${currStock[i].name}.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${currStock[i].name}</div> 
                        <div class="count-price">Out of Stock</div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add" disabled>Add to Cart</button></div>
                            <div><input id="count-selector-${index}-${i}" class="count-selector" type="number" value="1" min="1" max="10"></div>
                            <div class="favorite"><img class="fav-img" src="./assets/general-images/favourite.png"></div>
                        </div>
                        </div>`;
    }
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
  console.log(stockDetails[currIndex][stockIndex], clickedCard, currQuantity);
  if (currQuantity > 0) {
    addProductToCart(
      stockDetails[currIndex][stockIndex],
      lowerCurrGrocery,
      currQuantity
    );
  }
});

appDetails.addEventListener("click", function(){
  window.location.href = "/";
})