const express = require('express')
const {register, login} = require('../controllers/auth')
const {getme} = require('../middleware/auth')
const router = express.Router();


const {protect} = require('../middleware/auth')

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getme);

module.exports = router;

