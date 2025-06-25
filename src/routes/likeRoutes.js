const express = require("express");
const router = express.Router();
const { likePost, unlikePost, getPostLikes } = require("../controllers/likeController");
const { authMiddleware }  = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/post/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), likePost);
router.delete("/post/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), unlikePost);
router.get("/post/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getPostLikes);

module.exports = router;
