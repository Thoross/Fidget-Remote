'use strict';

var fidgetStream = angular.module('fidgetStream', ['btford.socket-io']).
config(['socketProvider', function(socketProvider) {
    var socket = io.connect('http://localhost:9876');
        socketProvider.ioSocket(socket);
}]);

fidgetStream.controller('searchController', ['$scope', 'socket', function($scope, socket) {
    $scope.streams = [];
    $scope.query  = '';

    $scope.search = function() {
        socket.emit('twitch:search', { query: $scope.query });
    };

    socket.on('twitch:search:success', function(searchResults) {
        $scope.streams = searchResults.streams;
    });
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