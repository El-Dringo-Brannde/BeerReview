//Define an angular module for our app

var homePage = angular.module('Brewster', ["ngRoute","ngFileUpload"]);

homePage.config(function ($routeProvider) {
    $routeProvider.when('/AddBeer', {
        templateUrl: './AddBeer.html',
        controller: 'addBeersController'
    }).when('/previousBeers', {
        templateUrl: './previousBeers.html',
        controller: 'previousBeersController'
    }).otherwise({
        redirectTo: 'base.html'
    });
});


homePage.controller('previousBeersController', function ($scope,$http) {
    $http.get('/getbeer').success(function(data) {
        $scope.Beers = data;
    });
});

homePage.controller('addBeersController', ['Upload', '$window', '$scope', '$http', function ( Upload,$window, $scope, $http) {

    $("#spinner").hide();
    console.log("I'm in add beer controller");

    var vm = $scope;

    $scope.submit = function () { //function to call on form submit
        console.log($scope.formData);
        $("#submitter").hide();
        $("#spinner").show();
        $scope.formData["Taste"] = $("#Taste").val();
        $scope.formData["Appearance"] = $("#Appearance").val();
        $scope.formData["Smell"] = $("#Aroma").val();
        $scope.formData["Rating"] = $("#RatingVal")[0].value;
        $scope.formData["BuyAgain"] = $("input:radio[name=buyAgain]:checked").val();

        if (vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    };
    $scope.formData = {};
    $http.get('/getbeer').success(function (data) {
        $scope.Beers = data;
    });
    vm.upload = function (file) {
        $http.post('/addbeer', $scope.formData);
        Upload.upload({
            url: 'http://71.237.206.200:3000/upload', //webAPI exposed to upload the file
            data: {
                Name: $scope.formData.BeerName,
                file: file
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            $scope.formData = {};
            $('#testing').removeAttr('src');
            $("#Taste")[0].value = "";
            $("#Aroma")[0].value = "";
            $("#Appearance")[0].value = "";
            alert("Beer successfully added!");
            $("#submitter").show();
            $("#spinner").hide();
        }, function (resp) { //catch error
            $window.alert('Error status: ' + resp.status);
            $("#submitter").show();
            $("#spinner").hide();
        });
    };


}]);
