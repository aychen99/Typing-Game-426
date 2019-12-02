import config from "../config.js";

let url = config.url;

/**
 * Adds event listener to login button
 */
function installLoginButton() {
  $("#login-button").on("click", function() {
    createUserActionPrompt("Login");
  });
}

/**
 * Adds event listener to signup button
 */
function installSignupButton() {
  $("#signup-button").on("click", function() {
    createUserActionPrompt("Sign Up");
  });
}

/**
 * Adds event handlers to login and signup buttons
 * @param {*} mode 
 */
function installPromptButtonHandlers(mode) {
  if (mode == "Login") {
    $("#submit-user-action").on("click", async function() {
      try {
        let result = await axios({
          method: "post",
          url: url + "/account/login",
          data: {
            name: $("#username").val(),
            pass: $("#password").val()
          }
        });
        location.reload();
      } catch {
        $("#uap-header").html(`
                    <span class="has-text-danger">Login failed! Try again!</span>
                `);
      }
    });
  } else if (mode == "Sign Up") {
    $("#submit-user-action").on("click", async function() {
      try {
        let result = await axios({
          method: "post",
          url: url + "/account/create",
          data: {
            name: $("#username").val(),
            pass: $("#password").val()
          }
        });
        $("#user-action-prmot-background").remove();
      } catch {
        $("#uap-header").html(`
                    <span class="has-text-danger">Sign-up failed! Try again!</span>
                `);
      }
    });
  }

  $("#cancel-user-action").on("click", function() {
    $("#user-action-prompt-background").remove();
  });
}

/**
 * Creates a prompt for the login and signup popup
 * @param {*} mode 
 */
function createUserActionPrompt(mode) {
  let $prompt = $(`
        <div class="prompt-background" id="user-action-prompt-background">
            <div class="user-prompt">
                <p class="has-text-centered is-size-4" id="uap-header">
                    ${mode} here!
                </p>
                <div class="field">
                    <label class="label has-text-link">Username:</label>
                    <div class="control">
                        <input class="input" 
                                type="text" 
                                placeholder="Username"
                                name="username"
                                id="username">
                    </div>
                </div>
                <div class="field">
                    <label class="label has-text-link">Password:</label>
                    <div class="control">
                        <input class="input" 
                                type="password" 
                                placeholder="Password"
                                name="password"
                                id="password">
                    </div>
                </div>
                <br>
                <button class="button is-success" id="submit-user-action">${mode}</button>
                <button class="button is-warning" id="cancel-user-action">Cancel</button>
            </div>
        </div>
    `);
  $("body").append($prompt);
  installPromptButtonHandlers(mode);
}

export default function installButtons() {
  installLoginButton();
  installSignupButton();
}
