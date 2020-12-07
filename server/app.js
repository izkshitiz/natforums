const express = require('express');
const app = express();
const Auth = require('./auth/Auth');
let fs = require('fs');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const graphqlSchema = require('./graphql/Schema');
const graphqlResolver = require('./graphql/Resolvers');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const mediaMaxSize = 500000 //in Bytes ~ 500 KB
const fileMaxSize = 1000000 //in Bytes ~ 1 MB

//Media storage location depending on extension of file
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/bmp') {
      if (!fs.existsSync('public/images')) {
        fs.mkdirSync('public/images', { recursive: true });
      }
      cb(null, 'public/images')
    } else if (file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/x-flv' ||
      file.mimetype === 'video/mpeg' ||
      file.mimetype === 'video/webm') {
      if (!fs.existsSync('public/videos')) {
        fs.mkdirSync('public/videos', { recursive: true });
      }
      cb(null, 'public/videos')
    } else {
      cb({ error: 'Mime type not supported' })
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

//Types of media files you want to accept on the server
const mediaFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/bmp' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/x-flv' ||
    file.mimetype === 'video/mpeg' ||
    file.mimetype === 'video/webm'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//File storage location depending on extension of file
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.ms-powerpoint') {
      if (!fs.existsSync('public/documents')) {
        fs.mkdirSync('public/documents', { recursive: true });
      }
      cb(null, 'public/documents')
    } else if (file.mimetype === 'application/java-archive' ||
      file.mimetype === 'application/vnd.rar' ||
      file.mimetype === 'application/x-7z-compressed' ||
      file.mimetype === 'application/vnd.android.package-archive') {
      if (!fs.existsSync('public/others')) {
        fs.mkdirSync('public/others', { recursive: true });
      }
      cb(null, 'public/others')
    } else {
      cb(null, false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

//Types of files you want to accept on the server
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/vnd.ms-powerpoint' ||
    file.mimetype === 'application/java-archive' ||
    file.mimetype === 'application/vnd.rar' ||
    file.mimetype === 'application/x-7z-compressed' ||
    file.mimetype === 'application/vnd.android.package-archive'
  ) {
    cb(null, true);
  } else {
    cb({ error: 'Mime type not supported' });
  }
};



let uploadMedia = multer({ storage: mediaStorage, limits: { fileSize: mediaMaxSize }, fileFilter: mediaFilter });


let uploadFile = multer({ storage: fileStorage, limits: { fileSize: fileMaxSize }, fileFilter: fileFilter });


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(Auth);

const authCheck = (req, res, next) => {

  if (!req.isAuth) {
    throw new Error('Not authenticated!');
  }

  next();
}

app.use(express.static(path.join(__dirname, '/public')));

app.post('/mediaUpload', authCheck, uploadMedia.single("media"), (req, res, next) => {

  if (!req.file) {
    return res.status(200).json({ message: 'file not uploaded!' });
  }

  return res.status(201).json({ message: 'Media uploaded.', filePath: req.file.path, alt: req.file.originalname });
});

app.post('/fileUpload', authCheck, uploadFile.single("file"), (req, res, next) => {

  if (!req.file) {
    return res.status(200).json({ message: 'file not uploaded!' });
  }

  return res
    .status(201)
    .json({ message: 'Media uploaded.', filePath: req.file.path, name: req.file.originalname });
});

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  customFormatErrorFn(error) {
    if (!error.originalError) {
      return error;
    }
    const data = error.originalError.data;
    const message = error.message || 'An error occurred.';
    const code = error.originalError.code || 500;
    return { message: message, status: code, data: data };
  }
})
);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_DB_URI || 'mongodb://localhost/nat?retryWrites=true',
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(result => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(error => console.log(error));


