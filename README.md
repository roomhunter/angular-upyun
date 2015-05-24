Angular Directive for Upyun
===========================

## Features

- [x] single document upload
- [x] multiple documents upload
- [x] drop and upload
- [x] file type validation
- [ ] file size restriction

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

#### Upload

`files` is an array of files.
`success` is a callback be passed the array of URLs.
`failed` is a callback be passed Error.

```js

$upyunUploader.uploadFiles(files, success, failed);


```


