const db = require('../db/db.js'); // DB 모듈 require

module.exports = {
  items: {
    get: (callback) => {
      const queryString = `SELECT * FROM accounts`;
      db.query(queryString, (error, result) => {
        callback(error, result);
      });
    },
  }
}
