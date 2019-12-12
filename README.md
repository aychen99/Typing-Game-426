# Blaze Typing 426
A website where people can practice typing, made for UNC's COMP 426, Fall 2019.

## Getting Started

### Prerequisites / Dependencies
* Node.js
* Bulma
* Sass

### Installing
Download and install Node.js -> https://nodejs.org/en/download/

After cloning/downloading, run this command in the root directory to install all of the dependencies
```
npm ci
```

## Deployment
Install browser-sync by running the following command
```
npm install -g browser-sync
```

Then run this command in the root directory of this project
```
browser-sync start -sw
```

IMPORTANT NOTE: During development, we used a shortcut hack in the "render-login.js" file to create our "default" lobbies. In lieu of further development, server admin will want to open up the "index.html" homepage file once during deployment, then comment out the line "createDefaultLobbies();" in "render-login.js" immediately after.

## Other resources
We used the COMP 426 backend to host our backend, found here -> https://github.com/cgburgess/comp426-backend
