import installButtonsNotLoggedIn from "./render-login.js";
import installButtonsLoggedIn from "./render-logged-in.js";
import installLeaderboardsButton from "./leaderboards.js";

/***
 * This file is used to render elements that will be the same for EVERY page. E.g.) Navbars and footers are the same on every page, so they are defined here.
 ***/

// HTML classes
const $navbar = $(".navbar");
const $footer = $(".footer");

// Theme state, default is dark
let isDark = true;

function renderNavbar() {
  let buttonDivHTML = getButtonsHTML();

  let navbar = `
  <div class="container navbar-container">
    <div class="navbar-brand">
      <a class="navbar-item" id="navbar-brand" href="/">
        Blaze Typing
      </a>
    </div>

    <div class="navbar-menu is-active">
      <div class="navbar-end">
        <a class="navbar-item" href="#" id="lobby-button">Lobby</a>
        <a class="navbar-item" href="#" id="leaderboards-button">Leaderboards</a>

        ${buttonDivHTML}
      </div>
    </div>
  </div>
  `;

  return navbar;
}

function getButtonsHTML() {
  if (localStorage.jwt || localStorage.isGoogle) {
    // User is logged in
    return `<div class="buttons">
      <a class="button is-primary is-outlined" id="logout-button">Logout</a>
      <a class="button is-primary" id="profile-button">Profile</a>
      <a class="button is-primary" id="theme-button">Dark/Light Mode</a>
    </div>`;
  } else {
    // User is not logged in
    return `<div class="buttons">
      <a class="button is-primary is-outlined" id="login-button">Login</a>
      <a class="button is-primary" id="signup-button">Signup</a>
      <a class="button is-primary" id="theme-button">Dark/Light Mode</a>
    </div>`;
  }
}

function renderFooter() {
  let footer = `
  <div class="content has-text-centered dark-mode-text">
    Created by Cyanea Capillata from UNC COMP 426.
  </div>
  `;

  return footer;
}

function toLightMode() {
  // Body
  $(".dark-mode-body").addClass("light-mode-body");
  $(".dark-mode-body").removeClass("dark-mode-body");

  // Titles & texts
  $(".dark-mode-title").addClass("light-mode-title");
  $(".dark-mode-title").removeClass("dark-mode-title");

  $(".dark-mode-subtitle").addClass("light-mode-subtitle");
  $(".dark-mode-subtitle").removeClass("dark-mode-subtitle");

  $(".dark-mode-text").addClass("light-mode-text");
  $(".dark-mode-text").removeClass("dark-mode-text");

  // Boxes
  $(".dark-mode-box").addClass("light-mode-box");
  $(".dark-mode-box").removeClass("dark-mode-box");

  // Navbar
  $(".navbar").addClass("is-light");
  $(".navbar").removeClass("is-black");

  // Footer
  $(".footer").addClass("light-mode-footer");
  $(".footer").removeClass("dark-mode-footer");
}

function toDarkMode() {
  // Body
  $(".light-mode-body").addClass("dark-mode-body");
  $(".light-mode-body").removeClass("light-mode-body");

  // Titles & texts
  $(".light-mode-title").addClass("dark-mode-title");
  $(".light-mode-title").removeClass("light-mode-title");

  $(".light-mode-subtitle").addClass("dark-mode-subtitle");
  $(".light-mode-subtitle").removeClass("light-mode-subtitle");

  $(".light-mode-text").addClass("dark-mode-text");
  $(".light-mode-text").removeClass("light-mode-text");

  // Boxes
  $(".light-mode-box").addClass("dark-mode-box");
  $(".light-mode-box").removeClass("light-mode-box");

  // Navbar
  $(".navbar").addClass("is-black");
  $(".navbar").removeClass("is-light");

  // Footer
  $(".footer").addClass("dark-mode-footer");
  $(".footer").removeClass("light-mode-footer");
}

/**
 * Toggles between light and dark mode when the toggle button is pressed
 * @param {*} e 
 */
function handleThemeButtonPress(e) {
  if (isDark) {
    toLightMode();
  } else {
    toDarkMode();
  }

  isDark = !isDark;
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

/**
 * After the page finishes loading, renders everything and sets up event listeners
 */
$(function() {
  $navbar.append(renderNavbar());
  $footer.append(renderFooter());

  // Add event listeners
  $("#theme-button").on("click", handleThemeButtonPress);

  // console.log(localStorage.isGoogle);

  // Change button event handlers based on if user is logged in or not
  if (localStorage.jwt != undefined || localStorage.isGoogle != undefined) {
    installButtonsLoggedIn();
  } else {
    installButtonsNotLoggedIn();
  }

  installLeaderboardsButton();
});