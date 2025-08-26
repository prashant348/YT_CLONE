const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const auth = require("./src/routes/auth.js");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const profileRoute = require("./src/routes/profile");
const profilePicRoute = require("./src/routes/profilePic");
const channelBannerRoute = require("./src/routes/channelBanner");

app.use("/src", express.static(path.join(__dirname, "../frontend/src")));
app.use("/public", express.static(path.join(__dirname, "../frontend/public")));
app.use("/pages", express.static(path.join(__dirname, "../frontend/pages")));
app.use("/uploads/profilePics", express.static(path.join(__dirname, "uploads/profilePics")));
app.use("/uploads/BannerImgs", express.static(path.join(__dirname, "uploads/BannerImgs")));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", auth);
app.use("/", profileRoute);
app.use("/", profilePicRoute);
app.use("/", channelBannerRoute);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
}); 
 
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/src/pages/signup.html"));
});
 
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/src/pages/login.html"));
})

app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/src/pages/upload_post.html"));
})

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/src/pages/profile.html"));
})

app.get("/channel", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/src/pages/channel.html"));
})


// ✅ agar koi galat route aaye to bhi index.html bhej do (SPA ke liye)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/index.html"));
// });



app.listen(PORT, () => {
    console.log("App started!");
    console.log(`Server is running at http://localhost:${PORT}`);
});

