export const moduleDefinition = {
  key: 'financial',
  name: 'Financial',
  description: 'Purchase orders, invoices, matching checks, payment review, and financial records.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

