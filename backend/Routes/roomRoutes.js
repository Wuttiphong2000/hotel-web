import express from 'express'
import upload from '../Middlewares/uploadMiddleware.js'
import { protect } from '../Middlewares/authMiddleware.js';
import { createRoom, deleteRoomById, getOwnerRooms, getRooms, toggleRoomAvailability } from '../Controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post('/', upload.array("images", 4), protect, createRoom)
roomRouter.get('/', getRooms)
roomRouter.get('/owner', protect, getOwnerRooms)
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability)
roomRouter.post('/delete', protect, deleteRoomById)

export default roomRouter;