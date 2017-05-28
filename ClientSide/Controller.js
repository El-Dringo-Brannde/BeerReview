angular.module('fileUpload', ['ngFileUpload']).controller('MyCtrl', ['Upload', '$window', '$scope', '$http', function(Upload, $window, $scope, $http) {
    var vm = $scope;

    vm.submit = function() { //function to call on form submit
        console.log($scope.formData);
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
    $http.get('/getbeer').success(function(data) {
        console.log(data);
        $scope.Beers = data;
    });

    vm.upload = function(file) {
        console.log($scope.formData);
        $http.post('/addbeer', $scope.formData);

        Upload.upload({
            url: 'http://71.237.206.200:3000/upload', //webAPI exposed to upload the file
            data: {
                Name: $scope.formData.BeerName,
                file: file
            } //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            $scope.formData = {};
            $("#Taste")[0].value="";
            $("#Aroma")[0].value="";
            $("#Appearance")[0].value="";


            /*     $http.get('/getbeer').success(function(data) {
                     $scope.Beers = data;
                 })
                */
            alert("Beer successfully added!");
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt); // showing percentage
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
