# ProcureX UI Parity

The static `procurex-ui` prototype is the visual and wording source of truth.

The React client does not serve the prototype folder. The production frontend owns generated React components under:

```text
client/src/features/*/components/procurex/
```

Those components are generated from the design reference so the client can run on its own while preserving the prototype wording, classes, page order, and card structure.

## Screenshot Capture

Start the React client:

```powershell
npm run dev:client
```

Capture screenshots:

```powershell
npm --workspace client run ui:parity:screenshots
```

Output goes to:

```text
docs/ui-parity/screenshots/
```

The script captures:

- reference pages from the external workspace `procurex-ui/index.html?page=...`
- React target routes such as `/procurement/marketplace`
- desktop and mobile viewport sizes

## Migration Rule

When replacing a parity frame with JSX, the React page must preserve:

- exact English wording
- exact section order
- exact card structure
- exact CSS class names where the prototype defines them
- exact navigation labels and visible workflow labels
- English/Swahili localization support without changing English layout
