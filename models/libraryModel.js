const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const librarySchema = new mongoose.Schema({
    libraryName: {
        type: String,
        minlength: 3,
        lowercase: true,
        required: true,
        trim: true
    },
    libraryEmail: {
        type: String,
        minlength: 2,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    institutionName: {
        type: String,
        minlength: 3,
        lowercase: true,
        required: true,
        trim: true
    },
    libraryDescription:{
        type: String,
    },
    libaryPicture: {
        type: String,
    },

}, {
    timestamps: true,
});


const Library = mongoose.model('Library', librarySchema);

module.exports = Library;