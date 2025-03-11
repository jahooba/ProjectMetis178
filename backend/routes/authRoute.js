const express = require('express');
const cors = require('cors');
const router = express.Router();
const { login, signup } = require('../controllers/authController')

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.post("/login", login);
router.post('/signup', signup);

module.exports = router