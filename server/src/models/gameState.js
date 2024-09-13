import { getRandomPosition } from '../utils/helpers.js';

class GameStateModel {
  constructor() {
    this.state = {
      gameId: 0,
      width: 0,
      height: 0,
      score: 0,
      fruit: { x: 0, y: 0 },
      snake: { x: 0, y: 0, velX: 0, velY: 0 }
    };
  }

  static getInstance() {
    if (!GameStateModel.instance) {
      GameStateModel.instance = new GameStateModel();
    }
    return GameStateModel.instance;
  }

  initialize(width, height) {
    this.state.snake = { x: 0, y: 0, velX: 1, velY: 0 }
    this.state.fruit = getRandomPosition(width, height);
    this.state.score = 0;
    this.state.width = width;
    this.state.height = height;
    return this.state;
  }

  getState() {
    return this.state;
  }
}

export default GameStateModel;
