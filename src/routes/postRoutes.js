const express = require("express");
const router = express.Router();
const { createPost, getUserPosts, getFeed, deletePost, modifyPost } = require("../controllers/postController");
const  authMiddleware  = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post("/", authMiddleware, upload.single("media"), createPost);
router.patch("/:id", authMiddleware, upload.single("media"), modifyPost);
router.get("/feed", authMiddleware, getFeed);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id", authMiddleware, modifyPost);

module.exports = router;
