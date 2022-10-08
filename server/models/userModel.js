const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        min: 6
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dbqqobh8l/image/upload/v1664913087/avatar/avatar-seafoam_khwmlt.jpg',
    }
},{timestamp: true});

const User = mongoose.model("User", userSchema);

module.exports = User;