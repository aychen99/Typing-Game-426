import config from "../config.js"
import { installLobbyButton } from "./lobbies.js";

let url = config.url;

console.log(localStorage["typing-username"]);

/**
 * Makes a post call to update the settings of the user.
 * 
 * @param {string} field 
 * @param {*} value 
 * @param {[*]} fieldOptions 
 */
async function updateUserSettings(field, value, fieldOptions) {
  console.log(url + "/user/settings/" + field);
  return await axios({
    method: "post",
    url: url + "/user/settings/" + field,
    headers: {
      Authorization: "Bearer " + localStorage.jwt
    },
    data: {
      data: {
        value: value,
        options: fieldOptions
      }
    }
  });
}

/**
 * Returns a promise that contains all of the field names of a user's profile.
 * E.g. If a user has displayName, avgWPM, and gamesPlayed in their profile, this will return a promise that holds ["displayName", "avgWPM", "gamesPlayed"].
 * 
 * This does NOT return the values of those fields. getProfileValueOf(field) does that.
 */
async function getProfileFields() {
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
  return await axios({
    method: "get",
    url: url + "/user/profile/" + field,
    headers: { Authorization: "Bearer " + localStorage.jwt }
  });
}

/**
 * Returns a promise that contains all of the field names of a user's settings.
 * 
 * This does NOT return the values of those fields. getSettingsValueOf(field) does that.
 */
async function getSettingsFields() {
  return await axios({
    method: "get",
    url: url + "/user/settings/",
    headers: { Authorization: "Bearer " + localStorage.jwt }
  });
}

/**
 * Returns a promise that contains the value of a field in a user's settings.
 * @param {string} field The field that you want the value of.
 */
async function getSettingsValueOf(field) {
  return await axios({
    method: "get",
    url: url + "/user/settings/" + field,
    headers: { Authorization: "Bearer " + localStorage.jwt }
  });
}

/**
 * Renders logout button.
 */
function installLogoutButton() {
  $("#logout-button").on("click", function() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("typing-username");
    location.reload();
  });
}

/**
 * Renders profile button in nav bar.
 */
function installProfileButton() {
  $("#profile-button").on("click", async function() {
    // Gets all of the fields of a user's profile (displayName, avgWPM, etc.)
    getProfileFields().then(response => {
      let profileFields = response.data.result;

      // Creating the profile view popup
      $("body").append(`
      <div class="prompt-background" id="profile-prompt-background">
        <div class="menu-prompt" id="profile-menu-div">

          <!-- RENDERING JS CODE IN THESE DIVS -->
          <div id="profile-header-container">
            <p class="has-text-centered is-size-3">
              Profile for <span class="has-text-info">${localStorage["typing-username"]}</span>
            </p>
          </div>

          <div class="is-centered" id="profile-info-container">
          </div>

          <div id="profile-buttons-container">
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

          // Renders each field and value
          $("#profile-info-container").append(`
            <div>
              <span class="has-text-weight-bold">
                ${fieldName}:
              </span>
              <span class="has-text-gray">${fieldValue}</span>
            </div>
            `);
        });
        
      }

      // Render settings and exit button
      $("#profile-buttons-container").append(`
      <br>

      <button class="button is-primary" id="profile-settings">Settings</button>
      <button class="button is-warning" id="close-profile">Close</button>
      `);
      // Button event handlers
      $("#close-profile").on("click", handleCloseProfileButtonPress);
      $("#profile-settings").on("click", handleProfileSettingsButtonPress);
      
    })
  });

}

/**
 * Handles the close profile button press.
 * @param {*} event 
 */
function handleCloseProfileButtonPress(event) {
  $("#profile-prompt-background").remove();
}

/**
 * Handles the settings button press.
 * @param {*} event 
 */
async function handleProfileSettingsButtonPress(event) {
  // Renders settings popup
  $("body").append(`
    <div class="layer-2-prompt-bg" id="settings-prompt-background">
      <div class="layer-2-menu-prompt" id="settings-menu-div">

        <!-- RENDERING JS CODE IN THESE DIVS -->
        <div class="is-centered is-size-3" id="settings-header-container">
          Settings
        </div>

        <form id="settings-values-container">
        </form>

        <div id="settings-buttons-container">
          <br>

          <button class="button is-primary" id="save-settings" type="submit" value="save-settings">Save</button>
          <button class="button is-warning" id="cancel-settings">Close</button>
        </div>
      </div>

    </div>
    `)

  // Gets all the names of settings fields and stores it in an array
  getSettingsFields().then(response => {
    let settingsFields = response.data.result;

    // Button event handlers
    $("#cancel-settings").on("click", handleCancelSettingsButtonPress);
    $("#save-settings").on("click", function() {
      handleSaveSettingsButtonPress(settingsFields);
    });

    // Gets the value of each settings field and renders it to the view
  for (let i = 0; i < settingsFields.length; i++) {
    let fieldName = settingsFields[i];

    // Gets the value of the settings field
    getSettingsValueOf(fieldName).then(response => {
      let fieldValue = response.data.result.value;
      let fieldOptions = response.data.result.options;

      // Renders the setting field name
      $("#settings-values-container").append(`
        <span class="has-text-weight-bold">
          ${fieldName}:
        </span>
        `);

      // Renders all of the options
      for (let j = 0; j < fieldOptions.length; j++) {
        if (fieldOptions[j] == fieldValue) {
          $("#settings-values-container").append(`
            <input class="${fieldName.replace(/\s/g, '')}-radio" type="radio" name="${fieldName}" value="${fieldOptions[j]}" checked> ${fieldOptions[j]}
          `)
        } else {
          $("#settings-values-container").append(`
            <input class="${fieldName.replace(/\s/g, '')}-radio" type="radio" name="${fieldName}" value="${fieldOptions[j]}"> ${fieldOptions[j]}
          `)
        }
      }
      $("#settings-values-container").append("<br>");

    });
    
    }
  });

}

/**
 * Handles when the user presses the cancel settings button.
 * @param {*} event 
 */
function handleCancelSettingsButtonPress(event) {
  $("#settings-prompt-background").remove();
}

/**
 * Handles when the user hits the save settings button.
 * @param {string[]} settingsFields 
 */
function handleSaveSettingsButtonPress(settingsFields) {
  // Loops through each settings field
  for (let i = 0; i < settingsFields.length; i++) {
    let fieldName = settingsFields[i];
    // Gets the radio buttons for the setting field
    let radioGroup = document.getElementsByName(fieldName);
    
    getSettingsValueOf(fieldName).then(response => {
      let fieldOptions = response.data.result.options;

      // Loops through to check which radio button has been checked, and sends a post call to update the user's settings
      for (let j = 0; j < radioGroup.length; j++) {
        if (radioGroup[j].checked) {
          updateUserSettings(fieldName, radioGroup[j].value, fieldOptions);
        }
      }
    });
    
  }
}

/**
 * Renders the buttons on the nav bar when logged in.
 */
export default function installButtonsLoggedIn() {
    installLogoutButton();
    installProfileButton();
    installLobbyButton();
}

