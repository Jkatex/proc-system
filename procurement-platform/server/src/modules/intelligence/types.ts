export const moduleDefinition = {
  key: 'intelligence',
  name: 'Intelligence',
  description: 'Market snapshots, price benchmarks, supplier match signals, and module registry data.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

