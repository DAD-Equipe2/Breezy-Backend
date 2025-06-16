const express = require("express");
const router = express.Router();
const { createPost, getUserPosts, getFeed, deletePost } = require("../controllers/postController");
const  authMiddleware  = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createPost);
router.get("/user/:id", authMiddleware, getUserPosts);
router.get("/feed", authMiddleware, getFeed);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
