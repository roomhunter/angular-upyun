Angular Directive for Upyun
===========================

## Usage

#### Directive

`file-select` and `ng-model`

```

<input type="file" file-select="fileSelected()" ng-model="files">

```

#### Config

```js

$upyunUploader.config({
  apiSecret: '1+JY2ZqD5UVfw6hQ8EesYQO50Wo=',
  dir: '/test',
  bucket: 'demonstration'
});

```

#### Set Files

```js

$upyunUploader.setFiles(files);


```

#### Upload

```js

$upyunUploader.startUpload();


```

#### Callback

```js

$upyunUploader.onSuccess(function(url) {
  $scope.image = {};
  $scope.image.url = url;
  $scope.image.ready = true;
});

```

## Tasks

- [x] single document upload
- [x] multiple documents upload
- [ ] drop and upload