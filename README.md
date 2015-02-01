<<<<<<< HEAD
### Angular Directive for Upyun

## Usage

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