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
let searchIcon = document.querySelector("#search-icon");
let cartAddButton = document.querySelector("#cart-add");
let cartAddContainer = document.querySelector("#add-to-cart");
let cartAdditionPopup = document.querySelector("#cart-add-popup");
let categoriesSection = document.querySelector("#categories");
let favoriteSelection = document.querySelector("#fav-img");
let heartMap = {
  true: "red-fav",
  false: "favourite",
};

let allGroceries = [];
let groceryDetails = [];
let currentUserMail;
let stockDetailsWithKeys;
let currStock;
let favouritesData;
let favouritesArr = [];
let uniqueFavourites;
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

window.addEventListener("load", function () {
  fetch("/getCurrentUserMail")
    .then((response) => response.json())
    .then((data) => {
      currentUserMail = data.email;
      //console.log("the user mail is", currentUserMail);
    });
});

window.addEventListener("load", function () {
  fetch("/getStockData")
    .then((response) => response.json())
    .then((data) => {
      stockDetails = Object.values(data);
      //console.log("stock details is", stockDetails)
      stockDetailsWithKeys = data;
      //fruitSelection.dispatchEvent(new Event("click"));
      displayPopularItems();
      createDropDown();
      displayGroceryCards("Fruits");
    });
});

window.addEventListener("load", function () {
  fetch("/getFavouritesData")
    .then((response) => response.json())
    .then((data) => {
      favouritesData = data;
      console.log("the favourites data is", favouritesData);
      console.log("the user mail is", currentUserMail);
      for (let i = 0; i < favouritesData.length; i++) {
        if (favouritesData[i].currentUserMail === currentUserMail) {
          for (let j = 0; j < favouritesData[i].groceryDetails.length; j++) {
            if (
              !favouritesArr.includes(
                favouritesData[i].groceryDetails[j].name
              ) &&
              favouritesData[i].groceryDetails[j].name !== undefined
            ) {
              console.log(
                "favourite is ok",
                favouritesData[i].groceryDetails[j].name
              );
              favouritesArr.push(favouritesData[i].groceryDetails[j].name);
            }
          }
        }
      }
    });
});

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
  popularCards = ``;
  let randomIndex = Math.floor(Math.random() * 5 + 0);
  let lowerCurrCategory = stockArr[randomIndex].toLowerCase();
  currStock = stockDetails[randomIndex];
  let favouriteIcon;
  for (let i = 0; i < 10; i++) {
    if (favouritesArr.includes(currStock[i].name)) {
      favouriteIcon = "red-fav2";
    } else {
      favouriteIcon = "favourite";
    }
    if (currStock[i].stockleft > 0) {
      popularCards += ` 
                          <div id="grocery-card-${randomIndex}-${i}" class="grocery-card">
                          <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrCategory}/${currStock[i].name}.jpg"></div>
                          <div id="grocery-name" class="grocery-name">${currStock[i].name}</div>
                          <div class="count-price">${currStock[i].stockleft} KG left | Rs.${currStock[i].price}/KG </div>
                          <div class="add-options">
                              <div id="add-to-cart" class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                              <div class="favorite"><img title="Add to Favourites" id="fav-img" class="fav-img" src="./assets/general-images/${favouriteIcon}.png"></div>
                          </div>
                          </div>`;
    } else {
      popularCards += ` 
                          <div id="grocery-card-${randomIndex}-${i}" class="grocery-card out-of-stock-grocery">
                          <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrCategory}/${currStock[i].name}.jpg"></div>
                          <div id="grocery-name" class="grocery-name">${currStock[i].name}</div>
                          <div class="count-price">Out of Stock</div>
                          <div class="add-options">
                              <div id="add-to-cart" class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                              <div class="favorite"><img id="fav-img" class="fav-img" src="./assets/general-images/${favouriteIcon}.png"></div>
                          </div>
                          </div>`;
    }
  }
  popularCarousel.innerHTML = popularCards;
  let cartAddButtons = document.querySelectorAll(".cart-add");
  let favouriteButtons = document.querySelectorAll(".fav-img");
  console.log(favouriteButtons.length);
  for (let i = 0; i < cartAddButtons.length; i++) {
    if (document.addEventListener) {
      cartAddButtons[i].addEventListener("click", function (event) {
        let clickedCard =
          event.target.parentElement.parentElement.parentElement;
        console.log("the clicked card is", clickedCard);
        let currIndex = parseInt(clickedCard.id.split("-")[2]);
        let stockIndex = parseInt(clickedCard.id.split("-")[3]);
        let currQuantity = "1";
        addProductToCart(
          stockDetails[currIndex][stockIndex],
          lowerCurrGrocery,
          currQuantity
        );
        alert("Item added successfully");
      });
    }
  }
  for (let i = 0; i < favouriteButtons.length; i++) {
    if (document.addEventListener) {
      
      favouriteButtons[i].addEventListener("click", function (event) {
        let clickedCard =
          event.target.parentElement.parentElement.parentElement;
        console.log(clickedCard);
        let currIndex = parseInt(clickedCard.id.split("-")[2]);
        let stockIndex = parseInt(clickedCard.id.split("-")[3]);
        let favIconSrc = favouriteButtons[i].src.split("/")[5];
        console.log(favIconSrc);
        if (favIconSrc === "favourite.png") {
          favouriteButtons[i].src = `../assets/general-images/red-fav2.png`;
          addProductToFavourites(
            stockDetails[currIndex][stockIndex],
            lowerCurrGrocery,
            clickedCard
          );
          alert("Item added to favourites");
        } else {
          alert("Item already in favourites");
        }
      });
    }
  }
}

function displaySearchedPantry() {
  userInputExists = false;
  searchOptions = `<div class="search-result">
                    <div class=search-result-heading>Your Search Results</div>
                    <div class="search-container">`;

  let userInputGrocery = searchInput.value.replace(/\s+/g, "").toLowerCase();
  for (let i = 0; i < groceryDetails.length; i++) {
    if (
      groceryDetails[i].name.includes(userInputGrocery) &&
      userInputGrocery.length >= 1
    ) {
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
                        } KG left | Rs.${groceryDetails[i].price}/KG </div> 
                        <div class="add-options">
                            <div class="add-to-cart"><button id="cart-add" class="cart-add">Add to Cart</button></div>
                            <div class="favorite"><img id="fav-img" class="fav-img" src="./assets/general-images/favourite.png"></div>
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
                            <div class="favorite"><img id="fav-img" class="fav-img" src="./assets/general-images/favourite.png"></div>
                        </div>
                        </div>`;
      }
    }
  }
  searchOptions += `</div></div>`;
  if (userInputExists) {
    pantryContainer.innerHTML = searchOptions;
    let cartAddButtons = document.querySelectorAll(".cart-add");
    let favouriteButtons = document.querySelectorAll(".fav-img");

    for (let i = 0; i < cartAddButtons.length; i++) {
      if (document.addEventListener) {
        cartAddButtons[i].addEventListener("click", function (event) {
          let clickedCard =
            event.target.parentElement.parentElement.parentElement;
          console.log("the clicked card is", clickedCard);
          let currIndex = parseInt(clickedCard.id.split("-")[2]);
          let stockIndex = parseInt(clickedCard.id.split("-")[3]);
          let currQuantity = "1";
          console.log(
            stockDetails[currIndex][stockIndex],
            clickedCard,
            currQuantity
          );
          addProductToCart(
            stockDetails[currIndex][stockIndex],
            lowerCurrGrocery,
            currQuantity
          );
        });
      }
    }

    for (let i = 0; i < favouriteButtons.length; i++) {
      if (document.addEventListener) {
        favouriteButtons[i].addEventListener("click", function (event) {
          let clickedCard =
            event.target.parentElement.parentElement.parentElement;
          console.log(clickedCard);
          let currIndex = parseInt(clickedCard.id.split("-")[2]);
          let stockIndex = parseInt(clickedCard.id.split("-")[3]);
          favouriteButtons[i].src = `../assets/general-images/red-fav2.png`;
          addProductToFavourites(
            stockDetails[currIndex][stockIndex],
            lowerCurrGrocery,
            clickedCard
          );
        });
      }
    }
  } else {
    sorryContent = `<div class="sorry-container"> 
                      <div class="sorry-text">Sorry! The item you searched for doesn't seem to exist<br></div>
                      <div class="sorry-background"><img src="../assets/general-images/sorry2.png" alt="sorry-background-image"></div>
                      <div class="sorry-text">Please Try Again</div>
                    </div>`;
    pantryContainer.innerHTML = sorryContent;
  }
  categoriesSection.innerHTML = `<div id="app-details" class="app-details details-in-search">
          <div class="app-logo">
            <img class="logo-img" src="./assets/general-images/logo.png" />
          </div>
          <div class="app-name">The Perfect Pantry</div>
        </div>
        <div class="back-home"> 
          <form action="/">
            <button type="submit" class="home-btn">Back To Home</button>
          </form>
        </div>
        <div class="logout-btn search-logout">
          <form action="/logout" method="POST">
            <button class="logout" type="submit">Logout</button>
          </form>
        </div>`;
}

function addProductToFavourites(selectedGrocery, category, clickedCard) {
  console.log("coming inside addproduct to favourites");
  let userFavDetails = {
    currentUserMail: currentUserMail,
    groceryDetails: selectedGrocery,
    clickedCard: clickedCard,
  };
  fetch("/addToFavourites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      ...userFavDetails,
    }),
  }).then((data) => {
    console.log(data);
  });
}

function addProductToCart(selectedGrocery, category, quantity) {
  console.log("coming inside addproducttocart");
  selectedGrocery.quantity = quantity.toString();
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
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function displayGroceryCards(currGrocery) {
  let index = stockArr.indexOf(currGrocery);
  lowerCurrGrocery = stockArr[index].toLowerCase();
  console.log("currstock is", lowerCurrGrocery);
  currStock = stockDetails[index];
  console.log(currStock);
  let currStockSelector = stockSelectorArr[index];
  pantrySelectionHeading.innerHTML = currGrocery;
  currStockSelector.classList.add("background-color-adder");
  let fruitDataCards = `<div class="scroll-btn"><img id="prev-btn" class="prev-btn" src="./assets/general-images/previous.png"></div>`;

  for (let i = 0; i < stockSelectorArr.length; i++) {
    if (i != index) {
      stockSelectorArr[i].classList.remove("background-color-adder");
    }
  }
  let favouriteIcon;
  console.log("the favourites array is", favouritesArr);
  for (let i = 0; i < currStock.length; i++) {
    //console.log("favourites array is", favouritesArr);
    if (favouritesArr.includes(currStock[i].name)) {
      favouriteIcon = "red-fav2";
    } else {
      favouriteIcon = "favourite";
    }
    if (currStock[i].stockleft > 0) {
      fruitDataCards += `
                        <div id="grocery-card-${index}-${i}" class="grocery-card"> 
                        <div class="grocery-img"><img class="img-item" src="../assets/groceries/${lowerCurrGrocery}/${currStock[i].name}.jpg"></div> 
                        <div id="grocery-name" class="grocery-name">${currStock[i].name}</div> 
                        <div class="count-price">${currStock[i].stockleft} KG left | Rs.${currStock[i].price}/KG </div> 
                        <div class="add-options">
                            <div class="add-to-cart">
                              <button id="cart-add" class="cart-add">Add to Cart</button>
                              <span id="cart-add-popup" class="cart-add-popup">Item Added Successfully!</span>
                            </div>
                            <div class="favorite"><img id="fav-img" class="fav-img" src="./assets/general-images/${favouriteIcon}.png"></div>
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
                            <div class="favorite"><img id="fav-img" class="fav-img" src="./assets/general-images/${favouriteIcon}.png"></div>
                        </div>
                        </div>`;
    }
  }

  fruitDataCards += `<div class="scroll-btn"><img id="next-btn" class="next-btn" src="./assets/general-images/next.png"></div>`;
  pantryCarousel.innerHTML = fruitDataCards;

  document.querySelector("#next-btn").addEventListener("click", () => {
    console.log("inside scroll");
    pantryCarousel.scrollLeft += 264;
  });

  document.querySelector("#prev-btn").addEventListener("click", () => {
    console.log("inside scroll");
    pantryCarousel.scrollLeft -= 264;
  });
  let cartAddButtons = document.querySelectorAll(".cart-add");
  let favouriteButtons = document.querySelectorAll(".fav-img");

  for (let i = 0; i < cartAddButtons.length; i++) {
    if (document.addEventListener) {
      cartAddButtons[i].addEventListener("click", function (event) {
        let clickedCard =
          event.target.parentElement.parentElement.parentElement;
        console.log("the clicked card is", clickedCard);
        let currIndex = parseInt(clickedCard.id.split("-")[2]);
        let stockIndex = parseInt(clickedCard.id.split("-")[3]);
        let currQuantity = "1";
        console.log(
          stockDetails[currIndex][stockIndex],
          clickedCard,
          currQuantity
        );
        addProductToCart(
          stockDetails[currIndex][stockIndex],
          lowerCurrGrocery,
          currQuantity
        );
        alert("Item added successfully");
      });
    }
  }
  for (let i = 0; i < favouriteButtons.length; i++) {
    if (document.addEventListener) {
      favouriteButtons[i].addEventListener("click", function (event) {
        let clickedCard =
          event.target.parentElement.parentElement.parentElement;
        console.log(clickedCard);
        let currIndex = parseInt(clickedCard.id.split("-")[2]);
        let stockIndex = parseInt(clickedCard.id.split("-")[3]);
        let favIconSrc = favouriteButtons[i].src.split("/")[5]; 
        console.log(favIconSrc)
        if(favIconSrc === "favourite.png"){
        favouriteButtons[i].src = `../assets/general-images/red-fav2.png`;
        addProductToFavourites(
          stockDetails[currIndex][stockIndex],
          lowerCurrGrocery,
          clickedCard
        );
        alert("Item added to favourites");
        }
        else{
          alert("Item already in favourites");
        }

      });
    }
  }
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

searchInput.addEventListener("input", displaySearchedPantry);

searchIcon.addEventListener("click", displaySearchedPantry);

appDetails.addEventListener("click", function () {
  window.location.href = "/";
});

window.addEventListener("pageshow", function (event) {
  var historyTraversal =
    event.persisted ||
    (typeof window.performance != "undefined" &&
      window.performance.navigation.type === 2);
  if (historyTraversal) {
    window.location.reload();
  }
});
