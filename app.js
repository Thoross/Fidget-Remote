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
        console.log("I'm in the play function.");
        socket.emit('twitch:play', {channel_name: $scope.name})
    };

    socket.on('twitch:search:success', function(searchResults) {
        $scope.loading = false;
        $scope.streams.push.apply($scope.streams, searchResults.streams);
        $scope.nextQuery = searchResults.streams.length > 0 ? searchResults._links.next : null;
        console.log('$scope.streams: '+$scope.streams);
        console.log('$scope.nextQuery: '+$scope.nextQuery);

    });

    $scope.loadNext = function() {
        if ($scope.nextQuery) {
            $scope.loading = true;
            socket.emit('twitch:search', { next: $scope.nextQuery });
        }
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