import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { registeredModules } from './modules/index.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'procurex-server',
      modules: registeredModules.map(({ key, basePath }) => ({ key, basePath }))
    });
  });

  for (const module of registeredModules) {
    app.use(module.basePath, module.router);
  }

  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const status = typeof error?.status === 'number' ? error.status : 500;
    res.status(status).json({
      error: status === 500 ? 'internal_error' : 'request_error',
      message: status === 500 ? 'Unexpected server error.' : String(error?.message ?? 'Request failed.')
    });
  };

  app.use(errorHandler);

  return app;
}

