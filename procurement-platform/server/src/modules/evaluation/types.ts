export const moduleDefinition = {
  key: 'evaluation',
  name: 'Evaluation',
  description: 'Evaluation workspaces, criteria, workflow assignments, scores, recommendations, and approvals.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

