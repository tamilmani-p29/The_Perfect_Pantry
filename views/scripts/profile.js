let currentUserMail;
let allUserData;
let originalPassword;
let userName = document.querySelector("#name");
let userPassword = document.querySelector("#password");
let userEmail = document.querySelector("#email");
let userAddress = document.querySelector("#address");
let nameChangeButton = document.querySelector("#name-edit-btn");
let passwordChangeButton = document.querySelector("#password-change-btn");
let addressChangeButton = document.querySelector("#address-change-btn");
let saveButton = document.querySelector("#save-change-btn");
let favSectionButton = document.querySelector("#fav-section-btn");
let appDetails = document.querySelector("#app-details");
let savePopup = document.querySelector("#save-change-popup");

(function () {
  fetch("/getAllUserData")
    .then((response) => response.json())
    .then((data) => {
      allUserData = Object.values(data);
      fetch("/getCurrentUserMail")
        .then((response) => response.json())
        .then((data) => {
          currentUserMail = data.email;
          displayUserInfo();
        });
    });
})();

nameChangeButton.addEventListener("click", function () {
  userName.contentEditable = "true";
  userName.focus();
});

passwordChangeButton.addEventListener("click", function () {
  userPassword.contentEditable = "true";
  userPassword.focus();
});

addressChangeButton.addEventListener("click", function () {
  userAddress.contentEditable = "true";
  userAddress.focus();
});

favSectionButton.addEventListener("click", function () {
  window.location.href = "/favourites";
});

saveButton.addEventListener("click", function () {
  userName.contentEditable = "false";
  userPassword.contentEditable = "false";
  userAddress.contentEditable = "false";
  let newPassword = originalPassword + userPassword.innerHTML.slice(originalPassword.length);
  newUserDetails = {
    newName: userName.innerHTML,
    newPassword: newPassword,
    newAddress: userAddress.innerHTML,
  };
  fetch("/updateUserDetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      ...newUserDetails,
    }),
  });
  //savePopup.classList.remove("show");
  alert("Changed saved");
});
function displayUserInfo() {
  console.log("insideuserinfo");
  console.log(allUserData);
  console.log(currentUserMail);
  for (let i = 0; i < allUserData.length; i++) {
    if (allUserData[i].email == currentUserMail) {
      originalPassword = allUserData[i].password;
      let hashedPassword = '';
      for(let j=0; j<allUserData[i].password.length; j++){
        hashedPassword +='*';
      }
      userName.innerHTML = allUserData[i].name;
      userPassword.innerHTML = hashedPassword;
      userEmail.innerHTML = allUserData[i].email;
      userAddress.innerHTML = allUserData[i].address;
    }
  }
}

function updateName() {
  userName.contentEditable = "true";
  saveButton.addEventListener("click");
}

appDetails.addEventListener("click", function () {
  window.location.href = "/";
});