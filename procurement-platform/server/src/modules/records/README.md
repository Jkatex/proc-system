# Module Skeleton

Each ProcureX backend module follows the same starting shape:

- `routes.ts` defines HTTP endpoints.
- `controller.ts` handles HTTP transport concerns.
- `service.ts` owns business behavior.
- `repository.ts` owns persistence and external data access.
- `validators.ts` owns Zod validation.
- `types.ts` owns module-local contracts.
- `__tests__/` contains focused module tests.

