export const moduleDefinition = {
  key: 'award-contract',
  name: 'Award and Contract',
  description: 'Award handoff, contract negotiation, contract versions, signatures, and post-award contract state.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

