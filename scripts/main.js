function loadTypingDisplay(text) {
    $('.text-to-type').text(text);
}

function getText() {
    let text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, 
        sunt in culpa qui officia deserunt mollit anim id est laborum.        

        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. 
        Nullam varius, turpis et commodo pharetra, est eros bibendum elit, 
        nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. 
        Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. 
        Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, 
        id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. 
        Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, 
        aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, 
        elit ut dictum aliquet, felis nisl adipiscing sapien, 
        sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. 
        Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. 
        Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.`;
    return text;
}

function loadTypingGame() {
    let text = getText();
    loadTypingDisplay(text);

    let totalChars = text.length;
    let currentChar = 0;
    let typedChars = 0;

    let $input = $('.typing-box');
    $input.on('cut paste', function(e) {
        e.preventDefault();
    })
    
    $input.on('keypress', function(e) {
        if (text.charCodeAt(currentChar) === e.which) {
            $('body').append('<span style="color: red">good!</span>');
        }
        currentChar++;
        typedChars++;
        if (typedChars === totalChars) {
            $input.prop('disabled', true);
        }
    });
    
    setTimeout(function() {
        $('body').append(`<section class="section">
            Game over! You typed ${(typedChars / 5)} words in 
            15 seconds! (Accuracy not guaranteed)
        </section>`);
        $input.prop('disabled', true);
    }, 15000);
}

$(document).ready(loadTypingGame());