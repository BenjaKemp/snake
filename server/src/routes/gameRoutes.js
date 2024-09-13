import express from 'express';
import { startGame, validateGame } from '../controllers/index.js';  // Adjust path as needed

const router = express.Router();

router.get('/new', startGame);

router.post('/validate', validateGame);

export default router;
