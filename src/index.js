console.log("Application Starting..");

// Register Service Worker, if available
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(app);

import {
  currentUser,
  initializeAuth,
  signUpWithEmailAndPassword,
  logOutUser,
  logInWithEmailAndPassword,
  googleLogin,
  loginWithPhoneNumber,
  updateAccount,
  verifyEmail,
} from "./auth.js";

// calling auth.js to initialize auth.js
const initializeAuthCallback = () => {
  if (currentUser) {
    console.log("onAuthStateChanged.initializeAuthCallback -> user logged in");
    setupUI(currentUser);
  } else {
    console.log("onAuthStateChanged.initializeAuthCallback -> user logged out");
    document.title = "Time-Sheet Management System";
    document.querySelector("#login-form-page").style.display = "block";
    document.querySelector("#manager-dashboard").style.display = "none";
    document.querySelector("#employee-dashboard").style.display = "none";
  }
};
initializeAuth(app, "recaptcha-container", initializeAuthCallback);

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // sign up the user
  signUpWithEmailAndPassword(email, password, signUpFormCallback);
});
const signUpFormCallback = () => {
  signupForm.reset();
};

// logout
const elogout = document.querySelector("#elogout");
elogout.addEventListener("click", (e) => {
  e.preventDefault();
  logOutUser();
});
const mlogout = document.querySelector("#mlogout");
mlogout.addEventListener("click", (e) => {
  e.preventDefault();
  logOutUser();
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // log the user in
  logInWithEmailAndPassword(email, password, loginFormCallback);
});
const loginFormCallback = () => {
  loginForm.reset();
};

// login with google
const googleLoginForm = document.querySelector("#login-google");
googleLoginForm.addEventListener("click", (e) => {
  e.preventDefault();
  googleLogin(loginFormCallback);
});

// login with phone number
const loginTelephoneForm = document.querySelector("#login-telephone-form");
loginTelephoneForm.addEventListener("submit", (e) => {
  e.preventDefault();

  loginTelephoneOTPForm.style.display = "none";
  // get user info
  const telephone = loginTelephoneForm["login-tel"].value;

  // log the user in
  loginWithPhoneNumber(telephone, loginTelephoneFormCallback);
});
const loginTelephoneFormCallback = () => {
  loginTelephoneOTPForm.style.display = "block";
};
// handling otp
const loginTelephoneOTPForm = document.querySelector("#login-otp-form");
loginTelephoneOTPForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const otp = loginTelephoneOTPForm["login-otp"].value;

  // Verifying the otp
  confirmationResult
    .confirm(otp)
    .then((result) => {
      console.log("loginTelephoneOTPForm.confirmationResult -> User signed in");
      console.log(result);
      // User signed in successfully.
      const user = result.user;
      console.log(user);
      // ...
      loginFormCallback();
    })
    .catch((error) => {
      console.log("loginTelephoneOTPForm.confirmationResult -> Error");
      console.log(err.message);
    });
});

//setting up the UI
const setupUI = (user) => {
  // DOM elements
  // const accountPhotoURL = document.querySelector("#account-photoURL");
  const loginFormPage = document.querySelector("#login-form-page");
  const mdashboard = document.querySelector("#manager-dashboard");
  const edashboard = document.querySelector("#employee-dashboard");
  const maccountGreetings = document.querySelector("#m-account-greetings");
  const eaccountGreetings = document.querySelector("#e-account-greetings");
  if (user.email == "admin@tsm.com") {
    const accountEmail = document.querySelector("#m-account-email");
    const accountPassword = document.querySelector("#m-account-password");
    const accountDisplayName = document.querySelector("#m-account-displayName");
    const accountPhotoURL = document.querySelector("#m-account-photoURL");
    const accountPhoneNumber = document.querySelector("#m-account-phoneNumber");
    document.title = "Manager Dashboard";
    loginFormPage.style.display = "none";
    mdashboard.style.display = "block";
    edashboard.style.display = "none";
    const greetings = user.displayName
      ? `<div><h4>Welcome ${user.displayName}</h4></div>`
      : `<div><h4>Welcome ${user.email} (No Name Provided)<h4></div>`;
    maccountGreetings.innerHTML = greetings;
    accountEmail.value = user.email;
    accountPassword.value = user.password;
    accountDisplayName.value = user.displayName;
    accountPhotoURL.value = user.photoURL;
    accountPhoneNumber.value = user.phoneNumber;
    // mobserve('timesheet', mcheckTimesheetData);
    fetchDirList(getdata);
  } else if (user) {
    createRef(user.uid);
    const accountEmail = document.querySelector("#e-account-email");
    const accountPassword = document.querySelector("#e-account-password");
    const accountDisplayName = document.querySelector("#e-account-displayName");
    const accountPhotoURL = document.querySelector("#e-account-photoURL");
    const accountPhoneNumber = document.querySelector("#e-account-phoneNumber");
    document.title = "Employee Dashboard";
    loginFormPage.style.display = "none";
    mdashboard.style.display = "none";
    edashboard.style.display = "block";
    const greetings = user.displayName
      ? `<div><h4>Welcome ${user.displayName}</h4></div>`
      : `<div><h4>Welcome ${user.email} (No Name Provided)<h4></div>`;
    eaccountGreetings.innerHTML = greetings;
    accountEmail.value = user.email;
    accountPassword.value = user.password;
    accountDisplayName.value = user.displayName;
    accountPhotoURL.value = user.photoURL;
    accountPhoneNumber.value = user.phoneNumber;
    // getTime Sheet Data
    observe("timesheet", currentUser.uid, eviewTimesheetData);
  }
};

// verify Email Employee
const everifyEmailAccount = document.querySelector("#e-account-verifyEmail");
everifyEmailAccount.addEventListener("click", (e) => {
  e.preventDefault();

  // update account information
  verifyEmail(ecloseAccountModal);
});

const ecloseAccountModal = () => {
  // close the signup modal & reset form
  document.querySelector("#e-modal-account").style.display = "none";
};

// verify Email Manager
const mverifyEmailAccount = document.querySelector("#m-account-verifyEmail");
mverifyEmailAccount.addEventListener("click", (e) => {
  e.preventDefault();

  // update account information
  verifyEmail(mcloseAccountModal);
});

const mcloseAccountModal = () => {
  // close the signup modal & reset form
  document.querySelector("#m-modal-account").style.display = "none";
};

// update Employee acc Form
const eupdateAccountForm = document.querySelector("#e-account-form");
eupdateAccountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const displayName = eupdateAccountForm["e-account-displayName"].value;
  const photoURL = eupdateAccountForm["e-account-photoURL"].value;
  const phoneNumber = eupdateAccountForm["e-account-phoneNumber"].value;
  const email = eupdateAccountForm["e-account-email"].value;
  // update account information
  updateAccount(
    {
      displayName: displayName,
      photoURL: photoURL,
      phoneNumber: phoneNumber,
      email: email,
    },
    ecloseAccountModal
  );
});

// update Manager acc Form
const mupdateAccountForm = document.querySelector("#m-account-form");
mupdateAccountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const displayName = mupdateAccountForm["m-account-displayName"].value;
  const photoURL = mupdateAccountForm["m-account-photoURL"].value;
  const phoneNumber = mupdateAccountForm["m-account-phoneNumber"].value;
  const email = mupdateAccountForm["m-account-email"].value;
  // update account information
  updateAccount(
    {
      displayName: displayName,
      photoURL: photoURL,
      phoneNumber: phoneNumber,
      email: email,
    },
    mcloseAccountModal
  );
});

// importing storage dependencies
import {
  initializeStorage,
  upload,
  fetchDirList,
  createRef,
  download,
  fetchImageList,
  getImageURI,
} from "./storage.js";

// initializing storage
initializeStorage(app);

async function pushNgetUrl(file, userId) {
  return await upload(file, userId);
}

import {
  initializeDatabase,
  write,
  read,
  observe,
  mobserve,
  modifyStatus,
  modify,
  erase,
} from "./firestoreDB";

//initialize db
initializeDatabase(app);

// Write to Firestore DB
const entryTimesheetForm = document.querySelector("#entry-timesheet-form");
entryTimesheetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  week.forEach(async (element) => {
    const filesInput = document.querySelector(`#${element}leave`);
    var file = filesInput.files[0];
    let leaveEmailUrl = "";
    if (file) {
      await pushNgetUrl(file, currentUser.uid).then((res) => {
        leaveEmailUrl = res;
      });
    }
    console.log(entryTimesheetForm[`${element}type`].value);
    const Data = {
      day: entryTimesheetForm[`${element}day`].value,
      date: entryTimesheetForm[`${element}date`].value,
      timeSheetType: entryTimesheetForm[`${element}type`].value,
      stime: entryTimesheetForm[`${element}stime`].value,
      ftime: entryTimesheetForm[`${element}ftime`].value,
      leaveEmail: leaveEmailUrl,
      description: entryTimesheetForm[`${element}description`].value,
      userId: currentUser.uid,
    };
    write(Data, "timesheet", currentUser);
  });
  entryTimesheetForm.reset();
  window.alert("firestoreDB.write -> Successfully added this week data");
});

function getdata(data) {
  data.forEach((dir) => {
    // console.log(dir);
    mobserve("timesheet", dir, mcheckTimesheetData);
  });

  console.log(data.length);
}

function eviewTimesheetData(data) {
  const viewTimesheetBody = document.querySelector("#v-tBody");
  if (data.length) {
    viewTimesheetBody.innerHTML = "";
    data.forEach((timesheet) => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const div1 = document.createElement("div");
      div1.innerText = timesheet.day;
      td1.appendChild(div1);
      const td2 = document.createElement("td");
      const div2 = document.createElement("div");
      div2.innerText = timesheet.date;
      td2.appendChild(div2);
      const td3 = document.createElement("td");
      const div3 = document.createElement("div");
      div3.innerText = timesheet.timeSheetType;
      td3.appendChild(div3);
      const td4 = document.createElement("td");
      const div4 = document.createElement("div");
      div4.innerText = timesheet.status;
      switch (timesheet.status) {
        case "Inprocess":
          div4.style.backgroundColor = "blue";
          break;
        case "Approve":
          div4.style.backgroundColor = "lightgreen";
          break;
        case "Reject":
          div4.style.backgroundColor = "red";
          break;
      }
      td4.appendChild(div4);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      viewTimesheetBody.appendChild(tr);
    });
  }
}

function mcheckTimesheetData(data) {
  const checkTimesheetBody = document.querySelector("#entry-check-tBody");
  if (data.length) {
    // checkTimesheetBody.innerHTML = "";
    data.forEach((timesheet) => {
      const tr = document.createElement("tr");
      const td0 = document.createElement("td");
      const div0 = document.createElement("div");
      div0.innerText =
        timesheet.email != "" ? timesheet.email : timesheet.displayName;
      td0.appendChild(div0);
      const td1 = document.createElement("td");
      const div1 = document.createElement("div");
      div1.innerText = timesheet.day;
      td1.appendChild(div1);
      const td2 = document.createElement("td");
      const div2 = document.createElement("div");
      div2.innerText = timesheet.date;
      td2.appendChild(div2);
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const div4 = document.createElement("div");
      if (timesheet.leaveEmail != "") {
        const a = document.createElement("a");
        a.setAttribute("href", timesheet.leaveEmail);
        a.setAttribute("target", "__blank");
        a.innerText = "view";
        td3.appendChild(a);
      } else {
        div4.innerText = `${timesheet.ftime} - ${timesheet.stime}`;
      }
      td4.appendChild(div4);
      const td5 = document.createElement("td");
      const div5 = document.createElement("div");
      div5.innerText = timesheet.description;
      td5.appendChild(div5);

      const td6 = document.createElement("td");

      switch (timesheet.status) {
        case "Inprocess":
          const rejectButton = document.createElement("button");
          rejectButton.style.backgroundColor = "red";
          rejectButton.textContent = "Reject";
          rejectButton.addEventListener("click", (e) => {
            rejectTimesheet(timesheet);
          });
          const acceptButton = document.createElement("button");
          acceptButton.style.backgroundColor = "lightgreen";
          acceptButton.textContent = "Accept";
          acceptButton.addEventListener("click", (e) => {
            acceptTimesheet(timesheet);
          });
          td6.appendChild(rejectButton);
          td6.appendChild(acceptButton);
          // div5.style.backgroundColor = "blue";
          break;
        case "Approve":
          const adiv6 = document.createElement("div");
          adiv6.innerText = "Approved";
          adiv6.style.backgroundColor = "lightgreen";
          td6.appendChild(adiv6);
          break;
        case "Reject":
          const rdiv6 = document.createElement("div");
          rdiv6.innerText = "Rejected";
          rdiv6.style.backgroundColor = "red";
          td6.appendChild(rdiv6);
          break;
      }
      // td4.appendChild(div4);
      tr.appendChild(td0);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      checkTimesheetBody.appendChild(tr);
    });
  }
}

// Reject timesheet
const rejectTimesheet = (timesheet) => {
  modifyStatus(timesheet, "Reject", "timesheet", mcheckTimesheetData);
};

// Accept Timesheet
const acceptTimesheet = (timesheet) => {
  modifyStatus(timesheet, "Approve", "timesheet", mcheckTimesheetData);
};
