//A lobby object
let lobby;

//A lobby class
export default class Lobby {
    constructor (name) {
        this.name = name;
        this.users = [];
        this.hasPasscode = false;
        this.passcode = "";

        // lobby = {
        //     users: [],
        //     name: name,
        //     hasPasscode: false,
        //     passcode: "",
        // }

    }

    join(name) {
        users.push(name);
    }
}