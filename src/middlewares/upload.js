const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isMediaUpload = file.fieldname === "media";
    const folder = isMediaUpload ? "media" : "avatars";
    cb(null, path.join(__dirname, `../../uploads/${folder}`));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = req.user?._id || Date.now();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: (req, file, cb) => file.fieldname === "media" ? 50*1024*1024 : 5*1024*1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = [".png", ".jpg", ".jpeg", ".gif"].includes(ext);
    const isVideo = [".mp4", ".mov", ".webm", ".avi", ".mkv"].includes(ext);
    if (file.fieldname === "avatar" && !isImage) {
      return cb(new Error("Avatar : formats autorisés .png/.jpg/.jpeg/.gif"));
    }
    if (file.fieldname === "media" && !isImage && !isVideo) {
      return cb(new Error("Media : formats autorisés images et vidéos"));
    }
    cb(null, true);
  },
});
