import request from 'supertest';
import express from 'express';
import { startGame } from './startGameController';

jest.mock('../services/index.js');
global.fetch = jest.fn();

const app = express();
app.use(express.json());
app.get('/game/start', startGame);

describe('startGame Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize the game with default width and height when no parameters are provided', async () => {
    const mockGameState = {
      snake: { x: 0, y: 0, velX: 1, velY: 0 },
      fruit: { x: 3, y: 4 },
      score: 0,
      gameId: '1',
      width: 10,
      height: 10,
    };

    const { GameService } = require('../services/index.js');
    GameService.initializeGame.mockReturnValue(mockGameState);

    const response = await request(app)
      .get('/game/start')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual(mockGameState);
      });

    expect(GameService.initializeGame).toHaveBeenCalledWith(10, 10);
  });

  test('should initialize the game with provided width and height', async () => {
    const mockGameState = {
      snake: { x: 0, y: 0, velX: 1, velY: 0 },
      fruit: { x: 3, y: 4 },
      score: 0,
      gameId: '2',
      width: 15,
      height: 20,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGameState,
    });

    const { GameService } = require('../services/index.js');
    GameService.initializeGame.mockReturnValue(mockGameState);

    const response = await request(app)
      .get('/game/start')
      .query({ w: 15, h: 20 })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual(mockGameState);
      });

    expect(GameService.initializeGame).toHaveBeenCalledWith(15, 20);
  });

  test('should return 400 if invalid width or height is provided', async () => {
    await request(app)
      .get('/game/start')
      .query({ w: 'invalid', h: -10 }) // Invalid parameters
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.message).toBe('Invalid width or height provided.');
      });
  });
});
