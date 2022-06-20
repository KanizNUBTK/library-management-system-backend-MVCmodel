const Books = require('../models/booksModel');
const ObjectId = require('mongodb').ObjectId;

// create new Notice
exports.addBooks = async (req, res, next) => {
    const { bookTitle, authorName, pulisherName, description, type, quantity, libraryId } = req.body;
    try {
        const new_books = await Books.create({
            bookTitle, authorName, pulisherName, description, type, quantity, libraryId
        });

        res.status(200).json({
            status: true,
            message: 'successfully book added',
            new_books
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
// get all book
exports.getAllBooks = async (req, res, next) => {
    //console.log(req.body);
    try {
        const books = await Books.find().populate('libraryId')
        if (!books) return res.status(404).json({ message: 'book list Empty!', status: false })
        res.status(200).json({
            status: true,
            total: books.length,
            books
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
exports.getAllFilteredBookInfo = async (req, res, next) => {
    const { libraryId } = req.params;
    //console.log(req.body);
    try {
        //const books = await Books.find().populate('libraryId');
        const books = await Books.find({ libraryId: ObjectId(libraryId) }).populate('libraryId');
        if (!books) return res.status(404).json({ message: 'library list Empty!', status: false })
        //console.log(books);
        res.status(200).json({
            status: true,
            total: books.length,
            books
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error
        })
    }
}

// delete book
exports.deleteBook = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;

    if (role === 'librarian' || role === 'admin') return res.status(403).json({ message: "Permission denied" })
    try {

        const findBooks = await Books.findById(id);
        if (!findBooks)
            return res.status(404).json({ message: 'subject Not Found!', status: false })

        const response = await Books.findByIdAndDelete(findBooks._id)

        //console.log(response)

        res.status(200).json({
            status: true,
            message: 'deleted successfully!'
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            error
        })
    }
}
// update books
exports.updateBooks = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;
    if (role === 'librarian' || role === 'admin') {
        try {
            const updateBooks = await Books.findByIdAndUpdate(id, req.body);
            if (!updateBooks) return res.status(404).json({ message: 'Books Not Found!', status: false })

            res.status(200).json({
                status: true,
                message: 'successfully updated'
            })

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    } else {
        return res.status(403).json({ message: "Permission denied" })
    }
}

