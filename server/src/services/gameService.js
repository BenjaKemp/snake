import { getRandomPosition } from '../utils/helpers.js';
import { GameStateModel } from '../models/index.js';

class GameService {
  initializeGame(width, height) {
    return GameStateModel.getInstance().initialize(width, height);
  }

  validateSnake(ticks, gameState) {
    try {
      if (!Array.isArray(ticks) || ticks.length === 0) {
        return this.createErrorResponse(400, 'Invalid request: Moves are required.', gameState);
      }

      for (let i = 0; i < ticks.length; i++) {
        const move = ticks[i];

        if (this.checkInvalidTurn(i, ticks)) {
          return this.createErrorResponse(418, 'Invalid move: 180-degree turn not allowed.', gameState);
        }

        this.updateSnakePosition(gameState, move);

        if (this.checkBoundaryCollision(gameState)) {
          return this.createErrorResponse(418, 'Game Over: Snake hit the boundary!', gameState);
        }

        if (this.checkFruitEaten(gameState)) {
          return this.createSuccessResponse('Fruit eaten! Score updated.', gameState);
        }
      }

    } catch (error) {
      return this.createErrorResponse(500, 'Internal server error.', gameState);
    }
  }

  updateSnakePosition(gameState, move) {
    this.setVelocity(gameState.snake, move);
    gameState.snake = {
      ...gameState.snake,
      x: gameState.snake.x + gameState.snake.velX,
      y: gameState.snake.y + gameState.snake.velY,
    };
  }

  checkInvalidTurn(index, ticks) {
    if (index === 0) return false;

    const prevMove = ticks[index - 1];
    const currentMove = ticks[index];

    return prevMove.x * currentMove.x === -1 || prevMove.y * currentMove.y === -1;
  }

  checkBoundaryCollision(gameState) {
    const { snake, width, height } = gameState;
    return snake.x < 0 || snake.x >= width || snake.y < 0 || snake.y >= height;
  }

  checkFruitEaten(gameState) {
    const { snake, fruit } = gameState;
    if (snake.x === fruit.x && snake.y === fruit.y) {
      gameState.score++;
      gameState.gameId++;
      gameState.fruit = getRandomPosition(gameState.width, gameState.height);
      return true;
    }
    return false;
  }

  setVelocity(snake, move) {
    snake.velX = move.x !== 0 ? move.x : 0;
    snake.velY = move.y !== 0 ? move.y : 0;
  }

  createSuccessResponse(message, gameState) {
    return {
      status: 200,
      message,
      gameState
    };
  }

  createErrorResponse(status, message, gameState) {
    return {
      status,
      message,
      gameState
    };
  }
}

export default new GameService();
