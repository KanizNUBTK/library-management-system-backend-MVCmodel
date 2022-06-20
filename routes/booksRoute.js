const express = require("express");
const router = express.Router();

const { protect } = require("../auth/authChecker");
const {
    addBooks,
    getAllBooks,
    deleteBook,
    getAllFilteredBookInfo,
    updateBooks
} = require("../controllers/booksController");
const { pdfUpload } = require("../auth/pdfFileUpload");
const { imageUpload } = require("../auth/imageUpload");

// user routes
router.post("/create", protect, addBooks);
router.get("/get-all", getAllBooks);
router.get("/filtered-subject/:libraryId", getAllFilteredBookInfo);
router.patch("/update/:id", protect, updateBooks);
router.delete("/delete/:id", protect, deleteBook);


// module export
module.exports = router;
