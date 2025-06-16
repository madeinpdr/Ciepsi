const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard'); // Aqui renderiza views/dashboard.hbs
});

router.get('/perfil', (req, res) => {
    res.render('perfil');
});

router.get('/testes', (req, res) => {
    res.render('testes');
});

module.exports = router;
