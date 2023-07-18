var express = require('express');
// const models = require('../models/logout.js'); // models 모듈 require


module.exports = {

    // login의 GET,POST 메소드 담고 있음
    logout: {

      post: (req, res) => {

        // 쿠키 제거
        res.clearCookie('info');

        // login홈페이지로 redirect
        res.redirect('/login');
              
      }

    }
  }
  