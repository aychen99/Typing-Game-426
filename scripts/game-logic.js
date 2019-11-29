function loadTextToType(formattedText) {
    $('#text-to-type').html(formattedText);
}

function getText() {
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

        /* Gr8 b8, m8. I rel8, str8 appreci8, and congratul8. 
        I r8 this b8 an 8/8. Plz no h8, I’m str8 ir8. 
        Cre8 more, can’t w8. We should convers8, I won’t ber8, 
        my number is 8888888, ask for N8. No calls l8 or out of st8. 
        If on a d8, ask K8 to loc8. Even with a full pl8, 
        I always have time to communic8 so don’t hesit8 */
    return text;
}

function startTimer() {
    let allowedTime = 15000;
    $('#0word').addClass('currentWord');
    setTimeout(function() {
        $('body').append(`<section class="section">
            Game over! You typed ${0} words in 
            15 seconds! (Accuracy not guaranteed)
        </section>`);
        $('#user-input').prop('disabled', true);
    }, allowedTime);
    $('#user-input').off('keypress', startTimer);

    // Set up timer
    $('#timer').html(`Remaining Time: ${allowedTime / 1000} seconds`);
    let endTime = new Date().getTime() + allowedTime;
    let timer = setInterval(function() {
        let now = new Date().getTime();
        let timeLeft = endTime - now;
        $('#timer').html(`Remaining Time: ${Math.round(timeLeft / 1000)} seconds`);
        if (timeLeft < 0) {
            clearInterval(timer);
        }
    }, 1000);
}

export default function loadTypingGame() {
    let text = getText();

    // Perform pre-processing on the text data
    // let totalChars = text.length;
    let textWords = text.split(' ').filter(function(word) {
        return word != ' ' && word != '' && word != '\n' && word != null;
    });
    let totalWords = textWords.length;
    
    let formattedText = ''
    let counter = 0;
    for (let word of textWords) {
        formattedText += '<span id="' + counter + 'word">' + word + '</span>' + ' ';
        counter++;
    }

    loadTextToType(formattedText);

    // Prevent copy-and-pasting words, rather than typing them
    let $input = $('#user-input');
    let $text = $('#text-to-type');
    $input.on('cut paste', function(e) {
        e.preventDefault();
    })

    // Typing Test Logic
    let currentChar = 0;
    let currentWordIndex = 0;
    let typedWords = new Array(totalWords).fill('');
    // let numErrors = 0;

    $input.on('keypress', startTimer);

    // Word-based detection, as opposed to character-based detection
    $input.on('keypress', function(e) {
        typedWords[currentWordIndex] += String.fromCharCode(e.which);
        currentChar++;

        let wordID = '#' + currentWordIndex + 'word';
        if (e.which == 32) { // Handle pressing space, i.e. moving to next word
            // Handle pressing space if no other letters were typed yet
            if (currentChar == 0) {
                return;
            }
            
            console.log(wordID + '    ' + typedWords[currentWordIndex]);
            if (typedWords[currentWordIndex] 
                    != textWords[currentWordIndex] + ' ') {
                $text.find(wordID).removeClass('cword').addClass('icword');
            }

            $text.find(wordID).removeClass('currentWord')
            currentWordIndex++;
            $text.find('#' + currentWordIndex 
                                + 'word').addClass('currentWord');
            currentChar = 0;
            return;
        }

        if (typedWords[currentWordIndex] 
                == textWords[currentWordIndex].slice(0, 
                    typedWords[currentWordIndex].length)) {
            // Correct word typed
            $text.find(wordID).removeClass('icword').addClass('cword');
            $input.removeClass('ictextinput');
        } else {
            // Incorrect word typed
            $text.find(wordID).removeClass('cword').addClass('icword');
            $input.addClass('ictextinput');
        }
    });
    
    $input.on('keydown', function(e) {
        if (e.which == 8) { // Backspace
            // TODO: if the word was incorrect in the first place,
            // after we've gone back to the previous word,
            // Show it in the input box

            currentChar--;
            if (currentChar < 0 && currentWordIndex > 0) {
                currentWordIndex--;
                currentChar = typedWords[currentWordIndex].length - 1;
            }
            
            typedWords[currentWordIndex] = typedWords[currentWordIndex].slice(0, 
                                        typedWords[currentWordIndex].length - 1);
            if (typedWords[currentWordIndex] == undefined) {
                typedWords[currentWordIndex] = '';
            }

            let wordID = '#' + currentWordIndex + 'word';
            if (typedWords[currentWordIndex] 
                    == textWords[currentWordIndex].slice(0, 
                        typedWords[currentWordIndex].length)) {
                // Backspace brought us back to a correct word
                $text.find(wordID).removeClass('icword').addClass('cword');
                $input.removeClass('ictextinput');
            }
        }
    });

    // Unfinished attempt at character-based detection,
    // which requires 100% accuracy of the end result typed
    // and counts errors differently
    /*
    let typedChars = 0;
    $input.on('keypress', function(e) {
        if (text.charCodeAt(currentChar) == e.which) {
            $('body').append('<span style="color: red">good!</span>');
        }
        currentChar++;
        typedChars++;
        $('.text-to-type').replaceWith(displayText.slice());
        if (typedChars == totalChars) {
            $input.prop('disabled', true);
        }
    });
    
    $input.on('keydown', function(e) {
        if (e.which == 8) { // Backspace
            if (currentChar > 0) {
                currentChar--;
                typedChars--;
            }
        }
    });*/
}