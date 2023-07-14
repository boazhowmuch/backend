const express = require('express');

const router = express.Router();
const messageRouter = require('./message');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const webhookRouter = require('./webhook');




// 경로 지정
router.use('/', messageRouter)
router.use('/send_message', messageRouter);
router.use('/webhook', webhookRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);



module.exports = router;