import config from "../config.js";
import Lobby from "../scripts/lobbies.js"


let url = config.url;

let lobbies = [];

/**
 * Adds event listener to login button
 */
function installLoginButton() {
  $("#login-button").on("click", function () {
    createUserActionPrompt("Login");
  });
}

/**
 * Adds event listener to signup button
 */
function installSignupButton() {
  $("#signup-button").on("click", function () {
    createUserActionPrompt("Sign Up");
  });
}

function installLobbyButton() {
  $("#lobby-button").on("click", function () {
    createLobbyList();
  })
}

async function createDefaultLobbies() {
  let defaultLobby = new Lobby("Default");
  lobbies.push(defaultLobby);

  try {
    axios.post( url + "/public/Lobbies/", {
      data: {
          name: lobbies[0].name,
          pass: lobbies[0].passcode,
          users: lobbies[0].users,
          hasPasscode: lobbies[0].hasPasscode,
      }
    })
    .then(response => { 
      console.log(lobbies[0].name);
      console.log(response)
    })
    .catch(error => {
        console.log(error.response)
    });
    // let result = await axios({
    //   method: "post",
    //   url: url + "/public/Lobbies",
    //   data: {
    //     name: lobbies[0].name,
    //     pass: lobbies[0].passcode,
    //     users: lobbies[0].users,
    //     hasPasscode: lobbies[0].hasPasscode,
    //   }
    // });
    //window.localStorage.setItem('jwt', result.data['jwt']);
    //window.localStorage.setItem('Default Lobby Name', result.data['name']);
    //location.reload();
  } catch {
    $("#uap-header").html(`
                <span class="has-text-danger">Login failed! Try again!</span>
            `);
  }
}//);
//}

/**
 * Adds event handlers to login and signup buttons
 * @param {*} mode 
 */
function installPromptButtonHandlers(mode) {
  if (mode == "Login") {
    $("#submit-user-action").on("click", async function () {
      try {
        let result = await axios({
          method: "post",
          url: url + "/account/login",
          data: {
            name: $("#username").val(),
            pass: $("#password").val()
          }
        });
        window.localStorage.setItem('jwt', result.data['jwt']);
        window.localStorage.setItem('typing-username', result.data['name']);
        location.reload();
      } catch {
        $("#uap-header").html(`
                    <span class="has-text-danger">Login failed! Try again!</span>
                `);
      }
    });
  } else if (mode == "Sign Up") {
    $("#submit-user-action").on("click", async function () {
      try {
        let result = await axios({
          method: "post",
          url: url + "/account/create",
          data: {
            name: $("#username").val(),
            pass: $("#password").val()
          }
        });
        $("#user-action-prompt-background").find('.field').remove();
        $('#uap-header').html('Signup successful! Please close this '
          + 'panel and log in!');
        $('#submit-user-action').remove();
        $('#cancel-user-action').html('Close');
      } catch {
        $("#uap-header").html(`
                    <span class="has-text-danger">Sign-up failed! Try again!</span>
                `);
      }
    });
  }

  $("#cancel-user-action").on("click", function () {
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

function createLobbyList() {
  $('#lobby-button').on('click', async function () {
    async function getLobbies() {
      try {
        let result = await axios({
          method: 'get',
          url: url + '/public/Lobbies',
        });
        console.log(result.data);
        console.log("GAYYYYYYY");
        return result.data;
      }
      catch (e) {
        // If user does not have settings configured,
        // configure it first
        return e;
      }

    }

    try {
      let lobbies = await getLobbies();
      console.log(lobbies.result.name);
      $('body').append(`
                <div class="prompt-background" id="lobbies-prompt-background">
                    <div class="menu-prompt">
                        <p class="has-text-centered is-size-3">
                            Lobbies:
                        </p>
                        <br>

                        <div>
                            <span class="has-text-gray">${lobbies.result.name}</span>
                        </div>
                        
                        <br>
                        <button class="button is-warning" id="close-prompt">Close</button>
                    </div>
                </div>
            `);
      $('#close-prompt').on('click', function () {
        $('#lobbies-prompt-background').remove();
      });
    } catch {
      $('body').append(`
                <div class="prompt-background" id="error-prompt-background">
                    <div class="user-prompt">
                        <p class="has-text-centered is-size-4" id="uap-header">
                            Uh oh! Looks like an error occurred. Please try logging 
                            out and logging back in!
                        </p>
                        <br>
                        <button class="button is-warning" id="close-prompt">Close</button>
                    </div>
                </div>
            `);
      $('#close-prompt').on('click', function () {
        $('#error-prompt-background').remove();
      });
    }
  });
}

export default function installButtonsNotLoggedIn() {
  createDefaultLobbies();
  installLoginButton();
  installSignupButton();
  installLobbyButton();
}
