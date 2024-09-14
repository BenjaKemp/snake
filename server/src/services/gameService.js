import { getRandomPosition } from '../utils/helpers.js';
import { GameStateModel } from '../models/index.js';

class GameService {

  initializeGame(width, height) {
    return GameStateModel.getInstance().initialize(width, height);
  }

  validateSnake(ticks, clientGameState) {

    try {
      if (!Array.isArray(ticks) || ticks.length === 0) {
        return { status: 400, message: 'Invalid request: Moves are required.', gameState: clientGameState };
      }
  
      let serverGameState = {
        ...clientGameState,
      };

      if (this.checkInvalidTurns(ticks)) {
        return this.createErrorResponse(400, 'Invalid move: 180-degree turn not allowed.', serverGameState);
      }
  
      for (let move of ticks) {
        this.setVelocity(serverGameState.snake, move);
        serverGameState.snake.x += serverGameState.snake.velX;
        serverGameState.snake.y += serverGameState.snake.velY;

        if (this.checkBoundaryCollision(serverGameState)) {
          return this.createErrorResponse(418, 'Game Over: Snake hit the boundary!', serverGameState);
        }

        if (this.checkFruitEaten(serverGameState)) {
          console.log('serverGameState    ',serverGameState);
          console.log('clientGameState    ',clientGameState);
          return this.createSuccessResponse('Fruit eaten! Score updated.', serverGameState);
        }
      }

    } catch (error) {
      return this.createErrorResponse(500, 'Internal server error.', clientGameState);
    }
  }

  checkBoundaryCollision(serverGameState) {
    const { snake, width, height } = serverGameState;
    if (snake.x < 0 || snake.x >= width || snake.y < 0 || snake.y >= height) {
      return true;
    }
    return false;
  }

  checkFruitEaten(serverGameState) {
    const { snake, fruit } = serverGameState;
    if (snake.x === fruit.x && snake.y === fruit.y) {
      serverGameState.score++;
      serverGameState.gameId++;
      serverGameState.fruit = getRandomPosition(serverGameState.width, serverGameState.height);
      return true;
    }
    return false;
  }

  checkInvalidTurns(ticks) {
    for (let i = 1; i < ticks.length; i++) {
      const prevMove = ticks[i - 1];
      const currentMove = ticks[i];
      if (
        (prevMove.x === 1 && currentMove.x === -1) || 
        (prevMove.x === -1 && currentMove.x === 1) ||
        (prevMove.y === 1 && currentMove.y === -1) || 
        (prevMove.y === -1 && currentMove.y === 1)
      ) {
        return true;
      }
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
      message: message,
      gameState: {
        ...gameState,
      },
    };
  }

  createErrorResponse(status, message, gameState) {
    return {
      status: status,
      message: message,
      gameState: {
        ...gameState,
      },
    };
  }
}

export default new GameService();
