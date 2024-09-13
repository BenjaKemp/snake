import { GameService } from '../services/index.js';

export const startGame = (req, res) => {
  const width = req.body.width || 10;
  const height = req.body.height || 10;

  const gameState = GameService.initializeGame(width, height);
  res.json(gameState);
};