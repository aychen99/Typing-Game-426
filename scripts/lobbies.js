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

function installLobbyButton() {
    $("#lobby-button").on("click", function () {
      createLobbyList();
    })
  }

async function createDefaultLobbies() {
    let defaultLobby = new Lobby("Default");
  
    try {
      axios.post( url + "/public/Lobbies/", {
        data: {
            Default: defaultLobby,
            Beginners: new Lobby("Beginners"),
            Average: new Lobby("Average"),
            Experts: new Lobby("Experts"),
        }
      })
      .then(response => { 
        console.log(response)
      })
      .catch(error => {
        console.log(error.response)
      });
    } catch {
      $("#uap-header").html(`
                  <span class="has-text-danger">Login failed! Try again!</span>
              `);
    }
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
        $('#close-prompt').on('click', function () {
          $('#lobbies-prompt-background').remove();
        })
        $('#create-prompt').on('click', function () {
          createALobby();
        });
      } catch (e) {
        console.log(e);
        // $('body').append(`
        //           <div class="prompt-background" id="error-prompt-background">
        //               <div class="user-prompt">
        //                   <p class="has-text-centered is-size-4" id="uap-header">
        //                       Uh oh! Looks like an error occurred. Please try logging 
        //                       out and logging back in!
        //                   </p>
        //                   <br>
        //                   <button class="button is-warning" id="close-prompt">Close</button>
        //               </div>
        //           </div>
        //       `);
        // $('#close-prompt').on('click', function () {
        //   $('#error-prompt-background').remove();
        // });
      }
  }

  
  function showLobbies(array) {
    let hold = "";
    for (let i = 0; i < array.length; i++) {
      hold = 
      `<div>
        <span class="has-text-gray"><a href = "index.html">${array[i].name}</span>
      </div>` + hold
    }
    return hold;
  }
  
  function createALobby() {
    if (localStorage.jwt) {
      $('body').append(`
        <div> 
          <form>
            Name: <br>
            <input type="text">
        </div>
      
      
      
      
      
      
      `);
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
        $('#close-mini-prompt').on('click', function () {
          $('#error-mini-prompt-background').remove();
        });
    }

  }

  
  export default function makeLobbies() {
    createDefaultLobbies();
    installLobbyButton();
}