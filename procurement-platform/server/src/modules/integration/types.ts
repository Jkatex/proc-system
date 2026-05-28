export const moduleDefinition = {
  key: 'integration',
  name: 'Integration',
  description: 'External systems, sync runs, webhook-style events, and platform integration status.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

