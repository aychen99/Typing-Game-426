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
        let result = await axios({
            method: 'get',
            url: url + "/account/status",
            headers: {'Authorization': 'Bearer ' + localStorage.jwt},
        });
        console.log(result);
    });
}

export default function installButtonsLoggedIn() {
    installLogoutButton();
    installSettingsButton();
}