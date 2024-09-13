import express from 'express';
import cors from 'cors'; 
import { gameRoutes } from './src/routes/index.js'; 
const app = express();

const port = 3001;

app.use(express.json());

app.use(cors());

app.use('/game', gameRoutes);

app.listen(port, () => {
    console.log(`Snake game validator API running at http://localhost:${port}`);
});
