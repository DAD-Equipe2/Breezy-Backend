const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { getProfile, updateProfile, getMe, searchProfiles, deleteProfile, getAllUsers, updateUserRole, updateAvatar} = require("../controllers/userController");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.get("/me", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getMe);
router.get("/profile/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getProfile);
router.get("/search", authMiddleware, authorizeRoles("user", "moderator", "administrator"), searchProfiles)
router.get("/", authMiddleware, authorizeRoles("administrator"), getAllUsers);

router.delete("/profile", authMiddleware, authorizeRoles("user", "moderator", "administrator"), deleteProfile);

router.put("/profile", authMiddleware, authorizeRoles("user", "moderator", "administrator"), updateProfile);
router.put("/profile/avatar", authMiddleware, authorizeRoles("user", "moderator", "administrator"), upload.single("avatar"), updateAvatar);

router.put("/:id/role", authMiddleware, authorizeRoles("administrator"), updateUserRole);

module.exports = router;