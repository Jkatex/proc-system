export const moduleDefinition = {
  key: 'bidding',
  name: 'Bidding',
  description: 'Supplier bid drafts, sealed versions, responses, bid documents, receipts, and submission state.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

