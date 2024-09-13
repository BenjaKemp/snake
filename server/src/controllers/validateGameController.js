import { GameService } from '../services/index.js';

export const validateGame = (req, res) => {

  const { ticks, gameState } = req.body;

  if (!ticks || !Array.isArray(ticks)) {
    return res.status(400).json({ message: 'Invalid ticks array.' });
  }

  const result = GameService.validateSnake(ticks, gameState);

  console.log('this is esult    ',result)

  return res.status(result.status).json({ message: result.message, gameState: result.gameState });
  };