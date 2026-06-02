# ProcureX Architecture Notes

ProcureX is organized as a modular procurement platform:

- `client` hosts the production React frontend.
- `server` hosts Express APIs, Prisma, RLS-aware database access, and module boundaries.
- `shared` holds API contracts and shared enums.
- `ml-service` is reserved for future Python intelligence workloads.

The static prototype in `../procurex-ui` remains the product and UI design reference. The production client owns generated React components under `client/src/features/*/components/procurex/` and does not serve the prototype folder.
