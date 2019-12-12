import config from '../config.js';
let url = config.url;

function loadTextToType(textAsHTML) {
    $('#text-to-type').html(textAsHTML);
}

async function getText(lobbyName) {
    let text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
        nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse 
        cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, 
        sunt in culpa qui officia deserunt mollit anim id est laborum.        
        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. 
        Nullam varius, turpis et commodo pharetra, est eros bibendum elit, 
        nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh 
        euismod gravida. 
        Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. 
        Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod 
        turpis, 
        id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. 
        Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, 
        aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, 
        elit ut dictum aliquet, felis nisl adipiscing sapien, 
        sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam 
        arcu. 
        Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, 
        pretium ac, nisi. 
        Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac 
        habitasse platea dictumst.`;

    if (!lobbyName) {
        return text;
    } else {
        try {
            let lobbyText = (await axios({
                method: 'get',
                url: url + '/public/Lobbies/' + lobbyName,
            })).data.result['text'];
            text = lobbyText;
        } catch {
            text = `Error: failed to load lobby. Please try reloading!
                    PLEASE DO NOT TRY TYPING THIS!`
                    + text;
        }
    }
    return text;
}

async function createGameOverPrompt(currentWordNum, userTypedWords, originalWords, totalTimeMS) {
    let adjustedWPM = getAdjustedWPM(currentWordNum, userTypedWords, originalWords, totalTimeMS);
    
    $('#typing-section').append(`
        <div class="has-background-info has-text-white" id="results">
            Game over! Your raw WPM was ${$('#stats-wpm').text()}, 
            and accounting for mistyped words, your adjusted WPM was 
            ${adjustedWPM}, 
            in a total typing time of ${Math.round(totalTimeMS/1000)} seconds!
        </div>
    `);
    $('#user-input').prop('disabled', true);
    
    let updateProfileSuccessMessage = '';
    async function updateServerData() {
        try {
            let profile = (await axios({
                method: 'get',
                url: url + '/user/profile',
                headers: {
                    Authorization: "Bearer " + localStorage.jwt
                },
            })).data.result;
            
            let avgWPM = (profile['Average WPM'] * profile['Games Played']
                          + adjustedWPM) / (profile['Games Played'] + 1);
            let highestWPM = Math.max(profile['Highest WPM'], adjustedWPM);

            // Update user profile
            await axios({
                method: 'post',
                url: url + '/user/profile',
                headers: {
                    Authorization: "Bearer " + localStorage.jwt
                },
                data: {
                    data: {
                        "Games Played": (profile['Games Played'] + 1),
                        "Average WPM": avgWPM,
                        "Highest WPM": highestWPM
                    }
                }
            });

            // Update leaderboards; error tolerance allowed on this one.
            // This is a temporary hack accounting for the limitations of 
            // the provided comp426-backend, by making publicly 
            // viewable leaderboards be stored in the public store.
            let attempts = 0;
            let leaderboardsPostSuccess = false
            while (attempts < 5 && !leaderboardsPostSuccess) {
                try {
                    await axios({
                        method: 'post',
                        url: url + '/public/leaderboards/' + localStorage['typing-username'],
                        headers: {
                            Authorization: "Bearer " + localStorage.jwt
                        },
                        data: {
                            data: {
                                "Games Played": (profile['Games Played'] + 1),
                                "Average WPM": avgWPM,
                                "Highest WPM": highestWPM
                            }
                        }
                    });
                    leaderboardsPostSuccess = true;
                } catch {
                    attempts++;
                }
            }

            updateProfileSuccessMessage = `
                <div class="has-background-success" id="save-results-message">
                    <p class="has-text-weight-bold">
                        Results posted to server successfully!
                    </p>
                </div>
            `;
            return true;
        } catch {
            updateProfileSuccessMessage = `
                <div class="has-background-warning" id="save-results-message">
                    <p>
                        Error: failed to send game results to server!
                        Please hit the button to retry!
                    </p>
                    <br>
                    <button class="button" id="reupload-game-results-button">
                        Reupload Game Results
                    </button>
                </div>
            `;
            return false;
        }
    }

    if (!localStorage.jwt) {
        updateProfileSuccessMessage = `
            <div class="has-background-warning" id="save-results-message">
                It appears that you are not logged in. Next time, create 
                an account or log in to save your game results!
            </div>
        `;
    } else {
        await updateServerData();
    }

    $('#typing-section').append(updateProfileSuccessMessage);
    $('#reupload-game-results-button').on('click', async function() {
        let retryResult = await updateServerData();
        if (retryResult === true) {
            $('#save-results-message').replace(updateProfileSuccessMessage);
        }
    });

    // Reallow clicking the lobby button once the game has ended
    $('#lobby-button').css('pointer-events', 'auto');
}

function updateErrorDisplay(errorCount) {
    $('#stats-errors').html(errorCount);
}

function updateWPMDisplay(wpm) {
    $('#stats-wpm').html(wpm);
}

// Calculates WPM based purely on how many words have been typed so far 
// and the length of all those words
function getRawWPM(currentWordNum, originalWords, charNumOfWord, timeElapsedMS) {
    let charsTyped = charNumOfWord;
    originalWords.some(function(word, index) {
        if (index == currentWordNum) {
            return true;
        } else {
            charsTyped += word.length + 1;
            return false;
        }
    });
    return Math.round(charsTyped / 5 * 60 / (timeElapsedMS / 1000));
}

// Calculates WPM, but removing the character length of any incorrect words
// from the calculation.
function getAdjustedWPM(currentWordNum, userTypedWords, originalWords, timeElapsedMS) {
    let adjustedCharsTyped = 0;
    originalWords.some(function(word, index) {
        if (index == currentWordNum) {
            if (userTypedWords[index] == word.slice(0, 
                                            userTypedWords[index].length)) {
                adjustedCharsTyped += userTypedWords[index].length;
            }
            return true;
        } else {
            if (userTypedWords[index] == word) {
                adjustedCharsTyped += word.length;
            }
            adjustedCharsTyped += 1; // spaces never count as incorrect
            return false;
        }
    });
    return Math.round(adjustedCharsTyped / 5 * 60 / (timeElapsedMS / 1000));
}

export default async function loadTypingGame(lobbyName) {
    // Disable functions for any earlier games that had loaded
    $('#user-input').off();
    
    
    // Current settings are for word-based detection, 
    // as opposed to character-based detection
    let $input = $('#user-input');
    let $text = $('#text-to-type');
    $input.prop('disabled', false);
    
    let text = await getText(lobbyName);

    // Perform pre-processing on the text data
    let textWordsArray = text.split(' ').filter(function(word) {
        return word != ' ' && word != '' && word != '\n' && word != null;
    });
    let numTotalWords = textWordsArray.length;
    
    let textAsHTML = '';
    let counter = 0;
    for (let word of textWordsArray) {
        // Get rid of any new lines that may have stuck around
        let fixedWord = word.replace(/\r?\n|\r/g, '');
        textAsHTML += '<span id="' + counter + 'word">' + fixedWord + '</span>' + ' ';
        counter++;
    }
    loadTextToType(textAsHTML);

    // Prevent copy-and-pasting words, rather than typing them
    $input.on('cut paste', function(e) {
        e.preventDefault();
    });
    $input.on('keydown', function(e) {
        // Prevent movement with up and down keys
        if (e.which == 38 || e.which == 40) {
            e.preventDefault();
        }
        // Prevent movement with left and right arrow keys for now
        if (e.which == 37 || e.which == 39) {
            e.preventDefault();
        }
        // TODO: determine if home and end keys should also be disabled
    });

    // Variables required for game logic
    let charNumOfWord = 0;
    let globalCharNum = 0; // Not used for now
    let currentWordNum = 0;
    let typedWords = new Array(numTotalWords).fill('');
    let wordErrorNum = 0;
    let timer = null;
    let startTime = null;
    let endTime = null;
    let wpm = 0;
    let timeAllowedMS = 60000; // default 1 minute
    if (localStorage.jwt) {
        try {
            let settingsRequestResult = (await axios({
                method: 'get',
                url: url + '/user/settings',
                headers: { Authorization: "Bearer " + localStorage.jwt }
            })).data.result;

            timeAllowedMS = settingsRequestResult['Typing Duration']['value']
                                * 60 * 1000;
        } catch (e) {
            // Do nothing on failed HTTP request, 
            // keep time at default 1 minute
        }
    }

    function startCountdownTimer(allowedTime) {
        setTimeout(triggerGameOver, allowedTime);
        $input.off('keypress', startTimerHelper);
    
        // Set up timer
        $('#timer').html(`Remaining Time: ${allowedTime / 1000} seconds`);
        let stopAtTime = new Date().getTime() + allowedTime;
        timer = setInterval(function() {
            let now = new Date().getTime();
            let timeLeft = stopAtTime - now;
            $('#timer').html(`Remaining Time: 
                              ${Math.round(timeLeft / 1000)} seconds`);
            wpm = getRawWPM(currentWordNum, textWordsArray, charNumOfWord, now - startTime);
            updateWPMDisplay(wpm);
            if (timeLeft < 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
    
    function startTimerHelper() {
        $('#0word').addClass('currentWord');
        startTime = new Date().getTime();
        startCountdownTimer(timeAllowedMS);

        // In the interest of preventing bugs, disallow
        // switching lobbies while a game is in progress
        $('#lobby-button').css('pointer-events', 'none');
    }

    function triggerGameOver() {
        endTime = new Date().getTime();
        createGameOverPrompt(currentWordNum, 
                             typedWords, 
                             textWordsArray, 
                             endTime - startTime);
    }

    /*function startStopwatchTimer() {
        $('#user-input').off('keypress', startStopwatchTimer);
    
        $('#timer').html(`Time Elapsed: 0 seconds`);
        startTime = new Date().getTime();
        timer = setInterval(function() {
            let now = new Date().getTime();
            let timeElapsed = now - startTime;
            $('#timer').html(`Time Elapsed: 
                              ${Math.round(timeElapsed / 1000)} seconds`);
        }, 1000);
    }*/

    // Ready the game when someone starts typing
    $input.on('keypress', startTimerHelper);

    // Handle typing a character
    $input.on('keypress', function(e) {
        charNumOfWord++;
        globalCharNum++;

        let wordID = '#' + currentWordNum + 'word';

        // Handle typing space, which means we move to the next word
        if (e.which == 32) {
            // If no characters besides space have been typed,
            // do not go onto the next word
            if (typedWords[currentWordNum].replace(/\s+/g, '') == '') {
                typedWords[currentWordNum] += ' ';
                $text.find(wordID).addClass('icword');
                $input.addClass('ictextinput');
                if (charNumOfWord == 1) {
                    wordErrorNum++;
                }
            } else {
                // Handle case that previous word was typed incorrectly 
                // before moving onto the next
                if (typedWords[currentWordNum] 
                        != textWordsArray[currentWordNum]) {
                    $text.find(wordID).removeClass('cword').addClass('icword');
                    if (typedWords[currentWordNum] 
                        == textWordsArray[currentWordNum]
                            .slice(0, typedWords[currentWordNum].length)) {
                        wordErrorNum++;
                    }
                }

                $text.find(wordID).removeClass('currentWord')
                currentWordNum++;
                charNumOfWord = 0;
                $text
                    .find('#' + currentWordNum + 'word')
                    .addClass('currentWord');
                if (currentWordNum == numTotalWords) {
                    clearInterval(timer);
                    triggerGameOver();
                    $('#user-input').prop('disabled', true);
                }
            }

            updateErrorDisplay(wordErrorNum);
            return;
        }

        // Handle typing any other character besides space
        typedWords[currentWordNum] += String.fromCharCode(e.which);

        if (typedWords[currentWordNum] 
                == textWordsArray[currentWordNum]
                    .slice(0, typedWords[currentWordNum].length)) {
            // Correct word typed
            $text.find(wordID).removeClass('icword').addClass('cword');
            $input.removeClass('ictextinput');
        } else {
            // Incorrect word typed
            if (!$text.find(wordID).hasClass('icword')) {
                wordErrorNum++;
            }
            $text.find(wordID).removeClass('cword').addClass('icword');
            $input.addClass('ictextinput');
        }

        updateErrorDisplay(wordErrorNum);
        // TODO: handle pressing enter
    });
    
    // Handle pressing backspace
    $input.on('keydown', function(e) {
        if (e.which == 8) { // Backspace pressed
            charNumOfWord--;
            globalCharNum--;

            // Delete a character from what the user typed for the current word
            typedWords[currentWordNum] = typedWords[currentWordNum].slice(0, 
                typedWords[currentWordNum].length - 1);
            if (typedWords[currentWordNum] == undefined) {
                typedWords[currentWordNum] = '';
            }

            // Handle returning to the previous word we typed
            if (charNumOfWord < 0) {
                if (currentWordNum > 0) {
                    $text.find('#' + currentWordNum + 'word')
                         .removeClass(`currentWord
                                       icword
                                       cword`);
                    currentWordNum--;
                    charNumOfWord = typedWords[currentWordNum].length;
                    $text.find('#' 
                            + currentWordNum + 'word').addClass('currentWord');
                } else {
                    // Reached beginning of text, cannot go back any more
                    charNumOfWord = 0;
                }
            }

            let wordID = '#' + currentWordNum + 'word';
            if (typedWords[currentWordNum] 
                    == textWordsArray[currentWordNum].slice(0, 
                        typedWords[currentWordNum].length)) {
                // Backspace brought us back to a correct word or word part
                let wasIncorrect = $text.find(wordID).hasClass('icword');
                if (wasIncorrect) {
                    wordErrorNum--;
                }

                $text.find(wordID).removeClass('icword');
                if (typedWords[currentWordNum].length != 0) {
                    $text.find(wordID).addClass('cword');
                }
                $input.removeClass('ictextinput');
            } else {
                // Backspace brought us back to an incorrect word/word part
                $input.addClass('ictextinput');
            }
        }

        updateErrorDisplay(wordErrorNum);
    });

    // Auto-scroll the text to type.
    // Accuracy of scrolling is a work-in-progress.
    let linesScrolled = 0;
    let lastScrollTop = 0;
    $input.on('scroll', function(e) {
        let st = $(this).scrollTop();
        if (st > lastScrollTop) {
            linesScrolled++;
            if (linesScrolled > 2) {
                $text.scrollTop((linesScrolled - 2)*20);
            }
        } else if (st < lastScrollTop) {
            linesScrolled--;
            $text.scrollTop((linesScrolled - 2)*20);
        }
        lastScrollTop = st;
    });

    // Unfinished attempt at character-based detection,
    // which requires 100% accuracy of the end result typed
    // and counts errors differently
    /*
    let typedChars = 0;
    $input.on('keypress', function(e) {
        if (text.charCodeAt(charNumOfWord) == e.which) {
            $('body').append('<span style="color: red">good!</span>');
        }
        charNumOfWord++;
        typedChars++;
        $('.text-to-type').replaceWith(displayText.slice());
        if (typedChars == totalChars) {
            $input.prop('disabled', true);
        }
    });
    
    $input.on('keydown', function(e) {
        if (e.which == 8) { // Backspace
            if (charNumOfWord > 0) {
                charNumOfWord--;
                typedChars--;
            }
        }
    });*/
}