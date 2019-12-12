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
 * Adds event listener to login button.
 */
function installLoginButton() {
  $("#login-button").on("click", function() {
    createUserActionPrompt("login");
  });
}

/**
 * Adds event listener to signup button.
 */
function installSignupButton() {
  $("#signup-button").on("click", function() {
    createUserActionPrompt("signup");
  });
}

/**
 * Adds event handlers to login and signup buttons.
 * @param {string} mode Whether it is "login" or "signup".
 */
function installPromptButtonHandlers(mode) {
  if (mode == "login") {
    // Log in event handler
    $("#submit-" + mode + "-action").on("click", async function() {
      // Get user credentials
      let username = $("#login-username").val();
      let password = $("#login-password").val();

      // Log user in with provided credentials
      logUserIn(username, password);
    });
  } else if (mode == "signup") {
    // Sign up event handler
    $("#submit-" + mode + "-action").on("click", async function() {
      console.log("CLICK")
      // Get user credentials
      let username = $("#signup-username").val();
      let password = $("#signup-password").val();

      // Sign user up with provided credentials
      signUserUp(username, password)
        .then(response => {
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

  // Removes the login/signup prompt if user clicks cancel/close
  $("#cancel-" + mode + "-action").on("click", function() {
    $("#" + mode + "-prompt-bg").addClass("is-hidden");
  });
}

/**
 * Creates a prompt for the login and signup popup.
 * @param {string} mode Whether it is "login" or "signup".
 */
function createUserActionPrompt(mode) {
  // Shows the prompt of the appropriate mode
  if (mode == "login") {
    $("#login-prompt-bg").removeClass("is-hidden");
  } else if (mode == "signup") {
    $("#signup-prompt-bg").removeClass("is-hidden");
  }
  
  // Renders the login/signup and cancel buttons
  installPromptButtonHandlers(mode);
}

/**
 * Creates a default user profile.
 */
async function createUserProfile(displayName) {
  await axios({
    method: "post",
    url: url + "/user/profile/",
    headers: { Authorization: "Bearer " + localStorage.jwt },
    data: {
      data: {
        // "Display Name": displayName,
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

async function initializeUserOnLeaderboard() {
  await axios({
    method: "post",
    url: url + "/public/leaderboards/" + localStorage['typing-username'],
    headers: {
      Authorization: "Bearer " + localStorage.jwt
    },
    data: {
      data: {
        "Games Played": 0,
        "Average WPM": 0,
        "Highest WPM": 0
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
  }).then(async response => {
    // After logging in successfully, set the jwt (local log in cache) values
    window.localStorage.setItem("jwt", response.data["jwt"]);
    window.localStorage.setItem("typing-username", response.data["name"]);

    // Creating the user's default profile & settings when they first log in
    await addUserToDatabase(username);
    await createUserProfile(username);
    await createUserSettings();

    // TODO: TEMP HACK: Initialize user's position in the leaderboards
    // on first log in
    await initializeUserOnLeaderboard();

    // Reload to show the user is logged in
    location.reload();
  }).catch(error => {
    console.log(error.response);
  });
}

/**
 * Adds a user to the public database.
 * @param {string} username 
 */
async function addUserToDatabase(username) {
  return axios.post(url + "/public/allUsers/usernames",
    {
      data: [username],
      type: "merge"
    }
  )
}

/**
 * Returns a string array of all usernames.
 */
async function getAllUsersFromDatabase() {
  return await axios({
    method: "get",
    url: url + "/public/allUsers/usernames"
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
  installLobbyButton();
}
