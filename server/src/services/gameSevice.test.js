import GameService from './gameService';
import * as helpers from '../utils/helpers.js';

describe('GameService', () => {
  jest.mock('../utils/helpers.js', () => ({
    getRandomPosition: jest.fn(),
  }));
  
  describe('GameService - validateSnake', () => {
    let gameService;
  
    beforeEach(() => {
      gameService = GameService; 
      gameService.gameState = gameService.initializeGame(10, 10);
    });

    afterEach(() => {
      gameService.gameState = gameService.initializeGame(10, 10);
    });
  
    test('should return "Fruit eaten" message when snake reaches the fruit', () => {
      gameService.gameState.fruit = { x: 1, y: 0 };
      const moves = [{ x: 1, y: 0 }];
      
      jest.spyOn(helpers, 'getRandomPosition').mockReturnValue({ x: 5, y: 5 }); 
      const result = gameService.validateSnake(moves, gameService.gameState);

      expect(result.message).toBe('Fruit eaten! Score updated.');
      expect(result.gameState.snake).toEqual({ x: 1, y: 0, velX: 1, velY: 0 });
      expect(result.gameState.score).toBe(1);
      expect(result.gameState.fruit).toEqual({ x: 5, y: 5 });
    });

    test('should return "Game Over" when snake hits the boundary moving right', () => {
      const moves = [
        { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, 
        { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }
      ];
      const result = gameService.validateSnake(moves, gameService.gameState);
    
      expect(result.message).toBe('Game Over: Snake hit the boundary!');
      expect(result.gameState.snake).toEqual({ x: 10, y: 0, velX: 1, velY: 0 });
    });
    
    test('should return "Invalid move" for a 180-degree turn attempt', () => {
      const moves = [{ x: 1, y: 0 }, { x: -1, y: 0 }];
      const result = gameService.validateSnake(moves, gameService.gameState);
  
      expect(result.message).toBe('Invalid move: 180-degree turn not allowed.');
    });
  
    test('should return "Game Over" when snake hits the boundary moving up', () => {
      const moves = [{ x: 0, y: -1 }];
      const result = gameService.validateSnake(moves, gameService.gameState);
    
      expect(result.message).toBe('Game Over: Snake hit the boundary!');
      expect(result.gameState.snake).toEqual({ x: 0, y: -1, velX: 0, velY: -1 });
    });
    
    test('should return "Game Over" when snake hits the boundary moving down', () => {
      const moves = [{ x: 1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 1 }, 
        { x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 1 }, 
        { x: 0, y: 1 }, { x: 0, y: 1 }
      ];

      
      const result = gameService.validateSnake(moves, gameService.gameState);
      expect(result.message).toBe('Game Over: Snake hit the boundary!');
    });

    test('should find the fruit, restart the game, and succeed with another set of moves', () => {
      const firstSetOfMoves = [
        { x: 1, y: 0 }, // Move right
        { x: 1, y: 0 }, // Move right again
        { x: 1, y: 0 }  // Move right again to reach the fruit
      ];
    
      // The fruit is at position (3, 0)
      gameService.gameState.fruit = { x: 3, y: 0 };
      jest.spyOn(helpers, 'getRandomPosition').mockReturnValueOnce({ x: 3, y: 0 });
    
      const firstResult = gameService.validateSnake(firstSetOfMoves, gameService.gameState);

      console.log('firstResuklt    ',firstResult)
    
      // Check after the first set of moves
      expect(firstResult.message).toBe('Fruit eaten! Score updated.');
      expect(firstResult.gameState.score).toBe(1);
      expect(firstResult.gameState.snake).toEqual({ x: 3, y: 0, velX: 1, velY: 0 }); // The snake reaches the fruit
      expect(firstResult.gameState.fruit).toEqual({ x: 3, y: 0 }); // The new fruit position is set
    
      // The second set of moves to reach the new fruit
      const secondSetOfMoves = [
        { x: 0, y: 1 }, // Move down
        { x: 0, y: 1 }  // Move down again to reach the fruit at (5, 2)
      ];

      jest.spyOn(helpers, 'getRandomPosition').mockReturnValueOnce({ x: 3, y: 2 });
    
      const secondResult = gameService.validateSnake(secondSetOfMoves, firstResult.gameState);
    
      // Check after the second set of moves
      expect(secondResult.message).toBe('Fruit eaten! Score updated.');
      expect(secondResult.gameState.snake).toEqual({ x: 5, y: 2, velX: 0, velY: 1 }); // The snake reaches the second fruit
      expect(secondResult.gameState.score).toBe(2); // Score should increase after second fruit is eaten
    });
    

    test('should return "Fruit eaten" when snake reaches the fruit with complex moves', () => {
      gameService.gameState.fruit = { x: 0, y: 3 }; 
      const moves = [
        { x: 1, y: 0 },  // Move right (now at x: 1, y: 0)
        { x: 0, y: 1 },  // Move down (now at x: 1, y: 1)
        { x: 0, y: 1 },  // Move down (now at x: 1, y: 2)
        { x: -1, y: 0 }, // Move left (now at x: 0, y: 2)
        { x: 0, y: 1 },  // Move down to the fruit (now at x: 0, y: 3)
        { x: 1, y: 0 },  // Move down to the fruit (now at x: 0, y: 3)
        { x: 0, y: -1 },  // Move down to the fruit (now at x: 0, y: 3)
      ];

      const result = gameService.validateSnake(moves, gameService.gameState);

      expect(result.message).toBe('Fruit eaten! Score updated.');
      expect(result.gameState.snake).toEqual({ x: 0, y: 3, velX: 0, velY: 1 }); // Snake should be at the fruit's position
      expect(result.gameState.score).toBe(1); // Score should increase after fruit is eaten
      expect(result.gameState.fruit).toEqual({ x: 5, y: 5 }); // New fruit position after being eaten
    });
    

  });
});


