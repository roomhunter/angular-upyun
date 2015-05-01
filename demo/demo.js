angular.module('upyunDemo', ['upyun', 'angular-loading-bar'])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 300;
  }])
  .controller('manualCtrl', ['upyunUploader', '$scope', function (upyunUploader, $scope){
    'use strict';

    upyunUploader.config({
      apiSecret: '8mho8WVV2eTt0PhmI9kCe8bfUi4=',
      dir: '/test',
      bucket: 'roomhunter-images'
    });

    $scope.fileSelected = function () {
      upyunUploader.uploadFiles($scope.files, function (results) {
        console.log(results);
      }, function (err, results){
        console.log(err);
        console.log(results);
      });
    };
  }]);

