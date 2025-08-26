const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User.js');
const multer = require('multer');

// const upload = multer({ dest: 'uploads/profilePics/' });
const { profileUpload } = require("../helpers/cloudinary");


router.post('/api/profile/pic', authMiddleware, profileUpload.single('image'), async (req, res) => {
    const user = await User.findById(req.user.id);
    user.avatar = req.file.path;
    await user.save();
    res.json({ message: "Profile pic uploaded!" });
});

module.exports = router;
