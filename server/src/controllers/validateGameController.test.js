import request from 'supertest';
import express from 'express';
import { validateGame } from './validateGameController.js';
import { GameService } from '../services/index.js';

jest.mock('../services/index.js');

const app = express();
app.use(express.json()); 

app.post('/validate', validateGame);

describe('validateGame API', () => {
  test('should return 400 if no moves are provided', async () => {
    const response = await request(app).post('/validate').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid moves array.');
  });

  test('should return 400 if moves is not an array', async () => {
    const response = await request(app).post('/validate').send({ ticks: "not-an-array" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid moves array.');
  });

  test('should call GameService.validateSnake and return the result', async () => {
    const mockGameState = {
      snake: { x: 0, y: 0 },
      fruit: { x: 5, y: 5 },
      score: 0,
      bounds: { x: 10, y: 10 },
    };
    const mockResponse = { message: 'Moves applied successfully.', gameState: mockGameState };

    GameService.validateSnake.mockReturnValue(mockResponse);

    const response = await request(app)
      .post('/validate')
      .send({ ticks: [{ x: 1, y: 0 }, { x: 1, y: 0 }] });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Moves applied successfully.');
    expect(GameService.validateSnake).toHaveBeenCalledWith([{ x: 1, y: 0 }, { x: 1, y: 0 }]);  // Check that the service was called with the correct moves
  });
});
