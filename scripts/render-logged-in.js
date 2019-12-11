import config from "../config.js"
import { installLobbyButton } from "./lobbies.js";

let url = config.url;

/**
 * Returns a promise that contains all of the field names of a user's profile.
 * E.g. If a user has displayName, avgWPM, and gamesPlayed in their profile, this will return a promise that holds ["displayName", "avgWPM", "gamesPlayed"].
 * 
 * This does NOT return the values of those fields. getProfileValueOf(field) does that.
 */
async function getProfileFields() {
<<<<<<< HEAD
  return await axios({
    method: "get",
    url: url + "/user/profile/",
    headers: { Authorization: "Bearer " + localStorage.jwt }
  });
}

/**
 * Returns a promise that contains the value of a field in a user's profile.
 * E.g. If a user's display name is Jake and you call getProfileValueOf("displayName"), this will return a promise that contains "Jake".
 * 
 * @param {string} field The field that you want the value of.
 */
async function getProfileValueOf(field) {
=======
>>>>>>> 6d4d3edaa14319d962190c2afbca787eee968b49
  return await axios({
    method: "get",
    url: url + "/user/profile/",
    headers: { Authorization: "Bearer " + localStorage.jwt }
  });
}

<<<<<<< HEAD
=======
/**
 * Returns a promise that contains the value of a field in a user's profile.
 * E.g. If a user's display name is Jake and you call getProfileValueOf("displayName"), this will return a promise that contains "Jake".
 * 
 * @param {string} field The field that you want the value of.
 */
async function getProfileValueOf(field) {
  return await axios({
    method: "get",
    url: url + "/user/profile/" + field,
    headers: { Authorization: "Bearer " + localStorage.jwt }
  });
}

>>>>>>> 6d4d3edaa14319d962190c2afbca787eee968b49
function installLogoutButton() {
  $("#logout-button").on("click", function() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("typing-username");
    location.reload();
  });
}

function installProfileButton() {
  $("#profile-button").on("click", async function() {
    // Gets all of the fields of a user's profile (displayName, avgWPM, etc.)
    getProfileFields().then(response => {
      let profileFields = response.data.result;
      console.log("Profile fields: " + profileFields);

      // Creating the profile view popup
      $("body").append(`
      <div class="prompt-background" id="profile-prompt-background">
        <div class="menu-prompt" id="profile-menu-div">

        <!-- JS RENDERING CODE HERE -->

          <div id="close-profile-container">

          </div>
        </div>

      </div>
      `)

      // Gets the value of each profile field and renders it to the view
      for (let i = 0; i < profileFields.length; i++) {
        let fieldName = profileFields[i];

        // Gets the value of the profile field
        getProfileValueOf(fieldName).then(response => {
          let fieldValue = response.data.result;

          // profileFields[0] is always equal to displayName
          if (i == 0) {
            $("#close-profile-container").before(`
            <p class="has-text-centered is-size-3">
              Profile for <span class="has-text-info">${fieldValue}</span>
            </p>

            <br>
            `);
          } else { // Every other field
            $("#close-profile-container").before(`
            <div>
              <span class="has-text-weight-bold">
                ${fieldName}: <span class="has-text-gray">${fieldValue}</span>
              </span>
            </div>
            `);
          }

        });
        
      }

      // Render exit button
      $("#close-profile-container").append(`
      <br>

      <button class="button is-warning" id="close-profile">Close</button>
      `);
      // Close button event handler
      $("#close-profile").on("click", handleCloseProfileButtonPress);
    
      
    })
<<<<<<< HEAD

    // getProfileValueOf("displayName").then(response => {
    //   let profile = response.data.result;
    //   console.log(profile);
    //   $("body").append(`
    //           <div class="prompt-background" id="profile-prompt-background">
    //               <div class="menu-prompt">
    //                   <p class="has-text-centered is-size-3">
    //                       Profile for <span class="has-text-info">${localStorage["typing-username"]}</span>:
    //                   </p>
    //                   <br>
    //                   <div>
    //                       <span class="has-text-weight-bold">Games Played: </span>
    //                       <span class="has-text-gray">${profile["gamesPlayed"]}</span>
    //                   </div>
    //                   <div>
    //                       <span class="has-text-weight-bold">Words Per Minute: </span>
    //                       <span class="has-text-gray">${profile["avgWPM"]}</span>
    //                   </div>
    //                   <div>
    //                       <span class="has-text-weight-bold">Theme: </span>
    //                       <span class="has-text-gray">${profile["theme"]}</span>
    //                   </div>

=======

    // getProfileValueOf("displayName").then(response => {
    //   let profile = response.data.result;
    //   console.log(profile);
    //   $("body").append(`
    //           <div class="prompt-background" id="profile-prompt-background">
    //               <div class="menu-prompt">
    //                   <p class="has-text-centered is-size-3">
    //                       Profile for <span class="has-text-info">${localStorage["typing-username"]}</span>:
    //                   </p>
    //                   <br>
    //                   <div>
    //                       <span class="has-text-weight-bold">Games Played: </span>
    //                       <span class="has-text-gray">${profile["gamesPlayed"]}</span>
    //                   </div>
    //                   <div>
    //                       <span class="has-text-weight-bold">Words Per Minute: </span>
    //                       <span class="has-text-gray">${profile["avgWPM"]}</span>
    //                   </div>
    //                   <div>
    //                       <span class="has-text-weight-bold">Theme: </span>
    //                       <span class="has-text-gray">${profile["theme"]}</span>
    //                   </div>

>>>>>>> 6d4d3edaa14319d962190c2afbca787eee968b49
    //                   <br>
    //                   <button class="button is-warning" id="close-prompt">Close</button>
    //               </div>
    //           </div>
    //       `);
    // });







    // async function getUserSettings() {
    //   try {
    //     let result = await axios({
    //       method: "get",
    //       url: url + "/user/settings",
    //       headers: {
    //         Authorization: "Bearer " + localStorage.jwt
    //       }
    //     });

    //     return result.data.result;
    //   } catch (e) {
    //     // If user does not have settings configured,
    //     // configure it first
    //     await axios({
    //       method: "post",
    //       url: url + "/user/settings/",
    //       headers: { Authorization: "Bearer " + localStorage.jwt },
    //       data: {
    //         data: {
    //           games_played: "0",
    //           wpm: "0",
    //           theme: "dark"
    //         }
    //       }
    //     });
    //     let result = await axios({
    //       method: "get",
    //       url: url + "/user/settings",
    //       headers: { Authorization: "Bearer " + localStorage.jwt }
    //     });
    //     return result.data.result;
    //   }
    // }

    // try {
      

      // $("body").append(`
      //           <div class="prompt-background" id="settings-prompt-background">
      //               <div class="menu-prompt">
      //                   <p class="has-text-centered is-size-3">
      //                       Settings for <span class="has-text-info">${localStorage["typing-username"]}</span>:
      //                   </p>
      //                   <br>
      //                   <div>
      //                       <span class="has-text-weight-bold">Games Played: </span>
      //                       <span class="has-text-gray">${settings["games_played"]}</span>
      //                   </div>
      //                   <div>
      //                       <span class="has-text-weight-bold">Words Per Minute: </span>
      //                       <span class="has-text-gray">${settings["wpm"]}</span>
      //                   </div>
      //                   <div>
      //                       <span class="has-text-weight-bold">Theme: </span>
      //                       <span class="has-text-gray">${settings["theme"]}</span>
      //                   </div>

      //                   <br>
      //                   <button class="button is-warning" id="close-prompt">Close</button>
      //               </div>
      //           </div>
      //       `);
      
  //     $("#close-prompt").on("click", function() {
  //       $("#settings-prompt-background").remove();
  //     });
  //   } catch {
  //     $("body").append(`
  //               <div class="prompt-background" id="error-prompt-background">
  //                   <div class="user-prompt">
  //                       <p class="has-text-centered is-size-4" id="uap-header">
  //                           Uh oh! Looks like an error occurred. Please try logging 
  //                           out and logging back in!
  //                       </p>
  //                       <br>
  //                       <button class="button is-warning" id="close-prompt">Close</button>
  //                   </div>
  //               </div>
  //           `);
  //     $("#close-prompt").on("click", function() {
  //       $("#error-prompt-background").remove();
  //     });
  //   }
  });
}

function handleCloseProfileButtonPress(event) {
  $("#profile-prompt-background").remove();
}

export default function installButtonsLoggedIn() {
    installLogoutButton();
    installSettingsButton();
    installLobbyButton();
}

