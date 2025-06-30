import express from "express";
import cors from "cors";
import connectDB from "./Configs/db.js";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./Controllers/clerkWebhooks.js";

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to Clerk Webhook
app.use("/api/clerk", clerkWebhooks);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("API is Working"));

app.listen(PORT, () => {
  console.log("Server is running port" + PORT);
});

export default app;
