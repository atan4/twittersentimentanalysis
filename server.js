"use strict";

// Setup/Start server and initialise socket.io
var express = require('express'),  
    app     = express(),
    port    = process.env.PORT || 3000,
    server  = app.listen(port),
    io      = require('socket.io').listen(server),
    languagedetect   = require('languagedetect'),
    sentiment        = require('sentiment'),
    languagedetector = new languagedetect(),
    config 	= require('./config.js');

// Require Twit libary
var Twit = require('twit');

// Initialise a new Twit instance using the credentials from your twitter application
var T = new Twit(  
{
  consumer_key: config.auth.key,
  consumer_secret: config.auth.consumer_secret,
  access_token: config.auth.access_token,
  access_token_secret: config.auth.access_token_secret
});

// Setup public directory
app.use(express.static(__dirname + '/public'));

//Setup socket.io functions passing through the socket.io & twit instances 
require('./socket.js')(io, T, languagedetector, sentiment);
// require('./')

app.get('/', function(req,res){
    res.sendFile('./public/index.html'); // Send index.html
});

// Setup default routes
// app.use('/', require('./routes/default'));

console.log('App listening on port ' + port);

// console.log("sentiment is: " + sentiment("I am so excited and happy, today is a beautiful and lovely day!!!!!!!!").score);