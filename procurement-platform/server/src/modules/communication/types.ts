export const moduleDefinition = {
  key: 'communication',
  name: 'Communication',
  description: 'Messages, clarifications, notifications, alerts, attachments, and tender communication history.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

