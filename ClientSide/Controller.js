angular.module('fileUpload', ['ngFileUpload']).controller('MyCtrl', ['Upload', '$window', '$scope', '$http', function(Upload, $window, $scope, $http) {
    var vm = $scope;

    vm.submit = function() { //function to call on form submit
        console.log(vm.file);
        if (vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function

        }
    }

    $scope.formData = {};
    $http.get('/addbeer').success(function(data) {
        $scope.Beers = data;
    });

    vm.upload = function(file) {
        $http.post('/addbeer', $scope.formData);

        console.log(JSON.stringify($scope.formData));
        Upload.upload({
            url: 'http://71.237.206.200:3000/upload', //webAPI exposed to upload the file
            data: {
                Name: $scope.formData.BeerName,
                file: file
            } //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');

                $scope.formData = {};
                $http.get('/addbeer').success(function(data) {
                    $scope.Beers = data;
                });
            } else {
                $window.alert('an error occured');
            }
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
