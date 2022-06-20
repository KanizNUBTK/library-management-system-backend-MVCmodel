const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
        lowercase: true
    },
    bookTitle: {
        type: String,
        minlength: 3,
        required: [true, "Please provide book name"],
        trim: true
    },
    authorName: {
        type: String,
        minlength: 3,
        trim: true
    },
    pulisherName: {
        type: String,
        minlength: 3,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        trim: true
    },
    endDate: {
        type: Date,
        trim: true
    },
    libraryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Library',
    },
}, {
    timestamps: true,
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;