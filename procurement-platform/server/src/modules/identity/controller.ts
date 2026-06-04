import { VerificationStatus } from '@prisma/client';
import type { Request, RequestHandler } from 'express';
import { ModuleService } from './service.js';
import {
  activateEmailSchema,
  adminDecisionSchema,
  adminVerificationListQuerySchema,
  moduleStatusQuerySchema,
  profileUpdateSchema,
  registryLookupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  setPasswordSchema,
  signInSchema,
  startRegistrationSchema,
  verificationDraftSchema,
  verificationSubmitSchema,
  verifyOtpSchema
} from './validators.js';

function bearerToken(req: Request) {
  const header = req.header('authorization') ?? '';
  const [scheme, token] = header.split(/\s+/);
  return scheme?.toLowerCase() === 'bearer' ? token : undefined;
}

export class ModuleController {
  constructor(private readonly service = new ModuleService()) {}

  status: RequestHandler = async (req, res, next) => {
    try {
      moduleStatusQuerySchema.parse(req.query);
      res.json(await this.service.status());
    } catch (error) {
      next(error);
    }
  };

  startRegistration: RequestHandler = async (req, res, next) => {
    try {
      res.status(201).json(await this.service.startRegistration(startRegistrationSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  };

  verifyOtp: RequestHandler = async (req, res, next) => {
    try {
      const input = verifyOtpSchema.parse(req.body);
      res.json(await this.service.verifyOtp(input.challengeId, input.code));
    } catch (error) {
      next(error);
    }
  };

  activateEmail: RequestHandler = async (req, res, next) => {
    try {
      const input = activateEmailSchema.parse(req.body);
      res.json(await this.service.activateEmail(input.challengeId, input.code));
    } catch (error) {
      next(error);
    }
  };

  setPassword: RequestHandler = async (req, res, next) => {
    try {
      const input = setPasswordSchema.parse(req.body);
      res.json(await this.service.setPassword(input.email, input.password));
    } catch (error) {
      next(error);
    }
  };

  signIn: RequestHandler = async (req, res, next) => {
    try {
      const input = signInSchema.parse(req.body);
      res.json(await this.service.signIn(input.email, input.password));
    } catch (error) {
      next(error);
    }
  };

  forgotPassword: RequestHandler = async (req, res, next) => {
    try {
      const input = forgotPasswordSchema.parse(req.body);
      res.json(await this.service.forgotPassword(input.email));
    } catch (error) {
      next(error);
    }
  };

  resetPassword: RequestHandler = async (req, res, next) => {
    try {
      const input = resetPasswordSchema.parse(req.body);
      res.json(await this.service.resetPassword(input.challengeId, input.code, input.password));
    } catch (error) {
      next(error);
    }
  };

  getSession: RequestHandler = async (req, res, next) => {
    try {
      res.json(await this.service.sessionFromToken(bearerToken(req) ?? ''));
    } catch (error) {
      next(error);
    }
  };

  signOut: RequestHandler = async (req, res, next) => {
    try {
      res.json(await this.service.signOut(bearerToken(req) ?? ''));
    } catch (error) {
      next(error);
    }
  };

  registryLookup: RequestHandler = async (req, res, next) => {
    try {
      await this.service.requireSession(bearerToken(req));
      res.json(await this.service.registryLookup(registryLookupSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  };

  getVerificationMe: RequestHandler = async (req, res, next) => {
    try {
      res.json(await this.service.getVerificationMe(bearerToken(req)));
    } catch (error) {
      next(error);
    }
  };

  saveVerificationDraft: RequestHandler = async (req, res, next) => {
    try {
      res.json(await this.service.saveVerificationDraft(bearerToken(req), verificationDraftSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  };

  submitVerification: RequestHandler = async (req, res, next) => {
    try {
      res.json(await this.service.submitVerification(bearerToken(req), verificationSubmitSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  };

  updateProfile: RequestHandler = async (req, res, next) => {
    try {
      res.json(await this.service.updateProfile(bearerToken(req), profileUpdateSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  };

  listAdminVerifications: RequestHandler = async (req, res, next) => {
    try {
      const query = adminVerificationListQuerySchema.parse(req.query);
      res.json(await this.service.listAdminVerifications(bearerToken(req), query.status as VerificationStatus | undefined));
    } catch (error) {
      next(error);
    }
  };

  decideAdminVerification: RequestHandler = async (req, res, next) => {
    try {
      const input = adminDecisionSchema.parse(req.body);
      res.json(await this.service.decideAdminVerification(bearerToken(req), req.params.id, input.decision, input.note));
    } catch (error) {
      next(error);
    }
  };
}
