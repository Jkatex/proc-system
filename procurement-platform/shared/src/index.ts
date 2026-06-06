export const accountTypes = ['USER', 'ADMIN'] as const;
export const organizationCapabilities = ['BUYER', 'SUPPLIER'] as const;

export type AccountType = (typeof accountTypes)[number];
export type OrganizationCapability = (typeof organizationCapabilities)[number];




