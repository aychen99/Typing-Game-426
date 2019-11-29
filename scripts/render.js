import loadTypingGame from './game-logic.js';

const $root = $("#typing-section");

function setupView() {
  $root.append(renderTypingSectionHeader());
  $root.append(renderTypingSectionTextContainer());
  $root.append(renderTypingSectionInputBox());
  $root.append(renderTypingSectionTimer());
  $("#typing-section-text-container").append(renderTextToType());

  loadTypingGame();
}

function renderTypingSectionHeader() {
  let typingSectionHeader = `
    <div class="container" id="typing-section-header">
      <h3 class="title is-3 is-centered">WELCOME TO BLAZE TYPING 426</h3>
      <h5 class="subtitle is-5 is-centered" id="home-prompt">Type the following text:</h5>
    </div>
  `;

  return typingSectionHeader;
}

function renderTypingSectionTextContainer() {
  return `
    <div class="container" id="typing-section-text-container">
    </div>
  `;
}

function renderTypingSectionInputBox() {
  return `
    <div class="field">
      <div class="control">
        <input 
          class="input is-primary" 
          type="text" 
          placeholder="When ready, type in here to begin!"
          spellcheck="false"
          id="user-input"></input>
      </div>
    </div>
  `;

  // TODO: Make input box larger and able to scroll down, rather than sideways,
  // as we type new lines in
}

function renderTextToType() {
  return `
    <div id="text-to-type">
    </div>
  `;
}

function renderTypingSectionTimer() {
  return `
    <p 
    class="is-centered 
      has-background-info 
      has-text-white 
      has-text-weight-bold" 
    id="timer"><b>Time Elapsed: 0:00</b></p>
  `;
}

function renderTypingStats() {
  
}

$(function() {
  setupView();
});