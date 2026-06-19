import { Router } from 'express';
import { ModuleController } from './controller.js';

export function createModuleRouter() {
  const router = Router();
  const controller = new ModuleController();

  router.get('/', controller.status);
  router.get('/status', controller.status);
  router.get('/apps', controller.apps);
  router.get('/dashboard', controller.dashboard);
  router.get('/users', controller.users);
  router.post('/users/invite', controller.inviteUser);
  router.post('/users/:id/suspend', controller.suspendUser);
  router.post('/users/:id/reinstate', controller.reinstateUser);
  router.post('/users/:id/reset-access', controller.resetUserAccess);
  router.post('/users/:id/revoke-sessions', controller.revokeUserSessions);
  router.get('/search', controller.search);
  router.get('/compliance/cases', controller.cases);
  router.patch('/compliance/cases/:id', controller.updateCase);
  router.get('/compliance/rules', controller.rules);
  router.post('/compliance/rules', controller.createRule);
  router.patch('/compliance/rules/:id', controller.updateRule);
  router.get('/audit/events', controller.auditEvents);
  router.get('/analytics', controller.analytics);
  router.get('/datastore/namespaces', controller.dataStoreNamespaces);
  router.get('/datastore/entries/export', controller.exportDataStoreEntries);
  router.get('/datastore/entries', controller.dataStoreEntries);
  router.get('/datastore/entries/:id', controller.dataStoreEntry);
  router.get('/datastore/entries/:id/versions', controller.dataStoreEntryVersions);
  router.post('/datastore/entries', controller.createDataStoreEntry);
  router.patch('/datastore/entries/:id', controller.updateDataStoreEntry);
  router.post('/datastore/entries/:id/restore', controller.restoreDataStoreEntry);
  router.delete('/datastore/entries/:id', controller.deleteDataStoreEntry);
  router.post('/datastore/versions/:id/restore', controller.restoreDataStoreVersion);
  router.patch('/profile/preferences', controller.updateProfilePreferences);
  router.post('/communication/messages/:id/:state', controller.updateCommunicationState);
  router.post('/actions', controller.recordAction);
  router.post('/actions/:id/undo', controller.undoAction);

  return router;
}
