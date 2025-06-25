const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { getProfile, updateProfile, getMe, searchProfiles, deleteProfile } = require("../controllers/userController");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.get("/me", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getMe);
router.get("/profile/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getProfile);
router.get("/search", authMiddleware, authorizeRoles("user", "moderator", "administrator"), searchProfiles)

router.delete("/profile", authMiddleware, authorizeRoles("user", "moderator", "administrator"), deleteProfile);

router.put("/profile", authMiddleware, authorizeRoles("user", "moderator", "administrator"), updateProfile);
router.put("/profile/avatar", authMiddleware, authorizeRoles("user", "moderator", "administrator"), upload.single("avatar"), async (req, res, next) => {
    try {
      if (!req.file) throw new Error("Fichier manquant");
      const avatarURL = `/uploads/avatars/${req.file.filename}`;
      const user = await require("../models/User").findById(req.user._id);
      user.avatarURL = avatarURL;
      await user.save();
      res.json({ success: true, data: { avatarURL } });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;