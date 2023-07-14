const db = require('../db/db.js'); // DB 모듈 require

module.exports = {

  plan: {
    // 사입계획서 조회
    check: (values, callback) => {
        const queryString = `SELECT planDate, flower, unit FROM PLAN
        WHERE userId = ? and planDate = ?`;
      db.query(queryString, values, (error, result) => {
        callback(error ,result);
      })
    },
    // 사입계획서 입력
    create: (values, callback) => {
      // template literal을 활용

      const queryString = `INSERT INTO PLAN (userId, planDate, flower, unit)
                            VALUES (?, ?, ?, ?)`;
      db.query(queryString, values, (error, result) => {
        console.log(error);
        callback(error, result);
      });
    } 
  },

  price: {
    // 가격 조회
    check: (values, callback) => {
        const queryString = `SELECT goodName, lvNm, maxAmt, minAmt, avgAmt FROM TRAN
         WHERE saleDate = ? and pumName = ?`;
      db.query(queryString, values, (error, result) => {
        callback(error ,result);
      })
    },

  }
}
