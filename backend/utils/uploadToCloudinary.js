import asyncHandler from 'express-async-handler';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

// eslint-disable-next-line arrow-body-style
export const cloudinarySingleUpload = asyncHandler((req, folderName) => {
  return new Promise((resolve, reject) => {
    const cldUploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(cldUploadStream);
  });
});

export const cloudinaryMultipleUpload = {};
