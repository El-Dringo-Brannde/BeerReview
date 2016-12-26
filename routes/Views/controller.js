var BeerApp = angular.module('BeerApp', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $http.get('/addbeer').success(function(data) {
        $scope.Beers = data;
    });


    $scope.AddBeer = function() {
        $http.post('/addbeer', $scope.formData);
        setTimeout(2000);
        $scope.formData = {};
        $http.get('/addbeer').success(function(data) {
            $scope.Beers = data;
        });
    }
}
