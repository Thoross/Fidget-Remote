'use strict';
var config = require('./config/config');
var fidgetStream = angular.module('fidgetStream', ['btford.socket-io','infinite-scroll']).
config(['socketProvider', function(socketProvider) {
    var socket = io.connect();
        socketProvider.ioSocket(socket);
}]);

fidgetStream.controller('searchController', ['$scope', 'socket', function($scope, socket) {
    $scope.streams = [];
    $scope.query  = '';
    $scope.nextQuery = '';


    $scope.search = function() {
        $scope.streams = [];
        socket.emit('twitch:search', { query: $scope.query, next: null });
    };

    $scope.play = function(){
        console.log("I'm in the play function.");
        socket.emit('twitch:play', {channel_name: $scope.name})
    };

    socket.on('twitch:search:success', function(searchResults) {
        $scope.streams.push.apply($scope.streams, searchResults.streams);
        $scope.nextQuery = searchResults._links.next;
        console.log('$scope.streams: '+$scope.streams);
        console.log('$scope.nextQuery: '+$scope.nextQuery);

    });

   $scope.loadNext = function(){
        if($scope.query != '')
            socket.emit('twitch:search',{query: $scope.query, next: $scope.nextQuery});
    }
}]);

fidgetStream.directive('twitchStream', [function() {
    return {
        restrict: 'E',
        scope: {
            stream: '=stream'
        },
        templateUrl: '/js/templates/twitchStream.html'
    }
}]);

fidgetStream.controller('screenController', ['$scope','socket',function($scope, socket){
    $scope.stream = '';

    socket.on('play-screen',function(stream){
        $scope.stream = stream;
    });
}]);

fidgetStream.directive('screen', [function(){
    return {
        restrict:'E',
        scope:{
          stream: '=stream'
        },
        templateUrl: '/js/screen.html'
    };
}]);