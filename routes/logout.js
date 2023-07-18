const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logout.js');

// 경로 지정
router.post('/', logoutController.logout.post)




module.exports = router;

