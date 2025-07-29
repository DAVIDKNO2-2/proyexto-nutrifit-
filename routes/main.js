const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    // Lógica de autenticación aquí
    res.redirect('/search');
});

router.get('/search', (req, res) => {
    res.render('search');
});

module.exports = router;
