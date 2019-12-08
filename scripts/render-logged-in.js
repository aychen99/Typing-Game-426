import config from "../config.js"

let url = config.url;

function installLogoutButton() {
    $('#logout-button').on('click', function () {
        localStorage.removeItem('jwt');
        location.reload();
    });
}

function installSettingsButton() {
    $('#settings-button').on('click', async function () {
        async function getUserSettings() {
            try {
                let result = await axios({
                    method: 'get',
                    url: url + '/user/settings',
                    headers: {'Authorization': 'Bearer ' + localStorage.jwt},
                });
                return result.data.result;
            }
            catch (e) {
                // If user does not have settings configured,
                // configure it first
                await axios({
                    method: 'post',
                    url: url + '/user/settings/',
                    headers: {'Authorization': 'Bearer ' + localStorage.jwt},
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
                    headers: {'Authorization': 'Bearer ' + localStorage.jwt},
                });
                return result.data.result;
            }
            
        }

        try {
            let settings = await getUserSettings();
            console.log(settings);
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
            $('#close-prompt').on('click', function() {
                $('#error-prompt-background').remove();
            });
        }
    });
}

export default function installButtonsLoggedIn() {
    installLogoutButton();
    installSettingsButton();
}