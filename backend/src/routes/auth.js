const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const validator = require('validator');
const authMiddleware = require('../middlewares/authMiddleware.js');
const { decode } = require('querystring');
const { upload } = require('../helpers/cloudinary.js');

const app = express()
const router = express.Router();
app.use(cookieParser());


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully!")
    } catch (err) {
        console.log('Error in connecting database: ', err)
    }
}

connectDB();

// Secure cookie options
const isProd = process.env.NODE_ENV === "production";
const CookieOptions = {
    httpOnly: false, // JS se access naa kar paaye cookie ko (security) isliye httpOnly: true hona chahiye
    secure: isProd, // production: true (http), development: false
    sameSite: isProd ? "strict": "lax",
    path: '/',
    maxAge: Number(process.env.COOKIE_EXPIRY_TIME) // 7 days
};


const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

function removeNumsFromStr(str) {
    let newStr = "";
    for(let char of str){
        if (!Number(char)) {
            newStr += char;
        } ;
    };
    return newStr;
};

router.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body
        // console.log(req.body)

        if (!validatePassword(password)) {
            // console.log(`Password is not strong enough!`); // for debugguing
            return res.status(400).json({ message: "Password is not strong enough!" });
        }

        // check if user already exists
        const userExists = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });            

        // if user already exists
        if (userExists) {
            console.log(`User with username "${username}" already exists!`); // for debugguing
            return res.status(409).json({ message: "User already exists!" });
        };

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY_TIME || "1h" });

        const name = removeNumsFromStr(email.split("@")[0]);
        // create  user in db
        const user = await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            verified: false,
            status: "logged_out",
            verificationToken: verificationToken
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
        const productionVerificationUrl = `https://yt-clone-qjl6.onrender.com/api/auth/verify-email?token=${verificationToken}`;


        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email",
            html: `<p>Click <a href="${productionVerificationUrl}">here</a> to verify your email.</p>`
        }).catch(err => console.log(err));


        console.log('Regitered Successfully!', user)
        // success response
        res.status(200).json({ message: "User registered successfully! Please check your email to verify your account. Link is valid for 1 hour only!" });

    } catch (e) {
        console.log("Signup Error!: ", e)
        res.status(500).json({ message: "Signup Error!" });

    };
});
 
router.get('/api/auth/verify-email', async (req, res) => {
    const { token } = req.query;
    try {
        // user will be decoded by verifying token using .verify()
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        // find user in db
        const user = await User.findOne({ email: decodedUser.email });
        // if user not found
        if (!user) return res.status(400).send("Invalid token or user not found!");
        // if user already verified
        if (user.verified) return res.send("Email already verified!");
        // update user
        user.verified = true;
        // remove verification token
        user.verificationToken = undefined;
        // save updates in db
        await user.save();
        // send success response
        res.send("Email verified successfully! You can now login.");
    } catch (err) {
        console.log(err)
        res.status(400).send("Invalid or expired token!");
    }
});

router.post('/api/auth/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // find user in db by email
        const user = await User.findOne({
            $or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
            ]
        });

        // console.log(user)
        // if user not found
        if (!user) return res.status(400).json({ message: "User not found!" });
        // if user is not verified
        if (!user.verified) return res.status(401).json({ message: "User is not verified!" });

        // compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        // if password is not match
        if (!isPasswordMatch) return res.status(401).json({ message: "Invalid password!" });

        // create jwt token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: process.env.LOGIN_TOKEN_EXPIRY_TIME || "7d" });

        // update user status
        user.status = "logged_in";
        await user.save();

        // send success response 
        res
        .cookie("logged_in_token", token, CookieOptions)
        .status(200).json({ message: "Login successful!", token });

    } catch (err) {
        console.log("Login Error:", err);
        res.status(500).json({ message: "Login failed!" });
    };
});

router.get('/api/auth/logout', async (req, res) => {

    const tokenCookie = req.cookies?.logged_in_token;
    console.log(tokenCookie)
    if (!tokenCookie) return res.status(401).json({ message: "Unauthorized! No token." });

    try {
        const decodesUser = jwt.verify(tokenCookie, process.env.SECRET_KEY);
        const user = await User.findById(decodesUser.id);
        user.status = "logged_out";
        await user.save();

        res
        .clearCookie("logged_in_token", CookieOptions)
        .status(200).json({ message: "Logout successful!" });

    } catch (err) {
        console.log(err)
        return res
                .clearCookie("logged_in_token", CookieOptions)
                .status(401).json({ message: "Invalid or expired token!" });
    }

});

router.post("/api/post", authMiddleware,  async (req, res) => {
    try {
        const {title, content, avatar} = req.body;
        const user = await User.findById(req.user.id);
        const author = user.username;

        
        const post = new Post({ author, title, content, avatar });

        await post.save();

        res.status(200).json({ message: "Post created successfully!", post: post });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Post creation failed!" });
    }
})

router.get(`/api/posts`, authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // console.log(user.username)
        const posts = await Post.find({ author: user.username });
        res.status(200).json({ message: "Posts fetched successfully!", posts: posts });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Posts fetch failed!" });
    }
})

 // ISKO COMMENT OUT HEE REHENE DO KUCH KAAM NHI HAI BAS JUGAAD THA
 
// router.post('/api/posts', authMiddleware, async (req, res) => {
//     try {
//         const { avatar } = req.body;
//         const user = await User.findById(req.user.id);
//         const posts = await Post.find({ author: user.username });
//         console.log(posts)
//         posts.forEach(async (post) => {
//             post.avatar = avatar;
//             await post.save();
//         })

//         res.status(200).json({ message: "Posts fetched successfully!", posts: posts });
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Posts fetch failed!" });
//     }
// })


router.get('/api/all-posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ message: "Posts fetched successfully!", posts: posts });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Posts fetch failed!" });
    }
})

router.get('/api/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // console.log(users)
        // const userAvatar = user.avatar

        res.status(200).json({ message: "User fetched successfully!", user: user });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "User fetch failed!" });
    }
})

router.delete(`/api/post/:id`, authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Post delete failed!" });
    }
})

router.delete(`/api/channel/banner`, authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.banner) return res.status(400).json({ message: "No banner to delete!" });
        user.banner = undefined;
        await user.save();
        res.status(200).json({ message: "banner deleted successfully!" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "banner delete failed!" });
    }
})

router.delete('/api/profile/pic', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.avatar) return res.status(400).json({ message: "No Avatar to remove!"});
        user.avatar = undefined;
        await user.save()
        res.status(200).json({ message: "Avatar removed successfully!"})
    } catch(err) {
        console.log(err) 
        res.status(500).json({ message: "Avatar remove failed!"});
    };
});

module.exports = router