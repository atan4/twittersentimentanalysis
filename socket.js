var stream           = null, // Define global stream holder as we will only ever have ONE active stream  
    currentKeyword   = null, // Hold the current keyword we are streaming
    currentSockets   = 0, // Counter to determine number of open currentSocket
    totalScore       = 0, // Total sentiment score
    numTweets        = 0; // Keeps count of number of tweets in stream
    avg          = 0; // Keeps count of the avg sentiment score.

module.exports = function (io, twit, languagedetect, sentiment){

    function createStream (keyword){
        // Defines a new stream tracked by the keyword
        var stream = twit.stream('statuses/filter', {track : keyword}); 
        // When the stream gets a tweet
        stream.on('tweet', function (data) { 
            //Define a new object with the information we want to pass to the client
            var tweet = {"text" : data.text, "totalAverage" : avg, "num" : numTweets}; 
            //only streams non-retweet tweets
            if (!(tweet.text[0] == 'R' && tweet.text[1] == 'T')){
                //only tracks tweets that are english
                var lang = languagedetect.detect(tweet.text)[0][0];
                // console.log("language of this tweet is: " + lang);
                if (lang == 'english'){
                    numTweets ++;
                    io.sockets.emit('twitter-stream', tweet); // Emit our new tweet to ALL connected clients
                    console.log(tweet.text);
                    console.log("Number of tweets: " + numTweets);

                    //logs the sentiment score of each tweet
                    var score = sentiment(tweet.text).score;
                    console.log("SENTIMENT SCORE IS: " + score);
                    totalScore += score;
                    //calculates the average of all sentiment
                    avg = totalScore / numTweets;
                    tweet.totalAverage = avg;
                    tweet.num = numTweets
                    console.log("Current sentiment average is: " + tweet.totalAverage + " out of " + tweet.num + " tweets \n");
                }
            }
        });

        // Log a new connection to the stream
        stream.on('connect', function () {
            console.log('Connected to twitter stream using keyword => ' + keyword);
            numTweets = 0; // Number of tweets in the stream is reset to 0
            totalScore = 0;
            avg = 0;
        }); 

        // Log a disconnection from the stream
        stream.on('disconnect', function (){
            console.log('Disconnected from twitter stream using keyword => ' + keyword);
        });

        return stream; // Return the stream
    }


    //-----------------------------------------------------------------------------------
    // Helper function returns avg
    //-----------------------------------------------------------------------------------
    function getavg(){
        return avg;
    }

    //-----------------------------------------------------------------------------------
    // On a new client connection
    //-----------------------------------------------------------------------------------
    io.sockets.on('connection', function (socket) {    
        currentSockets++; // Increase the current sockets counter
        socket.emit('connected', currentKeyword); // Emit an event to THIS client passing the current keyword in case we are already up and running
        console.log('Socket Connected'); // Log a message 

        // If our currentKeyword has a value and we have no running stream 
        if (currentKeyword !== null && stream === null){                                               
            // we assume all clients had disconnected, so let's restart our stream based on the last active keyword
            stream = createStream(currentKeyword);
        }

        // On a socket disconnection
        socket.on('disconnect', function () {
            currentSockets--; // Decrease the current sockets counter
            console.log('Socket Disconnected'); // Log a message

            // If the stream is running and we now have no connected clients
            if (stream !== null && currentSockets <= 0){   
                stream.stop(); // Stop the stream
                stream = null; // Reset the stream holder back to null
                currentSockets = 0; // Reset the current sockets counter
                console.log('No active sockets, disconnecting from stream'); // Log a message
            }
        });

        // On a keyword change request from the client
        socket.on('keyword-change', function (keyword){  
            // If the stream is currently running  
            if (stream !== null){   
                stream.stop(); // Stop the current stream
                console.log('Stream Stopped'); // Log a message
            }



            stream = createStream(keyword); // Create a new stream using the keyword passed from the client

            currentKeyword = keyword; // Set the currentKeyword holder to the passed keyword

            io.sockets.emit('keyword-changed', currentKeyword); // Emit an event to ALL clients passing through the new keyword

            console.log('Stream restarted with keyword => ' + currentKeyword); // Log a message
 
        });
    });
}


