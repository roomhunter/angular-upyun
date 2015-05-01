angular.module('upyun', [])
  .directive('upyunUpload', function () {

    function linkFn($scope, element, attrs, ngModel) {

      function processDragOverOrEnter(event) {
        if (event != null) {
          event.preventDefault();
        }
        event.dataTransfer.effectAllowed = 'copy';
        return false;
      }

      function dropFile(event) {
        if (event != null) {
          event.preventDefault();
        }
        //console.log(event.dataTransfer.files);
        changeFiles(event.dataTransfer.files);
      }

      function changeFiles(files) {
        ngModel.$setViewValue(files);
        $scope.$apply();
        $scope.$eval(attrs.fileSelect);
      }

      $scope.$watch(function () {
        return ngModel.$viewValue;
      }, function (value) {
        if (!value) {
          element.val("");

        }
      });
      /* Listeners registered to scopes and elements are automatically cleaned up when they are destroyed,
      but if you registered a listener on a service, or registered a listener on a DOM node that isn't being deleted,
      you'll have to clean it up yourself or you risk introducing a memory leak.
      */
      element.bind('dragover', processDragOverOrEnter);
      element.bind('dragenter', processDragOverOrEnter);
      element.bind('drop', dropFile);
      element.bind('change', function (event) {
        // set the ngModel value as the input files
        changeFiles(event.target.files);
      });
    }
    return {
      require: 'ngModel',
      restrict: 'A',
      link: linkFn
    };

  })
  .service('upyunUploader', ['$http', '$log', function ($http, $log, key) {

    'user strict';
    var self = this;
    self.queue = [];
    self.results = [];
    self.isBlocked = false;
    self.upyunConfigs = {
      'form_api_secret': '',
      params: {
        expiration: (new Date().getTime()) + 60,
        'save-key': '',
        'allow-file-type': 'jpg,jpeg,gif,png,pdf',
        'bucket': ''
      }
    };

    self.options = {
      concurrency: 3
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

    function setQueue(files) {
      if (!files)
        return;
      // for splice working
      self.queue = [];
      for (var i = 0; i < files.length; i++) {
        self.queue.push(files[i]);
      }
    }

    function uploadSome() {
      for (var i = 0; i < self.queue.length; i++) {
        if (self.activeUploads >= self.options.concurrency) {
          break;
        }
        if (self.queue[i].active)
          continue;
        uploadOneFile(self.queue[i]);
      }
    }

    function dequeFile(file){
      self.queue.splice(self.queue.indexOf(file),1);
    }

    function uploadOneFile(file) {
      // thread safe, js is single thread
      self.activeUploads += 1;
      file.active = true;
      var formData;
      formData = new window.FormData();
      self.upyunConfigs.params.expiration = (new Date().getTime()) + 60;

      // http://docs.upyun.com/api/form_api/#_2
      var policy = Base64.encode(JSON.stringify(self.upyunConfigs.params));
      var signature = SparkMD5.hash(policy + '&' + self.upyunConfigs['form_api_secret']);

      var apiendpoint = 'https://v0.api.upyun.com/' + self.upyunConfigs.params['bucket'];
      var imageHost = self.upyunConfigs.params['bucket'] + '.b0.upaiyun.com';
      var imageHttpHost = 'http://' + imageHost;
      var imageHttpsHost = 'https://' + imageHost;

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
          self.tasksNum -= 1;
          dequeFile(file);
          // load remained files if any
          uploadSome();
          self.results.push(imageHttpsHost + res.url);

          // finish all files
          if (self.tasksNum == 0) {
            self.isBlocked = false;
            self.success(self.results);
          }
        })
        .error(function() {
          self.queue = [];
          self.tasksNum = 0;
          self.isBlocked = false;
          self.failed(new Error('upload failed'), self.results);
        });

    }
    function uploadFiles(files, success, failed) {
      if (self.isBlocked) {
        failed(new Error('is blocked'));
        return;
      }
      if (files.length == 0) {
        failed(new Error('no file'));
        return;
      }
      self.tasksNum = files.length;
      self.results = [];
      self.isBlocked = true;
      setQueue(files);
      self.success = success || function(){};
      self.failed = failed || function(){};
      uploadSome();
    }
    return {
      config: config,
      uploadFiles: uploadFiles
    };
  }]);
