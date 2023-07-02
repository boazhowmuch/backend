// app.js와 연결하기 위해 필요한 코드
var express = require('express');
var router = express.Router();
const mysql   = require("mysql");   // npm i mysql | yarn add mysql
// MySQL 연결
const db = mysql.createConnection({
    host: "127.0.0.1", // 호스트
    user: "root",      // 데이터베이스 계정
    password: "Uuu1234!@",      // 데이터베이스 비밀번호
    database: "FLOWER_DB",	// 사용할 데이터베이스
    port: "3306",
});

db.connect();
// app.js에서 언급했던, '/'요청이 오면 라우팅을 해주는 코드입니다.
router.get('/', function(req, res, next) {
  // req : ~~한 요청이 app.js에서 왔다.
  // res : 그래서 ~~한 응답을 보낸다.
  // res.render('응답을 할 경로', {변수명:'값'})
  //    응답을 할 경로로 index.ejs 혹은 index.js라고 하지 않은 이유는,
  //    app.js에서 선언했듯 뷰엔진으로 ejs를 사용하기로 정했기 때문임.
  //    따라서 index라고 작성해도 index.ejs로 전달됨
  res.render('index', { title: 'Express' });
});

router.get("/api/flowers", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const sqlQuery = "SELECT * FROM TRANS";
    db.query(sqlQuery, (err, result) => {
	    console.log(result);
        res.send(result);
    });
});

// 위에서 정한 router 객체를 모듈화하여 다른 파일들과 소통할 수 있도록 함.
module.exports = router;
