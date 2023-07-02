const models = require('../models'); // models 모듈 require

module.exports = {
  items: {
    get: (req, res) => {
      const cookieInfo = req.cookies.info;
      if (cookieInfo) {
        // 쿠키 값을 객체로 변환
        const cookieData = JSON.parse(cookieInfo);
        if (cookieData.loggedin) {
          // 사용자가 로그인 상태인 경우
          return res.render('index', { username: cookieData.username });
        }
      }
    
      // 사용자가 로그인되지 않은 경우
      return res.redirect('/login');
    },
  }
}
