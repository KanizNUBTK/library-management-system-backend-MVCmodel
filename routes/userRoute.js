const express = require("express");
const router = express.Router();
const { signup, login, passwordChange, passwordReset, sendUserPasswordResetEmail } = require('../controllers/userController');
const { getusers, getLoggedUser, getUserById, updateProfile, updateProfileImage, getDatalibraryIdRole, getAllFilteredUser, updateUserByAuthorized, getFilteredData, deleteUser } = require('../controllers/getUsers');
const { protect } = require("../auth/authChecker");
const { imageUpload } = require("../auth/imageUpload")

// user routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/findusers', getusers);

router.get('/', protect, getLoggedUser);
router.get('/get-user-by-id/:id', protect, getUserById);
router.get('/get-filtered-data', protect, getFilteredData);
router.get('/get-data-libraryId-role/:libraryID', protect, getAllFilteredUser)
router.get('/get-data-libraryId-role/:libraryID/:role', protect, getDatalibraryIdRole)

router.patch("/update-profile", protect, updateProfile);
router.put("/update/:id", protect, updateUserByAuthorized);
router.patch("/profile-image", protect, imageUpload, updateProfileImage);

router.patch('/change-password', protect, passwordChange);
router.patch('/reset-password', protect, passwordReset);
router.post('/send-password-reset-email', sendUserPasswordResetEmail);

router.delete('/delete/:id', protect, deleteUser);

// module export
module.exports = router;