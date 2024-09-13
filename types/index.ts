export interface Position {
  x: number;
  y: number;
}

export interface Fruit {
  x: number;
  y: number;
}

export interface Snake {
  x: number;
  y: number;
  velX: number;
  velY: number;
}

export interface GameState {
  gameId: string;
  width: number;
  height: number;
  score: number;
  fruit: Fruit;
  snake: Snake;
}

export type Tick = Position;

export interface MoveResponse {
  message: string;
  gameState: GameState;
}
