import loadTypingGame from './game-logic.js';

/***
 * This file is used to render elements on the home page.
 ***/

const $root = $("#typing-section");

function setupView() {
  $root.append(renderTypingSectionHeader());
  $root.append(renderTypingSectionTextContainer());
  $root.append(renderTypingSectionInputBox());
  $root.append(renderTypingSectionTimer());
  $root.append(renderTypingStats());
  $("#typing-section-text-container").append(renderTextToType());

  loadTypingGame();
}

/**
 * Renders the title of the typing section.
 */
function renderTypingSectionHeader() {
  let typingSectionHeader = `
    <div class="container" id="typing-section-header">
      <h3
      class="
        title
        is-3
        is-centered
        dark-mode-title">
        WELCOME TO BLAZE TYPING 426
      </h3>
      <h5 class="subtitle is-5 is-centered dark-mode-subtitle" id="home-prompt">Type the following text:</h5>
    </div>
  `;

  return typingSectionHeader;
}

/**
 * Renders a box that contains the text for the user to type.
 */
function renderTypingSectionTextContainer() {
  return `
    <div class="container dark-mode-box" id="typing-section-text-container">
    </div>
  `;
}

/**
 * Renders an input field where the user can start the typing test.
 */
function renderTypingSectionInputBox() {
  return `
    <div class="field">
      <div class="control">
        <textarea 
          class="input is-primary"  
          placeholder="When ready, type in here to begin!"
          spellcheck="false"
          id="user-input"></textarea>
      </div>
    </div>
  `;

  // TODO: Make input box larger and able to scroll down, rather than sideways,
  // as we type new lines in
}

/**
 * Renders the text that the user will type for the typing test.
 */
function renderTextToType() {
  return `
    <div class="dark-mode-text" id="text-to-type">
    </div>
  `;
}

/**
 * Renders the countdown timer of the typing test.
 */
function renderTypingSectionTimer() {
  return `
    <p 
    class="is-centered 
      has-background-info 
      has-text-white 
      has-text-weight-bold" 
    id="timer">Time Elapsed: 0:00</p>
  `;
}

function renderTypingStats() {
  return `
    <div id="typing-stats-section">
      <p 
        class="has-background-success 
                has-text-white 
                has-text-weight-bold">
      Raw WPM: <span id="stats-wpm">0</span>
      </p>
      <p
        class="has-background-success 
                has-text-white 
                has-text-weight-bold">
      Errors: <span id="stats-errors">0</span>
      </p>
    </div>
  `;
}

$(function() {
  setupView();
});