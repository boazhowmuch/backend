//    routes/items.js
const router = require('express').Router();
const controller = require('./../controllers');

router.get('/', controller.items.get); // API 경로에 해당하는 컨트롤러를 연결

module.exports = router;