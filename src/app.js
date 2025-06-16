require("dotenv").config();                
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const followRoutes = require("./routes/followRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json()); 

const path = require("path");
app.use(
  "/api/uploads/avatars",
  express.static(path.join(__dirname, "../uploads/avatars"))
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follow", followRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur Breezy API démarré sur le port ${PORT}`);
});
