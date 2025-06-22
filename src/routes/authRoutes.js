const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { register, login, refreshToken } = require("../controllers/authController");
const { visitorOrAdmin } = require("../middlewares/authMiddleware")

router.post("/register", visitorOrAdmin, upload.single("avatar"), register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
