var Promise = require('./bluebird.js');

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res);
      };

      obj.fail = function (err) {
        reject(err);
      };

      fn(obj);
    });
  };
}

module.exports = {
  wxPromisify: wxPromisify
};