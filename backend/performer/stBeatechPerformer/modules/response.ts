/* APIのレスポンスに関するモジュール */

/**
 * レスポンスを作成します
 * @param {number} statusCode ステータスコード
 * @param {Object} body レスポンスボディ
 * @return {Object} レスポンスのためのオブジェクト
 */
const createResponse = (statusCode: number, body: any): any => {
  const res = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(body),
  };
  return res;
};

export default {
  createResponse,
};
