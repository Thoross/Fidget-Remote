'use strict';
var fidgetStream = angular.module('fidgetStream', ['btford.socket-io','infinite-scroll']).
config(['socketProvider', function(socketProvider) {
    var socket = io.connect('http://localhost:3001');
        socketProvider.ioSocket(socket);
}]);

fidgetStream.controller('searchController', ['$scope', 'socket', function($scope, socket) {
    $scope.streams = [];
    $scope.query  = '';
    $scope.loading = false;


    $scope.search = function() {
        $scope.streams = [];
        socket.emit('twitch:search', { query: $scope.query });
    };

    $scope.play = function(){
        console.log("$scope.play: "+ $scope.name);
        socket.emit('twitch:play', {stream: $scope.name})
    };

    socket.on('twitch:search:success', function(searchResults) {
        $scope.loading = false;
        $scope.streams.push.apply($scope.streams, searchResults.streams);
        $scope.nextQuery = searchResults.streams.length > 0 ? searchResults._links.next : null;
        console.log('$scope.streams: '+$scope.streams.length);
        console.log('$scope.nextQuery: '+$scope.nextQuery);

    });

    $scope.loadNext = function() {
        if ($scope.nextQuery) {
            $scope.loading = true;
            socket.emit('twitch:search', { next: $scope.nextQuery });
        }
    }

    $scope.$on('play', function(event, name){
        $scope.name = name;
        $scope.play();
    });
}]);

fidgetStream.directive('twitchStream', ['socket',function(socket) {
    return {
        restrict: 'E',
        scope: {
            stream: '=stream'
        },
        templateUrl: '/js/templates/twitchStream.html',
        link: function(scope, element, attrs){
            element.bind('click', function(){
                socket.emit('twitch:play', {stream: scope.stream.channel.display_name});
            });
        }
    }
}]);

fidgetStream.controller('screenController', ['$scope','socket',function($scope, socket){
    $scope.channel = {};
    $scope.channel.name = '';
    $scope.loaded = false;
    $scope.channel.objectData = '';
    $scope.channel.flashVars = '';

    socket.on('play-stream',function(stream){
        $scope.$apply(function(){
            $scope.channel.name = stream.stream;
            $scope.channel.objectData = 'http://www.twitch.tv/widgets/live_embed_player.swf?channel='+ $scope.channel.name;
            $scope.channel.flashVars = 'hostname=www.twitch.tv&channel=' + $scope.channel.name + '&auto_play=true&start_volume=25';
            $scope.loaded = true;
            console.log('$scope.channel: '+$scope.channel);
            console.log('$scope.loaded: '+ $scope.loaded);
        });
    });

}]);

fidgetStream.directive('screen', [function(){
    return {
        restrict:'E',
        scope:{
          channel: '=channel'
        },
        templateUrl: '/js/templates/screen.html'
    };
}]);