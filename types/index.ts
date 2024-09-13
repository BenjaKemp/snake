// Represents the position (x, y) on the game board
export interface Position {
  x: number;
  y: number;
}

// Represents the fruit position on the game board
export interface Fruit {
  x: number;
  y: number;
}

// Represents the snake's position and velocity
export interface Snake {
  x: number;
  y: number;
  velX: number;  // X velocity of the snake (one of -1, 0, 1)
  velY: number;  // Y velocity of the snake (one of -1, 0, 1)
}

// Represents the full game state, including the board dimensions, score, and snake/fruit positions
export interface GameState {
  gameId: string;  // Game ID (optional if needed in your case)
  width: number;   // Board width
  height: number;  // Board height
  score: number;   // Current score
  fruit: Fruit;    // Position of the fruit
  snake: Snake;    // Position and velocity of the snake
}

// Tick represents a single movement of the snake (a change in x or y)
export type Tick = Position;

// API response from the server after a move
export interface MoveResponse {
  message: string;
  gameState: GameState;
}
