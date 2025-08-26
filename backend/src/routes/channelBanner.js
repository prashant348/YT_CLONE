const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const User = require('../models/User.js');
const multer = require('multer');

// const upload = multer({ dest: 'uploads/BannerImgs/' });
const { bannerUpload } = require("../helpers/cloudinary");

router.post('/api/channel/banner', authMiddleware, bannerUpload.single('bannerImage'), async (req, res) => {
    const user = await User.findById(req.user.id);
    user.banner = req.file.path;
    await user.save();
    res.json({ message: "Banner img uploaded!" });
});

module.exports = router;