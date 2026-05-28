# ProcureX Architecture Notes

ProcureX is organized as a modular procurement platform:

- `client` will eventually host the production frontend.
- `server` hosts Express APIs, Prisma, RLS-aware database access, and module boundaries.
- `shared` holds API contracts and shared enums.
- `ml-service` is reserved for future Python intelligence workloads.

The static prototype in `../procurex-ui` remains the product and UI reference until a production frontend is introduced.

