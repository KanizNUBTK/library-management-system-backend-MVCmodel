const Booking = require('../models/bookingModel');
const ObjectId = require('mongodb').ObjectId;

// create new booking
exports.addBooking = async (req, res, next) => {
    const { firstName, lastName, departmentName, email,bookTitle, authorName, pulisherName, type, state, startDate, endDate, libraryId } = req.body;
    try {
        const new_booking = await Booking.create({
            firstName, lastName, departmentName, email,bookTitle, authorName, pulisherName, type, state, startDate, endDate, libraryId
        });
        console.log("new booking=", new_booking);
        // const new_pendingbooking = await Booking.create({
        //     firstName, lastName, departmentName, email, bookTitle, authorName, pulisherName, type, state, startDate, endDate, libraryId
        // });
        // const new_acceptbooking = await Booking.create({
        //     firstName, lastName, departmentName, email, bookTitle, authorName, pulisherName, type, state, startDate, endDate, libraryId
        // });

        res.status(200).json({
            status: true,
            message: 'successfully booking added',
            new_booking
        })

    } catch (error) {
        console.log("booking error=", error);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
// get all booking
exports.getAllBooking = async (req, res, next) => {
    //console.log(req.body);
    try {
        const booking = await Booking.find().populate('libraryId')
        if (!booking) return res.status(404).json({ message: 'book list Empty!', status: false })
        res.status(200).json({
            status: true,
            total: booking.length,
            booking
        })

    } catch (error) {
       
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
exports.getFilteredData = async (req, res, next) => {
    // console.log(req);
    try {
        const booking = await Booking.find(req.query);
        if (booking.length === 0) return res.status(404).json({ message: "Not Found!" });

        res.status(200).json({
            status: true,
            total: booking.length,
            booking
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
exports.getAllFilteredBookingInfo = async (req, res, next) => {
    const { libraryId } = req.params;
    //console.log(req.body);
    try {
        //const books = await Books.find().populate('libraryId');
        const books = await Booking.find({ libraryId: ObjectId(libraryId) }).populate('libraryId');
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

// delete booking
exports.deleteBooking = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;
    //if (role === 'librarian' || role === 'admin') return res.status(403).json({ message: "Permission denied" })
    try {
        const findBooks = await Booking.findById(id);
        if (!findBooks)
            return res.status(404).json({ message: 'subject Not Found!', status: false })
        const response = await Booking.findByIdAndDelete(findBooks._id)
        // console.log(response)
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
// update booking
exports.updateBooking = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;
    if (role === 'librarian' || role === 'admin') {
        try {
            const updateBooks = await Booking.findByIdAndUpdate(id, req.body);
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

