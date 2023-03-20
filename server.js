const express = require("express");
const fs = require("fs");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

let userExists = false;
let currentEmail;
let currURL;
let userCreated = false;

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
    existingData[id] = { id: id, name: name, email: email, password: password };
    userCreated = true;
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
  });
  
req.flash("message", "Account Created Successfully");
res.redirect("/login");
  
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
