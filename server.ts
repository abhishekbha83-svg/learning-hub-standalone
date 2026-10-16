import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './server/app.js';

async function startServer() {
  const port = Number(process.env.PORT) || 3000;
  const isProductionBuild = process.env.NODE_ENV === 'production' || path.basename(process.argv[1] || '') === 'server.cjs';

  if (!isProductionBuild) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).type('text/plain').send(`API route not found: ${req.path}`);
      }
      return res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Learning Hub running on http://localhost:${port}`);
  });
}

startServer();
