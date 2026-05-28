# Database Foundation

The corrected Prisma model lives in `server/prisma/schema.prisma`.

## Core Decisions

- Identity roles are not buyer/supplier roles. Accounts are only `USER` or `ADMIN`.
- A `USER` belongs to a company through `OrganizationMember`.
- A company can act as buyer, supplier, or both through `OrganizationCapability`.
- Optional `BuyerProfile` and `SupplierProfile` belong to the same `Organization`.
- Tender ownership uses `buyerOrgId`.
- Bid ownership uses both `buyerOrgId` and `supplierOrgId`.
- Evaluation permissions use workflow assignments and RLS, not broad identity roles.

## Migration

The initial SQL migration is generated from Prisma and then has RLS SQL appended:

```text
server/prisma/migrations/202605280001_init/migration.sql
```

Reusable RLS source files live in:

```text
server/prisma/sql/rls/
```

## Verification

With Docker running:

```powershell
npm run infra:up
npm run db:migrate
npm run db:seed:twice
npm --workspace server run verify:rls
```

