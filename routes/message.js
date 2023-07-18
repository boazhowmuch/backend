const router = require('express').Router();
const controller = require('../controllers/message');

router.get('/', controller.home.get);
router.post('/send_message', controller.message.post);


module.exports = router;