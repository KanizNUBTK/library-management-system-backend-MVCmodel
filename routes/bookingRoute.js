const express = require("express");
const router = express.Router();

const { protect } = require("../auth/authChecker");
const {
    addBooking,
    getAllBooking,
    getFilteredData,
    getAllFilteredBookingInfo,
    deleteBooking,
    updateBooking
} = require("../controllers/bookingController");

// user routes
router.post("/create", protect, addBooking);
router.get("/get-all", getAllBooking);
router.get('/get-filtered-data', protect, getFilteredData);
router.get("/filtered-subject/:libraryId", getAllFilteredBookingInfo);
router.patch("/update/:id", protect, updateBooking);
router.delete("/delete/:id", protect, deleteBooking);


// module export
module.exports = router;
