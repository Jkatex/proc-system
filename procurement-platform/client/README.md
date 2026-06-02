# ProcureX Client

Production React frontend for the ProcureX procurement platform.

## Stack

- Vite + React + TypeScript
- React Router route guards and legacy `?page=` redirects
- Redux Toolkit state slices per procurement module
- MUI controls themed with ProcureX CSS variables
- Axios-compatible API adapter layer with typed mock fixtures
- i18next English/Swahili localization
- Recharts dashboard charts
- Vitest + React Testing Library

## Commands

From `procurement-platform/`:

```powershell
npm run dev:client
npm run build:client
npm run test:client
npm run lint:client
npm run generate:client:procurex-pages
```

## Source Layout

```text
src/
|-- app/                 # providers, router, store, guards
|-- i18n/                # English and Swahili dictionaries
|-- styles/              # ProcureX tokens, globals, MUI theme
|-- shared/              # reusable components, data, API utilities
`-- features/            # public, auth, identity, workspace, procurement, bidding, evaluation, awards, communication, records, admin, documents
```

ProcureX design-parity pages live in each feature folder under `components/procurex/`. They are generated React components owned by the client. The root `../procurex-ui` folder is only the design reference and is not copied into or served by the production client.

## Product Model

The frontend follows the backend schema:

- Account types are `USER` and `ADMIN`.
- Buyer and supplier are organization capabilities, not login roles.
- A normal verified user organization can act as buyer, supplier, or both.

The first implementation uses mock adapters because backend module routes are still status endpoints. Replace each feature API adapter with real backend calls as the module endpoints mature.
