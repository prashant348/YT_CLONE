const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, "../../.env") });
const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {
    const token = req.cookies.logged_in_token;
    if (!token) return res.status(401).json({ message: "Unauthorized! No token." });

    try {
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedUser; // user info attach karo
        
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
}

module.exports = authMiddleware;