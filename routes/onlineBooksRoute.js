const express = require("express");
const router = express.Router();

const { protect } = require("../auth/authChecker");
const {
    addOnlineBooks,
    getAllOnlineBooks,
    deleteOnlineBook,
    getAllFilteredOnlineBookInfo,
    updateOnlineBooks
} = require("../controllers/onlineBooksController");
const { pdfUpload } = require("../auth/pdfFileUpload");
const { imageUpload } = require("../auth/imageUpload");

// user routes
router.post("/create", protect, addOnlineBooks);
router.get("/get-all", getAllOnlineBooks);
router.get("/filtered-subject/:libraryId", getAllFilteredOnlineBookInfo);
router.patch("/update/:id", protect, updateOnlineBooks);
router.delete("/delete/:id", protect, deleteOnlineBook);


// module export
module.exports = router;
