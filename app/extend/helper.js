'use strict';
const { SUCCESS, FAILED } = require('../constants');
function fail(message, data) {
  return response(FAILED, message, data);
}
function success(message, data) {
  return response(SUCCESS, message, data);
}
function response(code, message, data) {
  return {
    code,
    message,
    data,
  };
}
module.exports = {
  response,
  success,
  fail,
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = Object.assign(
      {},
      {
        timestamp: Date.now(),
      },
      metadata
    );

    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },
};
