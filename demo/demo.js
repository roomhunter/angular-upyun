angular.module('upyunDemo', ['upyun', 'angular-loading-bar'])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 300;
  }])
  .controller('manualCtrl', ['upyunUploader', '$scope', function (upyunUploader, $scope){
    'use strict';

    upyunUploader.config({
      apiSecret: '9TiB5OGqDNaPGQDn4AS3528M+u8=',
      dir: '/test',
      bucket: 'roomhunter-test'
    });
    upyunUploader.onSuccess(function(httpsUrl, httpUrl) {
      $scope.image = {};
      $scope.image.url = httpUrl;
      $scope.image.ready = true;
      $scope.theFile = null;
      console.log(httpUrl);
    });

    $scope.uploadClicked = function () {
      upyunUploader.startUpload();
    };

    $scope.fileSelected = function () {
      upyunUploader.setFiles($scope.files);
      console.log($scope.files);
    };

  }])
  .controller('dropzoneCtrl', ['upyunUploader', '$scope', function (upyunUploader, $scope){

  }]);
