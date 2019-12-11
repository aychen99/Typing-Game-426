import config from "../config.js";

let url = config.url;

//A lobby class
export class Lobby {
    constructor (name) {
        this.name = name;
        this.users = [];
        this.hasPasscode = false;
        this.passcode = "";
    }

    join(name) {
        users.push(name);
    }
}

export default function installLobbyButton() {
    $("#lobby-button").on("click", function () {
      createLobbyList();
    })
  }

  async function getLobbies() {
    try {
      let result = await axios({
        method: 'get',
        url: url + '/public/Lobbies',
      });
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
        //console.log(lobbyArray);
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
                      </div>
                  </div>
              `);
        $('#close-prompt').on('click', function (e) {
          $('#lobbies-prompt-background').remove();
          e.preventDefault();
        })
        $('#create-prompt').on('click', function (e) {
          createALobby();
          e.preventDefault();
        });
      } catch (e) {
        console.log(e);
      }
  }

  
  function showLobbies(array) {
    let hold = "";
    for (let i = array.length - 1; i >= 0; i--) {
      hold = 
      `<div>
        <span class="has-text-gray"><a href = "#" onclick="return false;">${array[i].name}</span>
      </div>` + hold
    }
    return hold;
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
            $('#error-mini-prompt-background').remove();
            e.preventDefault();
        })
        $('#create-mini-prompt').on('click', async function() {
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

        if(!($("#lobby-passcode") == "")) {
            hasP = true;
        }

      try {
        await axios.post( url + `/public/Lobbies/${hold}`, {
            data: {
                name : hold,
                users : [],
                hasPasscode : hasP,
                passcode : $("#lobby-passcode").val() 
            }
          })
          .then(response => { 
            console.log(response)
          })
          .catch(error => {
            console.log(error.response)
          });
      } catch (e) {
        console.log(e)
      }
  }