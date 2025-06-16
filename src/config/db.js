const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connectée : ${conn.connection.host}`);
  } catch (err) {
    console.error("Erreur de connexion à MongoDB :", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
