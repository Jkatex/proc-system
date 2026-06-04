import { Router } from 'express';
import { ModuleController } from './controller.js';

export function createModuleRouter() {
  const router = Router();
  const controller = new ModuleController();

  router.get('/', controller.status);

  router.post('/registration/start', controller.startRegistration);
  router.post('/registration/verify-otp', controller.verifyOtp);
  router.post('/registration/activate-email', controller.activateEmail);
  router.post('/registration/set-password', controller.setPassword);

  router.post('/auth/sign-in', controller.signIn);
  router.post('/auth/forgot-password', controller.forgotPassword);
  router.post('/auth/reset-password', controller.resetPassword);
  router.get('/session', controller.getSession);
  router.post('/auth/sign-out', controller.signOut);

  router.get('/verification/me', controller.getVerificationMe);
  router.post('/verification/registry-lookup', controller.registryLookup);
  router.put('/verification/draft', controller.saveVerificationDraft);
  router.post('/verification/submit', controller.submitVerification);
  router.put('/profile', controller.updateProfile);

  router.get('/admin/verifications', controller.listAdminVerifications);
  router.post('/admin/verifications/:id/decision', controller.decideAdminVerification);

  return router;
}
