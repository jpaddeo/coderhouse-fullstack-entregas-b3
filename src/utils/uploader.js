import multer from 'multer';

import { __dirname } from './config.js';

const imagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../../public/pets`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const documentsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../../public/documents`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageUploader = multer({ storage: imagesStorage });
const documentsUploader = multer({ storage: documentsStorage });

export { imageUploader, documentsUploader };
