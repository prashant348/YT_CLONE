const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User.js');

router.get('/api/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    console.log(user)
    res.json({ message: `Welcome to your profile!`, user: user });
});

module.exports = router;
