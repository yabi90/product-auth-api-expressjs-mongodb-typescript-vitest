import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors"; // Import CORS middleware
import { productRouter } from "./routes/productRoutes";
import { authRouter } from "./routes/authRoutes";

// Initialize the Express application
export const app = express();

// Use CORS middleware to allow cross-origin requests
// You can configure CORS with options (more on that below)
app.use(cors()); // This will allow all origins by default

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded data (e.g. form submissions)
app.use(express.urlencoded({ extended: false }));

// Routes for the API
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);

// Get the MongoDB URI from environment variables
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error('Database URI is not defined in the environment variables.');
  process.exit(1); // Exit the process if DB_URI is not set
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB - Connected!');
  } catch (error) {
    console.error('MongoDB - Failed to connect', error);
    process.exit(1); // Exit if the connection fails (only in production or critical environments)
  }
};

const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

// If we're not in the 'test' environment, connect to DB and start the server
if (process.env.NODE_ENV !== 'test') {
  connectToDatabase().then(startServer);
}