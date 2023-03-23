let currentUserMail;
let allUserData;

let userName = document.querySelector("#name");
let userPassword = document.querySelector("#password");
let userEmail = document.querySelector("#email");
let userAddress = document.querySelector("#address");
let nameChangeButton = document.querySelector("#name-edit-btn");
let passwordChangeButton = document.querySelector("#password-change-btn");
let addressChangeButton = document.querySelector("#address-change-btn");
let saveButton = document.querySelector("#save-change-btn");
let favSectionButton = document.querySelector("#fav-section-btn");

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
});

passwordChangeButton.addEventListener("click", function () {
  userPassword.contentEditable = "true";
});

addressChangeButton.addEventListener("click", function () {
  userAddress.contentEditable = "true";
});

favSectionButton.addEventListener("click", function () {
  window.location.href = "/favourites";
});

saveButton.addEventListener("click", function () {
  userName.contentEditable = "false";
  userPassword.contentEditable = "false";
  userAddress.contentEditable = "false";
  newUserDetails = {
    newName: userName.innerHTML,
    newPassword: userPassword.innerHTML,
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
});
function displayUserInfo() {
  console.log("insideuserinfo");
  console.log(allUserData);
  console.log(currentUserMail);
  for (let i = 0; i < allUserData.length; i++) {
    if (allUserData[i].email == currentUserMail) {
      userName.innerHTML = allUserData[i].name;
      userPassword.innerHTML = allUserData[i].password;
      userEmail.innerHTML = allUserData[i].email;
      userAddress.innerHTML = allUserData[i].address;
    }
  }
}

function updateName() {
  userName.contentEditable = "true";
  saveButton.addEventListener("click");
}
