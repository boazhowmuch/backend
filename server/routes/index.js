const express = require('express');

const router = express.Router();
const itemsRouter = require('./items');
const loginRouter = require('./login');
const logoutRouter = require('./logout');



// 경로 지정
router.use('/', itemsRouter);
router.use('/send_message', itemsRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);


module.exports = router;