// src/app.js
require("dotenv").config();                // Charger .env dès le début
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const followRoutes = require("./routes/followRoutes");
// const notificationRoutes = require("./routes/notificationRoutes"); // optionnel
const { errorHandler } = require("./middlewares/errorMiddleware");


const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connexion à MongoDB
connectDB();

// 2. Middlewares globaux
app.use(cors());
app.use(express.json()); // parser JSON dans le body

const path = require("path");
app.use(
  "/api/uploads/avatars",
  express.static(path.join(__dirname, "../uploads/avatars"))
);


// 3. Montée des routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follow", followRoutes);
// app.use("/api/notifications", notificationRoutes); // si implémenté

// 4. Middleware de gestion des erreurs (doit être après les routes)
app.use(errorHandler);

// 5. Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur Breezy API démarré sur le port ${PORT}`);
});
