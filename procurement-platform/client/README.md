# ProcureX Client

The production client will be built here later. For now, the source of truth for UI behavior, product copy, and visual workflow remains:

```text
../../procurex-ui
```

## UI Page to Backend Module Map

| UI page or flow | Backend module |
| --- | --- |
| `register`, `sign-in`, `iam-verification`, `verification-status` | `identity`, `organization`, `documents` |
| `workspace-dashboard`, `app-launcher` | `identity`, `organization`, `procurement`, `bidding`, `communication`, `records` |
| `marketplace`, `guest-marketplace` | `procurement`, `organization`, `intelligence` |
| `create-tender`, `tender-publication`, `tender-details` | `procurement`, `documents`, `communication`, `compliance-admin` |
| `supplier-tender-detail`, `bidding-workspace` | `procurement`, `bidding`, `documents`, `communication` |
| `bid-evaluation` | `evaluation`, `bidding`, `procurement`, `compliance-admin` |
| `award-recommendation`, `contract-negotiation` | `evaluation`, `award-contract`, `documents`, `communication` |
| `post-award-tracking` | `award-contract`, `financial`, `records`, `communication` |
| `records-history` | `records`, `procurement`, `bidding`, `award-contract`, `financial` |
| `communication-center` | `communication`, `documents`, `procurement` |
| `admin-dashboard`, `admin-search` | `compliance-admin`, `identity`, `organization`, `records`, `intelligence` |

Keep new client work visually consistent with `../../procurex-ui/styles/design-system.css` and behaviorally consistent with `../../procurex-ui/js/app.js`.

