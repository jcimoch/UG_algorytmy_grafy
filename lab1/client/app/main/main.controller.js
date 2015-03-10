(function () {
  'use strict';
  angular.module('closestPointsApp')
    .controller('MainCtrl', function ($scope, $http) {
      $scope.awesomeThings = [];
      $http.get('/api/things/cp').success(function (awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        alert(JSON.stringify(awesomeThings));
      });
    });
}());
