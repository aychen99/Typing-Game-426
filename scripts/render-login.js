import config from "../config.js";
import Lobby from "./lobbies.js"
import { installLobbyButton } from "./lobbies.js";

let url = config.url;

// TEMP STOPGAP SOLUTION TO WRITING SERVER-SIDE INITIALIZATION CODE
// ONLY RUN THIS ONCE WHEN DEPLOYING
function createDefaultLobbies() {
  let defaultLobby = new Lobby("Default");
  let beginnerLobby = new Lobby("Beginner");
  let averageLobby = new Lobby("Average");
  let expertLobby = new Lobby("Expert");

  defaultLobby.text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
    nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse 
    cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, 
    sunt in culpa qui officia deserunt mollit anim id est laborum.        
    Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. 
    Nullam varius, turpis et commodo pharetra, est eros bibendum elit, 
    nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh 
    euismod gravida. 
    Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. 
    Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod 
    turpis, 
    id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. 
    Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, 
    aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, 
    elit ut dictum aliquet, felis nisl adipiscing sapien, 
    sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam 
    arcu. 
    Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, 
    pretium ac, nisi. 
    Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac 
    habitasse platea dictumst.`;

  beginnerLobby.text = `hi there i am inspired by ten fast fingers where
    they typed many words that sometimes do not make that much sense but
    you can still practice typing using this without periods or commas or 
    numers so it will be easier on you one day you will also be a very fast 
    typer like me because you practiced so much that you got very good at it 
    but for now just keep on typing and typing these as it is always good to 
    practice before you leap or to look before you leap for that matter since 
    there are many things that you must do before leaping in fact you should 
    look before you type but not at your fingers on the keyboard but rather at 
    the screen on the words that appear so that soon you can do touch typing 
    where you view the screen but do not look at your digits to zip your way 
    through everything there is and to spice it up a tiny bit i will
    throw in a xylophone zebra question just for your benefit congrats you 
    have finished 
  `;

  averageLobby.text = `Lions are a major symbol of wild Africa. They have 
    been worshipped by African tribes for their strength and beauty. 
    Lions are the only big cats that live in large groups. Also, they 
    have the loudest roar of any cat, which can be heard for up to five 
    miles!
  
    Lions have tawny, or yellowish brown, fur. They grow 
    to a length of about 10 feet and stand about 4 feet 
    tall. Male lions are larger than the lionesses (females), 
    weighing as much as five men or about 550 pounds. The 
    more slender lioness usually weighs about as much as 400 points.

    Adult males can be recognized by the furry mane that runs around the 
    heads and down the neck. For some lions the mane even runs along the 
    belly. There is no other big cat with such a dramatic difference in 
    appearance between males and females.

    Both lions and lionesses have tufts on the end of their tails, 
    something no other cat has. If you could touch a male lion's tail, 
    you would feel a sharp bone tucked into the tail tuft. One old legend 
    claims that lions would use the tail spur to whip themselves into a 
    frenzy before fighting.
    
    Source: Wikibooks, Wikijunior, Big Cats, Lion`;

  expertLobby.text = `
    Become one with the randomness. Good luck, bud.

    Hamilton's real quaternions H and biquaternions B are constructed from 
    pairs of division binarions or complex binarions, respectively. 
    These operations are defined:

    Multiplication: (w,x)(y,z) = (wy-xz^{*}, wz+xy^{*}), 
    Conjugation: (w,x)^{*} = (w^{*},-x), 
    so that N(w,x) = (w,x) (w^{*},-x^{*}) = ww^{*} + 
    xx^{*} = N(w)+N(x).}
    A third quaternion algebra Q = split quaternions is a variant of H and 
    a subalgebra of B; it has other derivations.

    H and B were both described by W. R. Hamilton in his Lectures 
    on Quaternions (1853). AC algebra Q was described by James 
    Cockle and called coquaternions. For a time H, B, and Q had 
    special profiles in their use as AC algebra, but matrix rings 
    were exploited in the twentieth century to provide linear 
    representations for them, and thus absorb them into the larger 
    study of linear algebra. Indeed, Q is ring isomorphic to M(2,R), the 2 × 
    2 real matrices, and B is ring isomorphic to M(2,C), the 2 x 2 complex 
    matrices. Representation of H uses the context in B. In the context of 
    general Linear Algebra the idea of composition is visible with the 
    determinant of a matrix which has a similar property.
    In the notation of Hamilton, with w=a+bi,\ z=c+di, (w,z) is written 
    a + bi + cj + dk, where the products ij=k=-ji,\ jk=i=-kj,\ ki=j=-ik can 
    be confirmed, and noted for anticommutativity. The set {i, j, k} has been 
    taken as the basis of space in presentations of kinematics, mechanics, 
    and physical science. The anticommutative products illustrate cross 
    products.
 
    (Source: https://en.wikibooks.org/wiki/Associative_Composition_Algebra/Quaternions)`;

  axios.post( url + "/public/Lobbies/", {
    data: {
        Default : defaultLobby,
        Beginner : beginnerLobby,
        Average : averageLobby,
        Expert : expertLobby,
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
