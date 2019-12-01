import installButtons from "./render-login.js"

const $navbar = $(".navbar");
const $footer = $(".footer");

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
      </div>
    </div>
  </div>
  `;

  return navbar;
}

function renderFooter() {
  let footer = `
  <div class="content has-text-centered">
    Created by Cyanea Capillata from UNC COMP 426.
  </div>
  `;

  return footer;
}

$(function() {
  $navbar.append(renderNavbar());
  $footer.append(renderFooter());
  installButtons();
});