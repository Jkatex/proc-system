import type { RequestHandler } from 'express';
import { ModuleService } from './service.js';
import { moduleStatusQuerySchema, recordsQuerySchema } from './validators.js';

function requestError(message: string, status = 400) {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
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

  dashboard: RequestHandler = async (_req, res, next) => {
    try {
      res.json(await this.service.dashboard());
    } catch (error) {
      next(error);
    }
  };

  records: RequestHandler = async (req, res, next) => {
    try {
      const query = recordsQuerySchema.safeParse(req.query);
      if (!query.success) throw requestError('Invalid evaluation records query parameters.');
      res.json(await this.service.records(query.data));
    } catch (error) {
      next(error);
    }
  };

  drafts: RequestHandler = async (_req, res, next) => {
    try {
      res.json(await this.service.drafts());
    } catch (error) {
      next(error);
    }
  };

  ready: RequestHandler = async (_req, res, next) => {
    try {
      res.json(await this.service.ready());
    } catch (error) {
      next(error);
    }
  };
}
