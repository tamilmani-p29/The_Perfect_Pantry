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
let userCreated = true;

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
  res.json({email: currentEmail});
});

app.get("/getPastOrders", function (req, res) {
  fs.readFile("pastOrders.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/sendPastOrders", function (req, res) {
  let newOrders = req.body;
  fs.writeFile(
    "pastOrders.json",
    JSON.stringify(newOrders, null, 2),
    (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully");
      }
    }
  );
  res.json({ message: "ok" });
});

app.post("/addToCart", function (req, res) {
  let userMail = req.body.currentUserMail;
  let userCartDetails = req.body.groceryDetails;
  console.log("usercartdetails", userCartDetails);
  fs.readFile("userPantryDetails.json", function (err, data) {
    if (err) {
      console.log(err);
    }
    let userDataExists = false;
    let userStockData = JSON.parse(data);
    for (let i = 0; i < userStockData.length; i++) {
      if (userStockData[i].currentUserMail == userMail) {
        userDataExists = true;
        userStockData[i].groceryDetails.push(userCartDetails);
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
  });
  res.json({message:"ok"});
});

app.post("/updateUserDetails", function (req, res) {
  console.log("updated details", req.body);
  let newName = req.body.newName;
  fs.readFile("userDatabase.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let existingUserData = JSON.parse(data);
      //console.log('existing data',existingUserData);
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
  userCreated = false;
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
      if (userValues[i].email == email && userValues[i].password == password) {
        userExists = true;

        currentUserName = userValues[i].name;
      } else if (
        userValues[i].email == email &&
        userValues[i].password != password
      ) {
        userExists = false;
      } else if (
        userValues[i].email != email &&
        userValues[i].password == password
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
      }
    }
    if (userCreated === true) {
      existingData[id] = {
        id: id,
        name: name,
        email: email,
        password: password,
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
