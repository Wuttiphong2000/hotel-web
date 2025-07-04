import express from "express";
import { protect } from "../Middlewares/authMiddleware.js";
import { registerHotel } from "../Controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post('/', protect, registerHotel)

export default hotelRouter;