import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDb } from '../config/db.js';
import proRouter from '../routes/routePro.js';
import { deployProjects } from '../deploy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express();

// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// db connection
connectDb();

// api endpoints
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Working!' });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Backend is working!' });
});

app.use('/api/projects', proRouter);

// Deploy endpoint
app.post('/api/deploy', async (req, res) => {
  try {
    const { projects } = req.body;
    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({ success: false, message: 'Invalid projects data' });
    }
    
    const result = await deployProjects({ projects });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default app;

