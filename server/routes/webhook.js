const router = require('express').Router();
const controller = require('../controllers/webhook.js');

router.post('/', controller.webhook.post);

module.exports = router;