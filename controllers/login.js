var express = require('express');
const models = require('../models/login.js'); // models 모듈 require


module.exports = {

    // login의 GET,POST 메소드 담고 있음
    login: {
      get: (req, res) => {
        res.json({"msg" : "로그인 하세요"})
        // res.render('login', { msg: '' , title: 'Express'});
      },
      post: (req, res) => {
          // POST 요청에 대한 처리
          const { username, password } = req.body;
          console.log(req.body);
          console.log(username, password);

          let msg = '';
          console.log('로그인 시도 중');

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

              // console.log(cookie_info);
              res.cookie('info', JSON.stringify(cookie_info), 
              {
                sameSite: 'none',
                secure: true,
                domain: "c43-221-147-91-218.ngrok-free.app"
              }
              );
              // res.header('Access-Control-Allow-Origin', '172.30.1.9');
              // res.header('Access-Control-Allow-Credentials', 'true');
              msg = "로그인에 성공하였습니다.";
              res.json({message: msg});
              // res.redirect('/');
          } else {
              console.log(result);
              msg = '아이디 또는 비밀번호를 잘못 입력하였습니다.';
              res.json({message: msg});
              // res.render('login', { msg: msg });
          }
        });
        

      }

    }
  }
  