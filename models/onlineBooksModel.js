const mongoose = require('mongoose');

const onlineBooksSchema = new mongoose.Schema({
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
    link: {
        type: String,
        trim: true
    },
    libraryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Library',
    },
}, {
    timestamps: true,
});


const OnlineBooks = mongoose.model('OnlineBooks', onlineBooksSchema);

module.exports = OnlineBooks;