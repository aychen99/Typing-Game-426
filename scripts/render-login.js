import config from "../config.js"

let url = config.url;

function installLoginButton() {
    $('#login-button').on('click', function() {
        createUserActionPrompt('Login');
    });
}

function installSignupButton() {
    $('#signup-button').on('click', function() {
        createUserActionPrompt('Sign Up');
    });
}

function installPromptButtonHandlers(mode) {
    if (mode == 'Login') {

    } else {

    }

    $('#cancel-user-action').on('click', function() {
        $('#user-action-prompt-background').remove();
    });
}

function createUserActionPrompt(mode) {
    let $prompt = $(`
        <div class="prompt-background" id="user-action-prompt-background">
            <div class="user-prompt">
                <p class="has-text-centered is-size-3">
                    ${mode} here!
                </p>
                <div class="field">
                    <label class="label has-text-link">Username:</label>
                    <div class="control">
                        <input class="input" 
                                type="text" 
                                placeholder="Username"
                                name="username">
                    </div>
                </div>
                <div class="field">
                    <label class="label has-text-link">Password:</label>
                    <div class="control">
                        <input class="input" 
                                type="text" 
                                placeholder="Password"
                                name="password">
                    </div>
                </div>
                <br>
                <button class="button is-success" id="submit-user-action">${mode}</button>
                <button class="button is-warning" id="cancel-user-action">Cancel</button>
            </div>
        </div>
    `);
    $('body').append($prompt);
    installPromptButtonHandlers(mode);
}

export default function installButtons() {
    installLoginButton();
    installSignupButton();
}