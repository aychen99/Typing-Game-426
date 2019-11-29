function loadTypingDisplay(text) {
    $('#typing-display-section').append(`
    <div class="typing-display">
        <div id="text-to-type">

        </div>
        <div class="field">
            <div class="control">
                <input 
                    class="input is-primary" 
                    type="text" 
                    placeholder="When ready, type in here to begin!"
                    spellcheck="false"
                    id="typing-box"></input>
            </div>
        </div>
    </div>`);
    $('#text-to-type').append(`<div>${text}</div>`);
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
    return text;
}

function startTimer() {
    $('#0word').addClass('currentWord');
    setTimeout(function() {
        $('body').append(`<section class="section">
            Game over! You typed ${0} words in 
            15 seconds! (Accuracy not guaranteed)
        </section>`);
        $('#typing-box').prop('disabled', true);
    }, 15000);
    $('#typing-box').off('keypress', startTimer);
}

function loadTypingGame() {
    let text = getText();

    // Perform pre-processing on the text data
    // let totalChars = text.length;
    let textWords = text.split(' ').filter(function(word) {
        return word != ' ' && word != '' && word != '\n' && word != null;
    });
    let totalWords = textWords.length;
    let displayText = ''

    let counter = 0;
    for (let word of textWords) {
        displayText += '<span id="' + counter + 'word">' + word + '</span>' + ' ';
        counter++;
    }

    loadTypingDisplay(displayText);

    // Prevent copy-and-pasting words, rather than typing them
    let $input = $('#typing-box');
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

        // `<span class=`
    });
    // When you type, you need to check that the letter is correct, and/or it is
    // a space.
    // If it is correct, then update the span for that particular letter
    // If it is not correct, then also update the span
    // If it is a space, then update the span
    
    $input.on('keydown', function(e) {
        if (e.which == 8) { // Backspace
            currentChar--;
            if (currentChar < 0) {
                currentWordIndex--;
                currentChar = typedWords[currentWordIndex].length - 1;
            }
            
            typedWords[currentWordIndex] = typedWords[currentWordIndex].slice(0, 
                                        typedWords[currentWordIndex].length - 1);

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

$(document).ready(loadTypingGame());