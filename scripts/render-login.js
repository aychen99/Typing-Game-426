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

async function createDefaultLobbies() {
  let defaultLobby = new Lobby("Default");
  lobbies.push(defaultLobby);

  try {
    axios.post( url + "/public/Lobbies", {
      data: {
          name: lobbies[0].name,
          pass: lobbies[0].passcode,
          users: lobbies[0].users,
          hasPasscode: lobbies[0].hasPasscode,
      }
    })
    .then(response => { 
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

function installLobbyButton() {
  $('#lobby-button').on('click', async function () {
    async function getUserSettings() {
      try {
        let result = await axios({
          method: 'get',
          url: url + '/user/settings',
          headers: { 'Authorization': 'Bearer ' + localStorage.jwt },
        });
        return result.data.result;
      }
      catch (e) {
        // If user does not have settings configured,
        // configure it first
        await axios({
          method: 'post',
          url: url + '/user/settings/',
          headers: { 'Authorization': 'Bearer ' + localStorage.jwt },
          data: {
            data: {
              games_played: '0',
              wpm: '0',
              theme: 'dark'
            }
          }
        });
        let result = await axios({
          method: 'get',
          url: url + '/user/settings',
          headers: { 'Authorization': 'Bearer ' + localStorage.jwt },
        });
        return result.data.result;
      }

    }

    try {
      let settings = await getUserSettings();

      $('body').append(`
                <div class="prompt-background" id="settings-prompt-background">
                    <div class="menu-prompt">
                        <p class="has-text-centered is-size-3">
                            Settings for <span class="has-text-info">${localStorage['typing-username']}</span>:
                        </p>
                        <br>
                        <div>
                            <span class="has-text-weight-bold">Games Played: </span>
                            <span class="has-text-gray">${settings['games_played']}</span>
                        </div>
                        <div>
                            <span class="has-text-weight-bold">Words Per Minute: </span>
                            <span class="has-text-gray">${settings['wpm']}</span>
                        </div>
                        <div>
                            <span class="has-text-weight-bold">Theme: </span>
                            <span class="has-text-gray">${settings['theme']}</span>
                        </div>

                        <br>
                        <button class="button is-warning" id="close-prompt">Close</button>
                    </div>
                </div>
            `);
      $('#close-prompt').on('click', function () {
        $('#settings-prompt-background').remove();
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
