import { AccountType } from '@prisma/client';
import { prisma } from './db/prisma.js';
import { withDbContext } from './db/context.js';

async function main() {
  const company = await prisma.organization.findFirstOrThrow({ where: { kind: 'COMPANY' } });
  const user = await prisma.user.findFirstOrThrow({ where: { email: 'user@company.tz' } });
  const admin = await prisma.user.findFirstOrThrow({ where: { email: 'admin@procurex.tz' } });

  const tenderCount = await withDbContext(
    { userId: user.id, organizationId: company.id, accountType: AccountType.USER, capabilities: ['BUYER', 'SUPPLIER'] },
    (tx) => tx.tender.count({ where: { buyerOrgId: company.id } })
  );

  const bidCount = await withDbContext(
    { userId: user.id, organizationId: company.id, accountType: AccountType.USER, capabilities: ['BUYER', 'SUPPLIER'] },
    (tx) => tx.bid.count({ where: { supplierOrgId: company.id } })
  );

  const adminScoreUpdateBlocked = await withDbContext(
    { userId: admin.id, accountType: AccountType.ADMIN },
    async (tx) => {
      try {
        await tx.evaluationScore.updateMany({ data: { comment: 'admin write should be blocked' } });
        return false;
      } catch {
        return true;
      }
    }
  );

  if (tenderCount < 1) throw new Error('Company user could not see buyer tenders.');
  if (bidCount < 1) throw new Error('Company user could not see supplier bids.');
  if (!adminScoreUpdateBlocked) throw new Error('Admin was able to update evaluation scores.');

  console.log('RLS verification passed for company buyer/supplier context and admin score restrictions.');
}

main()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

