require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Set up CORS once, with proper configuration
app.use(
   cors({
      origin: "*", // In production, specify your actual frontend domain
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);

app.use(bodyParser.json());

// Add error handling for MongoDB connection
mongoose
   .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("MongoDB connected"))
   .catch((err) => {
      console.error("MongoDB connection error:", err);
      // Log more details about the error
      if (err.name === "MongoServerSelectionError") {
         console.error("Connection string issue or network problem");
      }
   });

// Routes
const waitlistRoutes = require("./routes/waitlist");
app.use("/api/waitlist", waitlistRoutes);

// Default route for root "/"
app.get("/", (req, res) => {
   res.send("Welcome to the Waitlist API");
});

// Add better error handling
app.use((err, req, res, next) => {
   console.error("Unhandled error:", err);
   res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
