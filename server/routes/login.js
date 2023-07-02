const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.js');

// 경로 지정
router.get('/', loginController.login.get)
router.post('/', loginController.login.post)



module.exports = router;

