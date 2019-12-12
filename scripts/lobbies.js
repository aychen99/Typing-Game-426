import config from "../config.js";
import loadTypingGame from "./game-logic.js";


let url = config.url;
let allLobbies;

//A lobby class
export default class Lobby {
  constructor(name) {
    this.name = name;
    this.users = [];
    this.hasPasscode = false;
    this.passcode = "";
    this.owner = "";
    this.text = "";
  }

}

export function installLobbyButton() {
  $("#lobby-button").on("click", function () {
    createLobbyList();
  })
}
async function getLobbies() {
  try {
    let result = await axios({
      method: 'get',
      url: url + '/public/Lobbies',
    })
    return result.data.result;
  }
  catch (e) {
    // Returns error if there is one
    console.log(e);
  }

}

async function createLobbyList() {
  try {
    let lobbies = await getLobbies();
    let lobbyArray = Object.keys(lobbies).map(i => lobbies[i]);
    allLobbies = lobbyArray;
    $('body').append(`
                  <div class="prompt-background" id="lobbies-prompt-background">
                      <div class="menu-prompt">
                          <p class="has-text-centered is-size-3">
                              Lobbies:
                          </p>
  
                          <br>
                          ${showLobbies(lobbyArray)}  
                          <br>
  
                          <button class="button is-warning" id="close-prompt">Close</button>
                          <button class="button is-info" id="create-prompt">Create</button>
                          <button class="button is-danger" id="delete-prompt">Delete Lobby</button>

                      </div>
                  </div>
              `);
    //Gets the lobby that was clicked on and "returns" it?
    $(".select-lobby-button").click(function() {
      handleLobbyClick(this.id);
      console.log(this.id);
    });
    $('#close-prompt').on('click', function (e) {
      $('#lobbies-prompt-background').remove();
      e.preventDefault();
    })
    $('#create-prompt').on('click', async function (e) {
      if (await findLobby() == false) {
        createALobby();
        e.preventDefault();
      } else {
        $('body').append(`
            <div class="prompt-background" id="error-mini-prompt-background">
                <div class="user-prompt">
                    <p class="has-text-centered is-size-4" id="uap-header">
                      Seems like you have already created a Lobby. You can only have one owned lobby at a time.
                    </p>
                    <br>
                    <button class="button is-warning" id="close-mini-prompt">Close</button>
                </div>
            </div>
        `);
        $('#close-mini-prompt').on('click', function (e) {
          $('#error-mini-prompt-background').remove();
          e.preventDefault();
        });
      }
    })
    $('#delete-prompt').on('click', async function (e) {
      await deleteLobby();
      $('#lobbies-prompt-background').remove();
      createLobbyList();
      e.preventDefault();
    });
  } catch (e) {
    console.log(e);
  }
}


function showLobbies(array) {
  let hold = "";
  
  for (let i = array.length - 1; i > 3; i--) {
    hold =
      `<div>
        <span class="has-text-gray"><button class="button is-success is-medium is-fullwidth" id="${array[i].name}">${array[i].name + " | Created By: " + array[i].owner}</button></span>
      </div>` + hold
  }

  for (let i = 3; i >= 0; i--) {
    hold =
      `<div>
        <span class="has-text-gray"><button class="button is-success is-medium is-fullwidth select-lobby-button" id="${array[i].name}">${array[i].name}</button></span>
      </div>` + hold
      $(`${array[i].name}button`).on('click', handleLobbyClick);
  }
  return hold;
}

async function handleLobbyClick(name) {
  let lobby;
  for (let i = 0; i < allLobbies.length; i++) {
    if (name == allLobbies[i].name) {
      lobby = allLobbies[i];
    }
  }

  document.getElementById("hope").innerHTML = `${lobby.name + " Room"}`;
  document.getElementById("users-section-text-container").innerHTML = `${lobby.users}`;
  //$('#lobbies-prompt-background').remove();
  if (localStorage.jwt) {
    if (!lobby.users.includes(localStorage['typing-username'])) {
      lobby.users.push(localStorage['typing-username']);
    }
  } else {
    lobby.users.push("Guest 007");
  }
  loadTypingGame(lobby.name);
}

function createALobby() {
  if (localStorage.jwt) {
    $('body').append(`
                  <div class="prompt-background" id="create-mini-prompt-background">
                      <div class="user-prompt">
                        <form>
                            Name: 
                            <input type="text" id="lobby-name">
                            <br>

                            Passcode:
                            <input type="text" id="lobby-passcode">
                            <br>

                        </form>
                          <br>
                          <button class="button is-warning" id="close-mini-prompt">Close</button>
                          <button class="button is-info" id="create-mini-prompt">Create</button>
                      </div>
                  </div>
              `);
    $('#close-mini-prompt').on('click', function (e) {
      $('#create-mini-prompt-background').remove();
      e.preventDefault();
    })
    $('#create-mini-prompt').on('click', async function () {
      await createLobby();
      $('#create-mini-prompt-background').remove();
      $('#lobbies-prompt-background').remove();
      createLobbyList();
    });
  } else {
    $('body').append(`
                  <div class="prompt-background" id="error-mini-prompt-background">
                      <div class="user-prompt">
                          <p class="has-text-centered is-size-4" id="uap-header">
                              Uh oh! Looks like you are not logged in. You must have an account to create a lobby.
                          </p>
                          <br>
                          <button class="button is-warning" id="close-mini-prompt">Close</button>
                      </div>
                  </div>
              `);
    $('#close-mini-prompt').on('click', function (e) {
      $('#error-mini-prompt-background').remove();
      e.preventDefault();
    });
  }

}

async function createLobby() {
  let hold = $("#lobby-name").val();
  let hasP = false;

  if (!($("#lobby-passcode") == "")) {
    hasP = true;
  }

  await axios.post(url + `/public/Lobbies/${hold}`, {
    data: {
      name: hold,
      users: [],
      hasPasscode: hasP,
      passcode: $("#lobby-passcode").val(),
      owner: localStorage['typing-username'],
    }
  })
    .catch(error => {
      console.log(error.response)
    });
}


async function findLobby() {
  let lobbies = await getLobbies();
  let lobbyArray = Object.keys(lobbies).map(i => lobbies[i]);
  for (let i = 0; i < lobbyArray.length; i++) {
    if (lobbyArray[i].owner == localStorage['typing-username']) {
      return true;
    }
  }
  return false;
}

async function deleteLobby() {
  let thisURL;
  let lobbies = await getLobbies();
  let lobbyArray = Object.keys(lobbies).map(i => lobbies[i]);
  for (let i = 0; i < lobbyArray.length; i++) {
    if (lobbyArray[i].owner == localStorage['typing-username']) {
      try {
        thisURL = url + `/public/Lobbies/${lobbyArray[i].name}`;
        await axios.delete(thisURL);

      } catch (e) {
        console.log(e);
      }
      return true;
    }
  }
  return false;
}