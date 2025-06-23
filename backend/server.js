import express from "express";
import cors from "cors";
import connectDB from "./Configs/db.js";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./Controllers/clerkWebhooks.js";
import bodyParser from "body-parser";

connectDB();

const app = express();
app.use(cors());
// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to Clerk Webhook
app.post("/api/clerk", bodyParser.raw({ type: "application/json" }), clerkWebhooks);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("API is Working"));

app.listen(PORT, () => {
  console.log("Server is running port" + PORT);
});

export default app;
