import request from 'supertest';
import express from 'express';
import { startGame } from './startGameController';
import { GameService } from '../services/index.js';  // Import the GameService

// Mock GameService
jest.mock('../services/index.js', () => ({
  GameService: {
    initializeGame: jest.fn(),  // Mock the initializeGame method
  },
}));

// Set up an Express app for testing
const app = express();
app.use(express.json());  // To handle JSON request body
app.post('/game/start', startGame);  // Add the startGame route

describe('startGame Controller', () => {
  test('should initialize the game with default width and height when no parameters are provided', async () => {
    // Arrange
    const mockGameState = { snake: { x: 0, y: 0 }, fruit: { x: 5, y: 5 }, score: 0 };
    GameService.initializeGame.mockReturnValue(mockGameState);  // Mock the return value of initializeGame

    // Act & Assert
    await request(app)
      .post('/game/start')  // Make a POST request to /game/start
      .send({})  // Send an empty body to use default values
      .expect(200)  // Expect a 200 OK response
      .expect('Content-Type', /json/)  // Expect the response to be JSON
      .expect((res) => {
        expect(res.body).toEqual(mockGameState);  // Ensure the response matches the mocked game state
        expect(GameService.initializeGame).toHaveBeenCalledWith(10, 10);  // Check that defaults were used
      });
  });

  test('should initialize the game with provided width and height', async () => {
    // Arrange
    const mockGameState = { snake: { x: 0, y: 0 }, fruit: { x: 3, y: 4 }, score: 0 };
    GameService.initializeGame.mockReturnValue(mockGameState);  // Mock the return value of initializeGame

    // Act & Assert
    await request(app)
      .post('/game/start')  // Make a POST request to /game/start
      .send({ width: 15, height: 20 })  // Provide custom width and height
      .expect(200)  // Expect a 200 OK response
      .expect('Content-Type', /json/)  // Expect the response to be JSON
      .expect((res) => {
        expect(res.body).toEqual(mockGameState);  // Ensure the response matches the mocked game state
        expect(GameService.initializeGame).toHaveBeenCalledWith(15, 20);  // Check that provided width and height were used
      });
  });
});
