var io = require('socket.io').listen(9876);
var http = require('https');

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