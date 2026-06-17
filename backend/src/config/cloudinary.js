import ImageKit from 'imagekit';
import config from './config.js';
import logger from './winston.logger.js';

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

const uploadFile = async (file, filename) => {
  try {
    const response = client.upload({
      file,
      fileName: filename,
      folder: 'Authenticate',
    });

    return response;
  } catch (error) {
    logger.error('File uploading Error');
    throw new Error({
      error: true,
      message: error.message,
    });
  }
};

const deleteFile = async (fileId) => {
  return client.deleteFile(fileId);
};

export default {
  uploadFile,
  deleteFile,
};
