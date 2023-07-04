const db = require('../db/db.js'); // DB 모듈 require

module.exports = {
  items: {
    get: (callback) => {
      const queryString = `SELECT * FROM accounts`;
      db.query(queryString, (error, result) => {
        callback(error, result);
      });
    },
  },
  plan: {
    // 사입계획서 입력
    post: (values, callback) => {
      // template literal을 활용
      const queryString = `INSERT INTO plan (idUser, planDate, flower, unit)
                            VALUES (?, ?, ?, ?)`;
      db.query(queryString, values, (error, result) => {
        callback(error, result);
      });
    } 
  }
}
