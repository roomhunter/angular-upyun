Angular Directive for Upyun
===========================

## Features

- [x] single document upload
- [x] multiple documents upload
- [x] drop and upload
- [ ] file type validation
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

It returns an array of URLs.

```js

$upyunUploader.uploadFiles(files, success, failed);


```


