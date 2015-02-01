angular.module('upyun', [])
  .directive('fileSelect', function () {
    function link($scope, element, attrs, ngModel) {
      element.bind('change', function (event) {
        ngModel.$setViewValue(event.target.files);
        $scope.$apply();
      });

      $scope.$watch(function () {
        return ngModel.$viewValue;
      }, function (value) {
        if (!value) {
          element.val("");
        }
      });
    }
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        fileSelect: '='
      },
      link: link
    };

  })
  .service('upyunUploader', ['$http', '$log', function ($http, $log, key) {

    'user strict';
    var self = this;
    self.files = [];
    self.upyunConfigs = {
      'form_api_secret': '',
      params: {
        expiration: (new Date().getTime()) + 60,
        'save-key': '',
        'allow-file-type': 'jpg,jpeg,gif,png',
        'bucket': ''
      }
    };

    self.options = {
      concurrency: 2,
      success: function(){},
      failed: function(){}
    };

    self.activeUploads = 0;

    function config(configs) {
      if (!configs.dir) {
        $log('no dir specified in configs');
        return;
      }
      if (!configs.bucket) {
        $log('no bucket specified in configs');
        return;
      }
      if (!configs.apiSecret) {
        $log('no apiSecret specified in configs');
        return;
      }
      self.upyunConfigs.params['save-key'] = configs.dir + '/{filemd5}{.suffix}';
      self.upyunConfigs.params['bucket'] = configs.bucket;
      self.upyunConfigs['form_api_secret'] = configs.apiSecret;
    }

    function onSuccess(callback) {
      self.options.success = callback || function() {};
    }

    function onError(callback) {
      self.options.faild = callback || function() {};
    }

    function addFiles(files) {
      if (!files)
        return;
      for (var i = 0; i < files.length; i++) {
        self.files.push(files[i]);
      }
    }


    function startUpload() {
      for (var i = 0; i < self.files.length; i++) {
        if (self.activeUploads == self.options.concurrency) {
          break;
        }
        if (self.files[i].active)
          continue;
        uploadOneFile(self.files[i]);
      }
    }


    return {
      addFiles: addFiles,
      config: config,
      startUpload: startUpload,
      onSuccess: onSuccess,
      onError: onError
    };


    function removeFile(file){
      self.files.splice(self.files.indexOf(file),1);
    }

    function removeAll(){
      self.files.splice(0,self.files.length);
    }


    function getFilesArray() {
      return self.files;
    }

    function uploadOneFile(file) {
      self.activeUploads += 1;
      file.active = true;
      var formData;
      formData = new window.FormData();
      self.upyunConfigs.params.expiration = (new Date().getTime()) + 60;

      // http://docs.upyun.com/api/form_api/#_2
      var policy = Base64.encode(JSON.stringify(self.upyunConfigs.params));
      var signature = SparkMD5.hash(policy + '&' + self.upyunConfigs['form_api_secret']);

      var apiendpoint = 'http://v0.api.upyun.com/' + self.upyunConfigs.params['bucket'];
      var imageHost = 'http://' + self.upyunConfigs.params['bucket'] + '.b0.upaiyun.com';

      formData.append('file', file);
      formData.append('policy', policy);
      formData.append('signature', signature);

      $http.post(apiendpoint, formData, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .success(function (res) {
          self.activeUploads -= 1;
          removeFile(file);
          self.options.success(imageHost + res.url);
        })
        .error(function() {
          self.options.failed();
        });

    }
  }]);
