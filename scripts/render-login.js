import config from "../config.js";
import Lobby from "./lobbies.js"
import { installLobbyButton } from "./lobbies.js";

let url = config.url;

function createDefaultLobbies() {
  axios.post( url + "/public/Lobbies/", {
    data: {
        Default : new Lobby("Default"),
        Beginner : new Lobby("Beginners"),
        Average : new Lobby("Average"),
        Expert : new Lobby("Experts"),
    }
  })
  .catch(error => {
    console.log(error.response)
  });
} 

createDefaultLobbies();

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
 * @param {string} mode
 */
function installPromptButtonHandlers(mode) {
  if (mode == "Login") {
    // Log in event handler
    $("#submit-user-action").on("click", async function() {
      // Get user credentials
      let username = $("#username").val();
      let password = $("#password").val();

      // Log user in with provided credentials
      logUserIn(username, password);
    });
  } else if (mode == "Sign Up") {
    // Sign up event handler
    $("#submit-user-action").on("click", async function() {
      // Get user credentials
      let username = $("#username").val();
      let password = $("#password").val();

      // Sign user up with provided credentials
      signUserUp(username, password)
        .then(response => {
          console.log("Signed up successfully!");

          // Log user in for the first time after signing them up
          logUserInFirstTime(username, password);
        })
        .catch(error => {
          $("#uap-header").html(`
                    <span class="has-text-danger">Sign-up failed! Try again!</span>
                `);
        });
    });
  }

  // Removes the log in prompt if user clicks cancel/close
  $("#cancel-user-action").on("click", function() {
    $("#user-action-prompt-background").remove();
  });
}

/**
 * Creates a prompt for the login and signup popup
 * @param {string} mode
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

/**
 * Creates a default user profile
 */
async function createUserProfile(displayName) {
  await axios({
    method: "post",
    url: url + "/user/profile/",
    headers: { Authorization: "Bearer " + localStorage.jwt },
    data: {
      data: {
        "Display Name": displayName,
        "Games Played": 0,
        "Average WPM": 0,
        "Highest WPM": 0
      }
    }
  }).then(response => {
    console.log(response);
  }).catch(error => {
    console.log(error.response);
  });
}

/**
 * Creates default settings for a user.
 */
async function createUserSettings() {
  await axios({
    method: "post",
    url: url + "/user/settings/",
    headers: {
      Authorization: "Bearer " + localStorage.jwt
    },
    data: {
      data: {
        "Typing Duration": {
          value: 1,
          options: [1, 3, 5]
        },
        "Text Difficulty": {
          value: "Easy",
          options: ["Easy", "Medium", "Hard"]
        },
        "Text Length": {
          value: "Medium",
          options: ["Short", "Medium"]
        }
      }
    }
  });
}

/**
 * Logs user in using an axios post call.
 * @param {string} username
 * @param {string} password
 */
async function logUserIn(username, password) {
  await axios({
    method: "post",
    url: url + "/account/login",
    data: {
      name: username,
      pass: password
    }
  }).then(response => {
    // After logging in successfully, set the jwt (local log in cache) values
    window.localStorage.setItem("jwt", response.data["jwt"]);
    window.localStorage.setItem("typing-username", response.data["name"]);

    // Reload to show the user is logged in
    location.reload();
  })
  .catch(error => {
    // If the user enters invalid credentials, display a message
    console.log(error);
    $("#uap-header").html(`
              <span class="has-text-danger">Login failed! Try again!</span>
          `);
  });
}

/**
 * Logs user in for the very first time, this is different from a regular log in because it initializes the user's profile.
 * @param {string} username 
 * @param {string} password 
 */
async function logUserInFirstTime(username, password) {
  await axios({
    method: "post",
    url: url + "/account/login",
    data: {
      name: username,
      pass: password
    }
  }).then(response => {
    // After logging in successfully, set the jwt (local log in cache) values
    window.localStorage.setItem("jwt", response.data["jwt"]);
    window.localStorage.setItem("typing-username", response.data["name"]);

    // Creating the user's default profile & settings when they first log in
    createUserProfile(username);
    createUserSettings();

    // Reload to show the user is logged in
    location.reload();
  }).catch(error => {
    console.log(error.response);
  });
}

/**
 * Signs user up using an axios post call.
 * @param {string} username
 * @param {string} password
 */
async function signUserUp(username, password) {
  return await axios({
    method: "post",
    url: url + "/account/create",
    data: {
      name: username,
      pass: password
    }
  });
}

export default function installButtonsNotLoggedIn() {
  installLoginButton();
  installSignupButton();
}
