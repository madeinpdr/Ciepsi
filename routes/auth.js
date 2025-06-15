const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register)

router.post('/forgot-password', authController.forgotPassword);

router.get('/register', authController.register)

router.post('/login', authController.login)

router.get('/login', (req, res) => res.render('index'));


module.exports = router;

