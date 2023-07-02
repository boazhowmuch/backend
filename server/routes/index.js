const express = require('express');

const router = express.Router();
const itemsRouter = require('./items');
const loginRouter = require('./login');


// 경로 지정
router.use('/', itemsRouter);
router.use('/login', loginRouter);

module.exports = router;