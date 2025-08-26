const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean},
    status: {type: String},
    verificationToken: {type: String},
    avatar: {type: String},
    banner: {type: String},
    createdAt: {type: Date, default: Date.now()},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
