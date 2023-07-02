const mysql = require("mysql");
const fs = require('fs');

// 파일 동기적으로 읽기
const data = fs.readFileSync('conf/db_info.txt', 'utf8');

// 줄 단위로 분할
const lines = data.split('\n');

// 각 줄에서 정보 추출
const dbInfo = {};
lines.forEach((line) => {
  const parts = line.trim().split('=');
  if (parts.length === 2) {
    const key = parts[0].trim();
    const value = parts[1].trim();

    if (key === "port") {
      dbInfo[key] = Number(value);
    } else {
      dbInfo[key] = value;
    }
  }
});

// MySQL 연결
const db = mysql.createConnection({
  host: dbInfo["host"],        // 호스트
  user: dbInfo["user"],        // 데이터베이스 계정
  password: dbInfo["password"], // 데이터베이스 비밀번호
  database: dbInfo["database"], // 사용할 데이터베이스
  port: dbInfo["port"],
});

// 연결 시도
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 연결되었습니다.');

});

module.exports = db;
