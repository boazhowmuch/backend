var express = require('express');
const models = require('../models/login.js'); // models 모듈 require


module.exports = {

    // login의 GET,POST 메소드 담고 있음
    login: {
      get: (req, res) => {
        res.render('login', { msg: '' , title: 'Express'});
      },
      post: (req, res) => {
          // POST 요청에 대한 처리
          const { username, password } = req.body;
          let msg = '';

          models.login.post(username, password, (error, result) =>{

          if (error) {
              console.error(error);
              return res.status(500).send('Internal Server Error');
          }

          // 결과 확인 후 세션 생성 또는 로그인 실패 메시지 전송
          if (result.length > 0) {
              const account = result[0];
              
              // 이후에 jwt token등을 사용하게 되면, 현재 db에 저장된 id를 그것으로 대체해야 할듯
              const account_id = account.accId;
              const account_username = account.username;

              // 쿠키 정보를 일단 다음과 같이 담음 => 후에 jwt로그인 방식이 이용된다면, 변경
              const cookie_info = {
              loggedin: true,
              account_id: account_id,
              username: account_username,
              };

              res.cookie('info', JSON.stringify(cookie_info));
              res.redirect('/');
          } else {
              msg = 'Incorrect username/password!';
              res.render('login', { msg: msg });
          }
        });
        

      }

    }
  }
  