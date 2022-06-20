const express = require("express");
const router = express.Router();

const { protect } = require("../auth/authChecker");
const {libraryRegistration, getlibrary, getAllLibrary, updateLibrary, deleteLibrary, getFilteredLibraryData,updateLibraryInfo,updateLibraryImage} = require("../controllers/libraryController");
const { imageUpload } = require("../auth/imageUpload")


// user routes
router.post("/registration", protect, libraryRegistration);

router.get("/get-all", getAllLibrary);
router.get("/get-filtered-data", protect, getFilteredLibraryData);
router.get("/:id", getlibrary);

// router.patch("/update/:id", protect, updateLibrary);
router.patch("/update-library-info", updateLibraryInfo);
// router.patch("/library-image",protect, imageUpload, updateLibraryImage);

router.delete("/delete/:id", protect, deleteLibrary);


// module export
module.exports = router;
