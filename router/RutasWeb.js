const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("index")
})

router.get('/test_info', (req, res) => {
    res.render("test_info")
})

router.get('/comments', (req, res) => {
    res.render("comments")
})

router.get('/login', (req, res) => {
    res.render("login")
})

module.exports = router;