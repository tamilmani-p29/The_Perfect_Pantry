const express = require("express");
const fs = require("fs");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { exit } = require("process");

const app = express();
const port = 5000;

let userExists = false;
let currentEmail;
let currURL;
let userCreated;

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
app.use(cookieParser("NotSoSecret"));
app.use(
  session({
    secret: "something",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.json());
app.get("/", function (req, res) {
  if (userExists) {
    currURL = "/";
    return res.render("index.ejs", { message: req.flash("message") });
  } else {
    return res.redirect("/login");
  }
});

app.get("/login", function (req, res) {
  if (userExists) {
    return res.redirect(currURL);
  } else {
    return res.render("login.ejs", { message: req.flash("message") });
  }
});

app.get("/register", function (req, res) {
  if (userExists) {
    res.redirect(currURL);
  } else {
    res.render("register.ejs", { message: req.flash("message") });
  }
});

app.get("/cart", function (req, res) {
  res.render("cart.ejs");
});

app.get("/profile", function (req, res) {
  res.render("profile.ejs");
});

app.get("/favourites", function (req, res) {
  res.render("favourites.ejs");
});

app.get("/getStockData", function (req, res) {
  fs.readFile("pantryStock.json", function (err, data) {
    if (err) {
      console.log(err);
    }
    const stockData = JSON.parse(data);
    //console.log(stockData);
    res.json(stockData);
  });
});

app.get("/getFavouritesData", function (req, res) {
  fs.readFile("favourites.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let favouritesData = JSON.parse(data);
      res.json(favouritesData);
    }
  });
});

app.get("/getUserCartItems", function (req, res) {
  let stockDetailsObj;
  fs.readFile("userPantryDetails.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      stockDetailsObj = JSON.parse(data);
      res.json(stockDetailsObj);
    }
  });
});

app.get("/getAllUserData", function (req, res) {
  fs.readFile("userDataBase.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let allUserData = JSON.parse(data);
      res.json(allUserData);
    }
  });
});

app.get("/getCurrentUserMail", function (req, res) {
  console.log(currentEmail);
  res.json({ "email": currentEmail });
});

app.post("/removeElementsFromCart", function (req, res) {
  const itemToRemove = req.body.removeElement;
  const currentUserMail = req.body.currentMail;
  console.log(itemToRemove);
  console.log("item to be removed is ", itemToRemove);
  fs.readFile("userPantryDetails.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let userCartItems = JSON.parse(data);
      console.log("user cart items for removing elements are ", userCartItems);
      for (let i = 0; i < userCartItems.length; i++) {
        if (
          userCartItems[i] !== null &&
          userCartItems[i].currentUserMail === currentUserMail
        ) {
          console.log("checking mail");
          let isCartEmtpy = false;
          let emptyObjectCount = 0;
          for (let j = 0; j < userCartItems[i].groceryDetails.length; j++) {
            if (userCartItems[i].groceryDetails[j].name === itemToRemove) {
              userCartItems[i].groceryDetails[j] = {};
              emptyObjectCount++;
            }
          }
          if (userCartItems[i].groceryDetails.length === emptyObjectCount) {
            userCartItems[i] = {};
            isCartEmtpy = true;
          }
        }
      }
      fs.writeFile(
        "userPantryDetails.json",
        JSON.stringify(userCartItems, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("data deleted successfully");
          }
        }
      );
    }
  });
});

app.post("/sendCartOrders", function (req, res) {
  let currentCartOrders = req.body;
  console.log("current cart orders", currentCartOrders);
  fs.readFile("pastOrders.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let oldOrderObj = JSON.parse(data);
      oldOrderObj.push(currentCartOrders);
      fs.writeFile(
        "pastOrders.json",
        JSON.stringify(oldOrderObj, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully");
          }
        }
      );
    }
  });
  fs.readFile("userPantryDetails.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let cartPageItems = JSON.parse(data);
      for (let i = 0; i < cartPageItems.length; i++) {
        if (
          cartPageItems[i] !== null &&
          cartPageItems[i].currentUserMail === currentEmail
        ) {
          cartPageItems[i] = {};

          console.log(cartPageItems);
          break;
        }
      }
      fs.writeFile(
        "userPantryDetails.json",
        JSON.stringify(cartPageItems, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("data deleted successfully");
          }
        }
      );
    }
  });
  fs.readFile("pantryStock.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let pantryHistory = JSON.parse(data);

      let ordersAlone = currentCartOrders.orders;
      console.log("orders are", ordersAlone);
      for (let order in ordersAlone) {
        for (let category in pantryHistory) {
          for (let i = 0; i < pantryHistory[category].length; i++) {
            if (pantryHistory[category][i].name === order) {
              let stockLeft =
                parseInt(pantryHistory[category][i].stockleft) -
                ordersAlone[order].quantity;
              console.log("the left over stock is", stockLeft);
              pantryHistory[category][i].stockleft = stockLeft.toString();
              console.log(pantryHistory[category][i]);
            }
          }
        }
      }
      fs.writeFile(
        "pantryStock.json",
        JSON.stringify(pantryHistory, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("stock updated successfully");
          }
        }
      );
    }
  });
});

app.post("/addToCart", function (req, res) {
  let userMail = req.body.currentUserMail;
  let userCartDetails = req.body.groceryDetails;
  console.log("usercartdetails", userCartDetails);
  fs.readFile("userPantryDetails.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let userDataExists = false;
      let userStockData = JSON.parse(data);
      console.log("userstockdata is", userStockData);
      for (let i = 0; i < userStockData.length; i++) {
        if (userStockData[i].currentUserMail === userMail) {
          userDataExists = true;
          userStockData[i].groceryDetails.push(userCartDetails);
          break;
        }
      }
      if (userDataExists === false) {
        userStockData.push({
          currentUserMail: userMail,
          groceryDetails: [userCartDetails],
        });
      }
      console.log(userStockData);
      fs.writeFile(
        "userPantryDetails.json",
        JSON.stringify(userStockData, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully");
          }
        }
      );
    }
  });
  res.json({ message: "ok" });
});

app.post("/removeFromFavourites", function (req, res) {
  let userMail = req.body.currentUserMail;
  let userFavDetails = req.body.groceryDetails;
  fs.readFile("favourites.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let userDataExists = false;
      let userStockData = JSON.parse(data);
      console.log("userstockdata is", userStockData);
      for (let i = 0; i < userStockData.length; i++) {
        if (
          userStockData !== null &&
          userStockData[i].currentUserMail === userMail
        ) {
          userDataExists = true;
          for (let j = 0; j < userStockData[i].groceryDetails.length; j++) {
            if (
              userStockData[i].groceryDetails !== null && 
              userStockData[i].groceryDetails[j].name === userFavDetails.name
            ) {
              userStockData[i].groceryDetails[j] = {};
            }
          }
        }
      }
      console.log(userStockData);
      fs.writeFile(
        "favourites.json",
        JSON.stringify(userStockData, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully");
          }
        }
      );
    }
  });
  res.json({ message: "ok" });
});

app.post("/addToFavourites", function (req, res) {
  let userMail = req.body.currentUserMail;
  let userFavDetails = req.body.groceryDetails;
  fs.readFile("favourites.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let userDataExists = false;
      let userStockData = JSON.parse(data);
      console.log("userstockdata is", userStockData);
      for (let i = 0; i < userStockData.length; i++) {
        if (
          userStockData !== null &&
          userStockData[i].currentUserMail === userMail
        ) {
          userDataExists = true;
          userStockData[i].groceryDetails.push(userFavDetails);
        }
      }
      if (userDataExists === false) {
        userStockData.push({
          currentUserMail: userMail,
          groceryDetails: [userFavDetails],
        });
      }
      console.log(userStockData);
      fs.writeFile(
        "favourites.json",
        JSON.stringify(userStockData, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully");
          }
        }
      );
    }
  });
  res.json({ message: "ok" });
});

app.post("/updateUserDetails", function (req, res) {
  console.log("updated details", req.body);
  let newName = req.body.newName;
  fs.readFile("userDatabase.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let existingUserData = JSON.parse(data);
      for (let key in existingUserData) {
        console.log(key, existingUserData[key]);
        if (existingUserData[key].email == currentEmail) {
          existingUserData[key].name = req.body.newName;
          existingUserData[key].password = req.body.newPassword;
          existingUserData[key].address = req.body.newAddress;
        }
      }
      fs.writeFile(
        "userDatabase.json",
        JSON.stringify(existingUserData, null, 2),
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully written");
          }
        }
      );
    }
  });
  res.json({ message: "ok" });
});

app.post("/login", function (req, res) {
  userExists = false;
  let email = req.body.email;
  currentEmail = email;
  let password = req.body.password;
  fs.readFile("userDatabase.json", function (err, data) {
    if (err) {
      console.log(err);
    }
    const userData = JSON.parse(data);
    const userValues = Object.values(userData);

    for (let i = 0; i < userValues.length; i++) {
      if (
        userValues[i].email === email &&
        userValues[i].password === password
      ) {
        userExists = true;
        currentUserName = userValues[i].name;
        break;
      } else if (
        userValues[i].email === email &&
        userValues[i].password !== password
      ) {
        userExists = false;
      } else if (
        userValues[i].email !== email &&
        userValues[i].password === password
      ) {
        userExists = false;
      }
    }
    if (userExists === false) {
      req.flash("message", "login with proper credentials");
      res.redirect("/login");
    } else {
      req.flash("message", "logged in successfully");
      res.redirect("/");
    }
  });
});

app.post("/register", function (req, res) {
  userCreated = true;
  let id = Date.now().toString();
  let email = req.body.email;
  let name = req.body.name;
  let password = req.body.password;
  fs.readFile("userDatabase.json", function (err, data) {
    if (err) {
      console.log(err);
    }
    const existingData = JSON.parse(data);
    console.log(existingData);
    oldUserData = Object.values(existingData);
    for (let index = 0; index < oldUserData.length; index++) {
      if (oldUserData[index].email === email) {
        userCreated = false;
        break;
      }
    }
    if (userCreated === true) {
      existingData[id] = {
        id: id,
        name: name,
        email: email,
        password: password,
        address: "",
      };
      fs.writeFile(
        "userDatabase.json",
        JSON.stringify(existingData, null, 2),
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully written");
          }
        }
      );
      req.flash("message", "Account created successfully");
      res.redirect("/login");
    } else {
      req.flash("message", "User already exists with same mail");
      res.redirect("/register");
    }
  });
});

app.post("/logout", function (req, res) {
  currentUserName = "";
  userExists = false;
  console.log("logged out successfully");
  res.redirect("/login");
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
