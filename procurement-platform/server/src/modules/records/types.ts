export const moduleDefinition = {
  key: 'records',
  name: 'Records',
  description: 'Procurement history, audit-ready record entries, and cross-module evidence indexes.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

