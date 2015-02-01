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
  apiSecret: '8mho8WVV2eTt0PhmI9kCe8bfUi4=',
  dir: '/test',
  bucket: 'roomhunter-images'
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