const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const validationMiddleware = require("../middlewares/userValidation");

// Route for getting current user's profile
router.get("/me", validationMiddleware.isAuthenticated, profileController.getMyProfile);

// Route for editing current user's profile
router.put("/me", validationMiddleware.isAuthenticated, profileController.editMyProfile);

// Route for getting all profiles
router.get("/", validationMiddleware.isAuthenticated, profileController.getAllProfiles);

module.exports = router;
