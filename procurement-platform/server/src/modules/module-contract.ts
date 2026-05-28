import type { Router } from 'express';

export type ModuleDefinition = {
  key: string;
  name: string;
  description: string;
};

export type RegisteredModule = ModuleDefinition & {
  basePath: string;
  router: Router;
};

