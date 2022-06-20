const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
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
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        trim: true
    },
    // image: {
    //     type: String,
    // },
    // file: {
    //     type: String,
    // },
    libraryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Library',
    },
}, {
    timestamps: true,
});


const Books = mongoose.model('Books', booksSchema);

module.exports = Books;