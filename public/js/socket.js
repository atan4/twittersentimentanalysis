(function (window, document){

    //new socket connection
    var socket = io.connect();

    // DOM references
    var keywordInput  = document.querySelector('[data-input-keyword]'),
        keywordSubmit = document.querySelector('[data-submit-keyword]'),
        keywordText   = document.querySelector('[data-text-keyword]');

    //-----------------------------------------------------------------------------------
    // Setup event listeners for the socket which are passed FROM the server
    //-----------------------------------------------------------------------------------
    socket.on('connection', function (currentKeyword) { //socket has successfully connected
        console.log("THIS IS A MESSAGE COMING FROM SOCKET.JS");
        keywordSubmit.disabled = false; // Remove the disabled attribute from the keyword submit button
    });

    //-----------------------------------------------------------------------------------
    // Socket receives a new tweet
    //-----------------------------------------------------------------------------------
    socket.on('twitter-stream', function (tweet){   
        var roundAverage = Math.round(tweet.totalAverage * 100) / 100;
        document.getElementById('text-populate').innerHTML = tweet.text;
        document.getElementById('average').innerHTML = roundAverage;

        console.log('Tweet number: ' + tweet.num);
        var stringNumTweet = '# of Tweets: ' + tweet.num;
        $('#num-tweet').html(stringNumTweet);

        console.log('The average sentiment is: ' + roundAverage);
        var stringSent;

        //Adds a + sign in order to keep sentiment alignment consistent, fixes to 2 decimals
        if (roundAverage >= 0){
            stringSent = 'Sentiment: +' + roundAverage.toFixed(2);
        } else{
            var stringSent = 'Sentiment: ' + roundAverage.toFixed(2);
        }

        $('#sent-score').html(stringSent);

        console.log('I am initiating needle: ' + drawNeedle());
    });

    //-----------------------------------------------------------------------------------
    // Keyword has been changed
    //-----------------------------------------------------------------------------------
    socket.on('keyword-changed', function (keyword) {

        //Launches data viz screen if the user inputs a keyword. Makes sure that before screen is not 
        if ((keyword != '') && ($('#choose-search').hasClass('before-search'))){
            $('#choose-search').toggleClass('before-search after-search');
            console.log("toggled to after with keyword " + keyword);

            $('#show-results').toggleClass('before after');
            console.log("toggled to after with keyword " + keyword);

            $('#nav').hide();
        }
        //Post to restart. Likely not going to be the final version update: probably not necessary. 
        //many potential cases that exploit this toggle:

        else if ((keyword == '') && ($('#choose-search').hasClass('after-search'))){
            $('#show-results').toggleClass('after before');
            console.log("toggled to before with keyword " + keyword);

            $('#choose-search').toggleClass('after-search before-search');
            console.log("toggled to after with keyword " + keyword);

            $('#nav').show();
        }

        $('#name-input').html(keyword);

        keywordInput.value = ''; // Remove any current value in the input field
    });   

    //-----------------------------------------------------------------------------------
    // Setup event listeners that will pass data FROM the socket TO the server
    //-----------------------------------------------------------------------------------
    keywordInput.addEventListener('keypress', function (e){ //on enter (still requires submit button to exist)
        if (e.keyCode == 13) {
            $('#num-tweet').html("# of tweets: 0");
            $('#sent-score').html("sentiment: +0.00");

            e.preventDefault(); // Prevent default actions
            socket.emit('keyword-change', keywordInput.value); // Emit a message to the server requesting the keyword be changed to the inputs current value
        }   
    }, false);
 
}(window, document));