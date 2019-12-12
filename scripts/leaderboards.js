import config from '../config.js';

let url = config.url;

function getLeaderboardTableHTML(arrayOfUsers) {
    // Transform stats for each user into HTML table elements
    let leaderboardTRows = ``;
    arrayOfUsers.forEach(function(user) {
        let rowClasses = '';
        if (user['username'] == localStorage['typing-username']) {
            rowClasses = 'has-background-info';
        }
        leaderboardTRows += `
            <tr class="${rowClasses}">
                <th>${user['rank']}</th>
                <td>${user['username']}</td>
                <td>${user['Average WPM']}</td>
                <td>${user['Highest WPM']}</td>
                <td>${user['Games Played']}</td>
            </tr>
        `;
    });

    return `
        <table class="table is-striped is-narrow is-hoverable"
               id="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Average WPM</th>
                    <th>Highest WPM Ever</th>
                    <th>Games Played</th>
                </tr>
            </thead>
            <tbody id="leaderboard-table-body">
                ${leaderboardTRows}
            </tbody>
        </table>
    `;
}

function sortLeaderboard(rawLeaderboard) {
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

    leaderboardArray.forEach(function(user, index) {
        user['rank'] = index + 1;
    });
    return leaderboardArray;
}

async function getLeaderboardHTML(autocompleteUsername) {
    let rawLeaderboard = (await axios({
        method: 'get',
        url: url + '/public/leaderboards',
    })).data.result;

    console.log(rawLeaderboard);

    let leaderboardArray = sortLeaderboard(rawLeaderboard);
    leaderboardArray = truncateLeaderboard(leaderboardArray, autocompleteUsername);

    return getLeaderboardTableHTML(leaderboardArray);
}

function truncateLeaderboard(leaderboardArray, autocompleteUsername) {
    // Only show the top 10 users by default
    let returnedArray = leaderboardArray.slice(0, 10);
    if (autocompleteUsername) {
        let indexAt = 0;
        leaderboardArray.some(function(userObject, index) {
            if (userObject['username'] == autocompleteUsername) {
                indexAt = index;
                return true;
            } else {
                return false;
            }
        });
        if (indexAt != 0) {
            returnedArray = leaderboardArray.slice(
                    Math.max(0, indexAt-5), indexAt+5);
        }
    }
    return returnedArray;
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
    let matchingUsernamesHTML = [];
    for (let username of usernameArray) {
        if (partialUsername == '') {
            $('#autocomplete-list').remove();
            return;
        }
        if (partialUsername.toLowerCase() 
                == username.slice(0, partialUsername.length)
                           .toLowerCase()) {
            // Make the matching letters bold in HTML form
            matchingUsernamesHTML.push(
                '<div class="autocomplete-item" data-value="' 
                + username
                + '" id="choice-' + matchingUsernames.length + '">' 
                + '<strong>' + partialUsername
                + '</strong>'
                + username.slice(partialUsername.length)
                + '</div>'
            );
            matchingUsernames.push(username);
        }
    }
    if (matchingUsernames.length == 0) {
        $('#autocomplete-list').remove();
        return;
    }

    // Limit matching usernames to 10 total
    matchingUsernamesHTML = matchingUsernamesHTML.slice(0, 10);

    // Display the usernames in a drop-down bar
    // Starter code from https://www.w3schools.com/howto/howto_js_autocomplete.asp
    
    // Close any already open lists of autocompleted values
    $('#autocomplete-list').remove();
    let autocompleteItems = matchingUsernamesHTML.join(`
    `);

    let autocompleteList = `
        <div class="autocomplete-items" id="autocomplete-list">
            ${autocompleteItems}
        </div>
    `;
    $('#autocomplete-parent-div').append(autocompleteList);
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

    $(document).on('click', '.autocomplete-item', async function(e) {
        $autoCom.val($(this).attr('data-value'));
        $('#autocomplete-list').remove();
        $('#leaderboard-table').replaceWith(await getLeaderboardHTML($autoCom.val()));
        e.stopPropagation();
    });
    
    $autoCom.on('keyup', async function(e) {
        let partialUsername = $autoCom.val();
        if (e.which == 13) { // enter key pressed
            let firstChoice = $('#choice-0').attr('data-value');
            if (firstChoice == undefined) {
                firstChoice = partialUsername;
            }
            $autoCom.val(firstChoice);
            $('#autocomplete-list').remove();
            $('#leaderboard-table').replaceWith(await getLeaderboardHTML($autoCom.val()));
        } else {
            debounce(() => {
                displayAutocompleteUsernames(partialUsername);
            }, 500);
        }
    });
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
                    <div class="autocomplete" id="autocomplete-parent-div">
                        <input class="input"
                                id="autocomplete-bar" 
                                type="text" 
                                name="searchByUsername" 
                                placeholder="Search for an user on the leaderboards!">
                    </div>

                    <br>
                    ${await getLeaderboardHTML()}                       
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