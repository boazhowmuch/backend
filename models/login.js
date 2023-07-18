const db = require('../db/db.js'); // DB 모듈 require

module.exports = {
  login: {
    post: (username, password, callback) => {
      const queryString = 'SELECT * FROM ACCOUNTS WHERE username = ? AND password = ?';

      db.query(queryString, [username, password], (error, result) => {
        callback(error, result);
      });
    },
  }
}