// Helper to get a random position for the fruit within the game bounds
export const getRandomPosition = (width, height) => {
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
    };
};