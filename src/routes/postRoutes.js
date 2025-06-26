const express = require("express");
const router = express.Router();
const { createPost, getUserPosts, getFeed, deletePost, modifyPost, searchPost } = require("../controllers/postController");
const  { authMiddleware }  = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/", authMiddleware, authorizeRoles("user", "moderator", "administrator"), upload.single("media"), createPost);
router.patch("/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), upload.single("media"), modifyPost);
router.get("/feed", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getFeed);
router.delete("/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), deletePost);
router.get('/search', authMiddleware, authorizeRoles("user", "moderator", "administrator"), searchPost);

module.exports = router;
