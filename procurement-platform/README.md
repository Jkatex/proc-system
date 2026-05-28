# ProcureX Procurement Platform

Canonical development workspace for the production ProcureX platform.

The existing `../procurex-ui` folder remains the static prototype and UI/workflow reference. This monorepo contains the backend, database, shared contracts, local infrastructure, documentation, and future service folders needed to turn that prototype into a production system.

## Structure

```text
procurement-platform/
|-- client/              # UI integration placeholder; references ../procurex-ui
|-- server/              # TypeScript Express backend, Prisma, database seed
|-- ml-service/          # Future Python/FastAPI intelligence services
|-- shared/              # Shared contracts, DTOs, and enums
|-- docker/              # Docker notes and future Dockerfiles
|-- docs/                # Architecture, database, and API documentation
|-- scripts/             # Operational scripts
|-- .github/workflows/   # CI placeholders
|-- docker-compose.yml
`-- package.json
```

## Development

```powershell
cd procurement-platform
npm install
Copy-Item server/.env.example server/.env
npm run infra:up
npm run db:validate
npm run db:migrate
npm run db:seed:twice
npm test
```

## Product Rules Captured Here

- Login account type is only `USER` or `ADMIN`.
- A normal user belongs to a company account.
- A company can act as buyer, supplier, or both through organization capabilities and profiles.
- Admin is a platform compliance account, not a buyer or supplier role.
- Buyer, supplier, evaluator, and approver behavior is represented by organization capabilities and workflow assignments.

