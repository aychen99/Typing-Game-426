//A lobby object
let lobby;

//A lobby class
export default class Lobby {
    constructor (name) {
        lobby = {
            users: [],
            name: name,
            hasPasscode: false,
            passcode: "",
        }

    }

    join(name) {
        users.push(name);
    }
}