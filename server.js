
var config = require('./config/config');
var io = require('socket.io').listen(config.ioPort);
var http = require('https');
var express = require('express');
var app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname));

module.exports.app = app;
routes = require('./routes/routes');

app.listen(config.serverPort);
console.log('Listening on Port 3000');

var twitchAPI = 'https://api.twitch.tv/kraken/search/streams?limit=25&offset=0&q=';

io.sockets.on('connection', function(socket) {
    console.log('');
    socket.on('twitch:search', function(options) {
        var query = options.next != null ? options.next : twitchAPI + options.query;
        var request = http.get(query, function(res) {
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

    socket.on('twitch:play', function(stream){
        io.sockets.emit('play-stream', stream);
    });
});