var io = require('socket.io').listen(3001);
var http = require('https');
var express = require('express');
var app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

module.exports.app = app;
routes = require('./routes/routes');

app.listen('3000');
console.log('Listening on Port 3000');

var twitchAPI = 'https://api.twitch.tv/kraken/search/streams?limit=25&offset=0&q=';

io.sockets.on('connection', function(socket) {
    socket.on('twitch:search', function(options) {
        var request = http.get(twitchAPI + options.query, function(res) {
            var responseBody = '';

            res.on("data", function(chunk){
                responseBody += chunk;
            });

            res.on('end', function() {
                socket.emit('twitch:search:success', JSON.parse(responseBody));
            });
        });

        request.on('error', function(e) {
            socket.emit('twitch:search:error', e);
        });
    });
});