const express = require("express");
const router = express.Router();
const { followUser, unfollowUser, getFollowers, getFollowing } = require("../controllers/followController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/follow/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), followUser);
router.post("/unfollow/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), unfollowUser);
router.get("/followers/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getFollowers);
router.get("/following/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getFollowing);

module.exports = router;
