angular.module('upyunDemo', ['upyun', 'angular-loading-bar'])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 300;
  }])
  .controller('manualCtrl', ['upyunUploader', '$scope', function (upyunUploader, $scope){
    'use strict';

    upyunUploader.config({
      apiSecret: '1+JY2ZqD5UVfw6hQ8EesYQO50Wo=',
      dir: '/test',
      bucket: 'demonstration'
    });
    upyunUploader.onSuccess(function(url) {
      $scope.image = {};
      $scope.image.url = url;
      $scope.image.ready = true;
      $scope.theFile = null;
      console.log('su');
    });

    $scope.uploadClicked = function () {
      upyunUploader.startUpload();
    };

    $scope.fileSelected = function () {
      upyunUploader.addFiles($scope.files);
      console.log($scope.files);
    };

  }])
  .controller('dropzoneCtrl', ['upyunUploader', '$scope', function (upyunUploader, $scope){

  }]);
