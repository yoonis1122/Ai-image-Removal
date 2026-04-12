import express from 'express';
import { removeBgImage } from '../middlewares/imageController.js';
import upload from '../middlewares/multer.js';
import authUser from  '../middlewares/auth.js'

const imageRoute = express.Router();

imageRoute.post('/remove-bg', authUser, upload.single('image'), authUser, removeBgImage)

export default imageRoute;