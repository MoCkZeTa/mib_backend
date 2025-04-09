const mongoose = require('mongoose');
require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 12, // ✅ fixed typo from "maxlenght" to "maxlength"
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 3,
        // maxlength: 20 (optional)
    }
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// JWT method
UserSchema.methods.createJwt = function () {
    return jwt.sign(
        { UserId: this._id, UserName: this.name },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
