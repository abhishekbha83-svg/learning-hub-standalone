import express from 'express';
import { learningHubRouter } from './learningHub/learningHubServer.ts';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok', service: 'learning-hub' });
});
app.use(['/api/learning-hub', '/learning-hub'], learningHubRouter);

export default app;
