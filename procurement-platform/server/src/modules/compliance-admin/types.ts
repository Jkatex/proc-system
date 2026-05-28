export const moduleDefinition = {
  key: 'compliance-admin',
  name: 'Compliance Admin',
  description: 'Platform admin search, compliance review, audit events, risk signals, and admin actions.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

