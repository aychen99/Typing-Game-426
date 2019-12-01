import installButtons from "./render-login.js"

const $navbar = $(".navbar");
const $footer = $(".footer");

// Theme state
let isDark = true

function renderNavbar() {
  let navbar = `
  <div class="container navbar-container">
    <div class="navbar-brand">
      <a class="navbar-item" id="navbar-brand" href="#">
        Blaze Typing
      </a>
    </div>

    <div class="navbar-menu is-active">
      <div class="navbar-end">
        <a class="navbar-item" href="#">Lobby</a>
        <a class="navbar-item" href="#">Leaderboards</a>
        <a class="navbar-item" href="#">Profile</a>

        <div class="buttons">
          <a class="button is-primary is-outlined" id="login-button">Login</a>
          <a class="button is-primary" id="signup-button">Signup</a>
          <a class="button is-primary" id="theme-button">Dark/Light Mode</a>
        </div>
      </div>
    </div>
  </div>
  `;

  return navbar;
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
  $(".dark-mode-body").addClass("light-mode-body")
  $(".dark-mode-body").removeClass("dark-mode-body")

  // Titles & texts
  $(".dark-mode-title").addClass("light-mode-title")
  $(".dark-mode-title").removeClass("dark-mode-title")

  $(".dark-mode-subtitle").addClass("light-mode-subtitle")
  $(".dark-mode-subtitle").removeClass("dark-mode-subtitle")

  $(".dark-mode-text").addClass("light-mode-text")
  $(".dark-mode-text").removeClass("dark-mode-text")

  // Boxes
  $(".dark-mode-box").addClass("light-mode-box")
  $(".dark-mode-box").removeClass("dark-mode-box")

  // Navbar
  $(".navbar").addClass("is-light")
  $(".navbar").removeClass("is-black")

  // Footer
  $(".footer").addClass("light-mode-footer")
  $(".footer").removeClass("dark-mode-footer")
}

function toDarkMode() {
  // Body
  $(".light-mode-body").addClass("dark-mode-body")
  $(".light-mode-body").removeClass("light-mode-body")

  // Titles & texts
  $(".light-mode-title").addClass("dark-mode-title")
  $(".light-mode-title").removeClass("light-mode-title")

  $(".light-mode-subtitle").addClass("dark-mode-subtitle")
  $(".light-mode-subtitle").removeClass("light-mode-subtitle")

  $(".light-mode-text").addClass("dark-mode-text")
  $(".light-mode-text").removeClass("light-mode-text")

  // Boxes
  $(".light-mode-box").addClass("dark-mode-box")
  $(".light-mode-box").removeClass("light-mode-box")

  // Navbar
  $(".navbar").addClass("is-black")
  $(".navbar").removeClass("is-light")

  // Footer
  $(".footer").addClass("dark-mode-footer")
  $(".footer").removeClass("light-mode-footer")
}

function handleThemeButtonPress(e) {
  if (isDark) {
    toLightMode()
  } else {
    toDarkMode()
  }

  isDark = !isDark
}

$(function() {
  $navbar.append(renderNavbar());
  $footer.append(renderFooter());

  // Add event listeners
  $("#theme-button").on("click", handleThemeButtonPress)

  installButtons();
});