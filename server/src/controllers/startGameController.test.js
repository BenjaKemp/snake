import request from 'supertest';
import express from 'express';
import { startGame } from './startGameController';

// Mocking the global fetch function
global.fetch = jest.fn();

const app = express();
app.use(express.json());
app.get('/game/start', startGame);

describe('startGame Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize the game with default width and height when no parameters are provided', async () => {


    await request(app)
      .get('/game/start')
      .query({ w: 10, h: 10 }) // Send the width and height as query parameters
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        const body = res.toJson();
        console.log(body)
        expect(res.body).toBeDefined();
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3001/game/new?w=10&h=10',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      });
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

    // Mock fetch response for the GET request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGameState,
    });

    await request(app)
      .get('/game/start')
      .query({ w: 15, h: 20 }) // Send the custom width and height as query parameters
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual(mockGameState);
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3001/game/new?w=15&h=20',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      });
  });
});
