let createError = require('http-errors'); // http 에러 처리용 모듈
let express = require('express'); // express 프레임워크를 사용하기 위한 모듈
let path = require('path'); // 프로젝트 내부에서, 파일들의 상대경로를  위한 모듈
let cookieParser = require('cookie-parser'); // 쿠키값을 다루기 위해 필요한 모듈
let logger = require('morgan'); // 로그를 보기 쉽게 찍기 위한 모듈

// 라우팅을 해줄 경로 설정
let indexRouter = require('./routes/index');
const http = require("http");

// 여기서 만든 app객체로 모든 요청·응답을 진행함
let app = express();

// 뷰 엔진으로 뭘 쓸지 정함. 우리는 ejs 사용.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app객체가 외부 모듈을 사용할 수 있도록 .use(모듈)을 해줌
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 요청이 '/'이라면 indexRouter으로 연결을 한다는 의미
// 위에서 설명했듯, indexRouter는 './routes/index'으로 설정되어있음
// 따라서 요청이 '/'이면 './routes/index'로 경로를 잡음
app.use('/', indexRouter);

// 404에러를 잡아내고 예외처리해줌
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// 호스트이름, 포트 설정
const hostname = '127.0.0.1';
const port = 3000;

// app객체를 실행할 server객체를 만듦
const server = http.createServer(app);

// hostname, port에 대해 server객체가 listen하기 시작함.
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

// 위에서 정한 app 객체를 모듈화하여 다른 파일들과 소통할 수 있도록 함.
module.exports = app;