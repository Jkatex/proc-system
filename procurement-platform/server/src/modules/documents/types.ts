export const moduleDefinition = {
  key: 'documents',
  name: 'Documents',
  description: 'Object storage metadata, checksums, encryption references, and document attachments.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

