import express from 'express';
import * as apiController from '../controllers/apiController';

const router = express.Router();

// Top users route
router.get('/users', apiController.getTopUsers);

// Posts route with type parameter
router.get('/posts', apiController.getPosts);

export default router;