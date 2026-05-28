import { describe, expect, it } from 'vitest';
import { moduleStatusQuerySchema as identitySchema } from '../modules/identity/validators.js';
import { moduleStatusQuerySchema as organizationSchema } from '../modules/organization/validators.js';
import { moduleStatusQuerySchema as procurementSchema } from '../modules/procurement/validators.js';
import { moduleStatusQuerySchema as biddingSchema } from '../modules/bidding/validators.js';
import { moduleStatusQuerySchema as complianceAdminSchema } from '../modules/compliance-admin/validators.js';

describe('module validators', () => {
  it('accepts status query passthrough for priority modules', () => {
    for (const schema of [identitySchema, organizationSchema, procurementSchema, biddingSchema, complianceAdminSchema]) {
      expect(schema.parse({ trace: 'yes' })).toEqual({ trace: 'yes' });
    }
  });
});

