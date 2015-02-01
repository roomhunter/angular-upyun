### Angular Directive for Upyun

## Usage

#### Directive

`file-select` and `ng-model`

```

<input type="file" file-select="fileSelected()" ng-model="theFile">

```

#### Config

```js

$upyunUploader.config({
  apiSecret: '1+JY2ZqD5UVfw6hQ8EesYQO50Wo=',
  dir: '/test',
  bucket: 'demonstration'
});

```

#### Add Files

```js

$upyunUploader.addFiles(files);


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