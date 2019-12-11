import config from '../config.js';

let url = config.url;

function getLeaderboardTableHTML(arrayOfUsers) {
    // Transform stats for each user into HTML table elements
    let leaderboardTRows = ``;
    arrayOfUsers.forEach(function(user, index) {
        leaderboardTRows += `
            <tr>
                <th>${index + 1}</th>
                <td>${user['username']}</td>
                <td>${user['Average WPM']}</td>
                <td>${user['Highest WPM']}</td>
            </tr>
        `
    });

    return `
        <table class="table is-striped is-narrow is-hoverable">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Average WPM</th>
                    <th>Highest WPM Ever</th>
                </tr>
            </thead>
            <tbody>
                ${leaderboardTRows}
            </tbody>
        </table>
    `;
}

async function displayLeaderboardHTML() {
    let rawLeaderboard = (await axios({
        method: 'get',
        url: url + '/public/leaderboards',
    })).data.result;

    // Sort the leaderboard into an array 
    // in descending order by average WPM
    let leaderboardArray = [];
    for (let username in rawLeaderboard) {
        let userObject = rawLeaderboard[username];
        userObject['username'] = username;
        leaderboardArray.push(userObject);
    }
    leaderboardArray.sort((user1, user2) => {
        return user2['Average WPM'] - user1['Average WPM'];
    });

    // Only show the top 10 users
    leaderboardArray = leaderboardArray.slice(0, 10);

    return getLeaderboardTableHTML(leaderboardArray);
}

async function displayAutocompleteUsernames(partialUsername) {
    let rawUsernames = (await axios({
        method: 'get',
        url: url + '/public/leaderboards',
    })).data.result;

    let usernameArray = [];
    for (let username of Object.keys(rawUsernames)) {
        usernameArray.push(username);
    }

    let matchingUsernames = [];
    for (let username of usernameArray) {
        if (partialUsername == '') {
            break;
        }
        if (partialUsername == username.slice(0, partialUsername.length)) {
            matchingUsernames.push(username);
        }
    }

    // Display the usernames in a drop-down bar
}

function enableAutocomplete() {
    // Code from COMP 426 lecture by Chris Burgess
    let timeout;
    function debounce(fn, timeDelay) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn();
        }, timeDelay);
    }

    let $autoCom = $('#autocomplete-bar');
    $autoCom.on('keyup', () => {
        let partialUsername = $autoCom.val();
        debounce(() => {
            displayAutocompleteUsernames(partialUsername);
        }, 500);
    })
}

export default function installLeaderboardsButton() {
    $('#leaderboards-button').on('click', async function() {
        $('body').append(`
            <div class="prompt-background" id="leaderboards-prompt-background">
                <div class="menu-prompt">
                    <p class="has-text-centered is-size-3">
                        Leaderboards:
                    </p>

                    <!-- Code from https://www.w3schools.com/howto/howto_js_autocomplete.asp -->
                    <form autocomplete="off" action="/action_page.php">
                        <div class="autocomplete">
                            <input class="input"
                                   id="autocomplete-bar" 
                                   type="text" 
                                   name="searchByUsername" 
                                   placeholder="Search for an user on the leaderboards!">
                        </div>
                    </form>

                    <br>
                    ${await displayLeaderboardHTML()}                       
                    <br>

                    <button class="button is-warning" id="close-prompt">Close</button>
                </div>
            </div>
        `);
        $('#close-prompt').on('click', function (e) {
            $('#leaderboards-prompt-background').remove();
            e.preventDefault();
        });

        enableAutocomplete();
    });
}