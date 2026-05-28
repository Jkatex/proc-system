export const moduleDefinition = {
  key: 'identity',
  name: 'Identity',
  description: 'Accounts, sessions, verification, admin account type, and user access context.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

