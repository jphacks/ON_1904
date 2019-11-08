import request from 'request';

/**
 * request.getのPromiseラッパー
 * @param uri
 * @param options
 */
const get = (options: request.Options): Promise<any> => {
  const result = new Promise((resolve, reject) => {
    request.get(options, (err, res, body) => {
      if (!err) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
  return result;
};

/**
 * request.postのPromiseラッパー
 * @param options
 */
const post = (options: request.Options): Promise<any> => {
  const result = new Promise((resolve, reject) => {
    request.post(options, (err, res, body) => {
      if (!err) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
  return result;
};

export default {
  get,
  post,
};
