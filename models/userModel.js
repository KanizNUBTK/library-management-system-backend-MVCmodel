const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 3
    },
    lastName: {
        type: String,
        minlength: 3
    },
    departmentName: {
        type: String,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 6,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['member', 'teacher', 'librarian', 'admin'],
        default: 'member',
    },
    image: {
        type: String,
        default: 'avatar.png'
    },
    libraryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Library',
    },
}, {
    timestamps: true,
});


// password hashing before save 
userSchema.pre('save', async function (next) {

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 10);

    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;