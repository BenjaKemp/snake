import { GameService } from '../services/index.js';

export const startGame = (req, res) => {
  const width = parseInt(req.query.w, 10) || 10;
  const height = parseInt(req.query.h, 10) || 10;

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return res.status(400).json({ message: 'Invalid width or height provided.' });
  }

  try {
    const gameState = GameService.initializeGame(width, height);
    return res.status(200).json(gameState);
  } catch (error) {
    console.error('Error initializing game:', error);
    return res.status(500).json({ message: 'Failed to initialize game.' });
  }
};
