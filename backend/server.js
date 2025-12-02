import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDb } from './config/db.js';
import proRouter from './routes/routePro.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// db connection
connectDb();

// api endpoints
app.get('/', (req, res) => {
  res.send('API Working');
});

app.use('/api/projects', proRouter);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
