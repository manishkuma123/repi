// multer.config.ts
import { MulterModuleOptions } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { s3 } from './aws-s3.config';

export const multerOptions: MulterModuleOptions = {
  storage: multerS3({
    s3: s3,
    bucket: 'devdymnd',
    acl: 'public-read',
    key: (request, file, cb) => {
      const filename = `${Date.now().toString()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
};
