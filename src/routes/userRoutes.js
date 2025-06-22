const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { getProfile, updateProfile, getMe, searchProfiles, deleteProfile } = require("../controllers/userController");

router.get("/me", authMiddleware, getMe);
router.get("/profile/:id", authMiddleware, getProfile);
router.get("/search", authMiddleware, searchProfiles)

router.delete("/profile", authMiddleware, deleteProfile);

router.put("/profile", authMiddleware, updateProfile);
router.put("/profile/avatar", authMiddleware, upload.single("avatar"), async (req, res, next) => {
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