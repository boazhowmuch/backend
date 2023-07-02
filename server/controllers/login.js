var express = require('express');
const models = require('../models/login.js'); // models 모듈 require


module.exports = {
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
              const account_id = account.account_id;
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
  