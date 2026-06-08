import { Router } from 'express';
import { ModuleController } from './controller.js';

export function createModuleRouter() {
  const router = Router();
  const controller = new ModuleController();

  router.get('/', controller.status);
  router.get('/dashboard', controller.dashboard);
  router.get('/records', controller.records);
  router.get('/drafts', controller.drafts);
  router.get('/ready', controller.ready);

  return router;
}
