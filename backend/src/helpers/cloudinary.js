const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Profile Pic Storage
const profilePicsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePics",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Channel Banner Storage
const bannerImgsStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "bannerImgs", 
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const profileUpload = multer({ storage: profilePicsStorage });
const bannerUpload = multer({ storage: bannerImgsStorage });

module.exports = { 
    cloudinary, 
    profileUpload, 
    bannerUpload 
};
