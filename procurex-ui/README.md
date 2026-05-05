# ProcureX UI

This folder contains the static front-end for the ProcureX user interface.

## Run locally

### Option 1: Open directly in your browser
1. Open `procurex-ui/index.html` in your preferred browser.
2. The UI should load directly because it is a static HTML/CSS/JS app.

> Note: Some browsers restrict loading local files for advanced features. If you see issues, use a local server instead.

### Option 2: Run a local development server

#### Using Python 3
1. Open a terminal in the `procurex-ui` folder.
2. Run one of the following commands:

- Python 3 on Windows/macOS/Linux:
  ```powershell
  python -m http.server 8000
  ```
- If `python` is not available, try:
  ```powershell
  python3 -m http.server 8000
  ```

3. Open your browser and go to:

```text
http://localhost:8000
```

#### Using VS Code Live Server
1. Install the **Live Server** extension.
2. Open the `procurex-ui` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.

## Notes

- The UI uses Chart.js from a CDN, so an internet connection is required to load charts.
- No build step is needed: the app runs as plain static files.
- If you add new files or pages, ensure they are referenced correctly from `index.html`.
