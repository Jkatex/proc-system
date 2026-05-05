# ProcureX UI

This folder contains the static front-end for the ProcureX user interface.

## Recent Improvements

- **Fixed Loading Issues**: Replaced static "Loading..." messages with animated spinners that automatically retry until pages load
- **Enhanced Navigation**: Added a sticky navigation header with back buttons and home navigation for easier page transitions
- **Better User Experience**: Improved loading states and navigation flow throughout the application

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

## Features

- **Single Page Application (SPA)**: Smooth navigation without page reloads
- **Role-based Access**: Different dashboards for admins, buyers, and suppliers
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Loading**: Animated loading states while content loads
- **Easy Navigation**: Back buttons and home navigation on every page

## Navigation Flow

1. **Welcome Page**: Landing page with feature overview
2. **Role Selection**: Choose between buyer, supplier, or admin
3. **Identity Verification**: IAM verification process
4. **Dashboard**: Role-specific dashboard with relevant features
5. **Marketplace**: Browse and interact with tenders
6. **Tender Management**: Create, evaluate, and award tenders

## Notes

- The UI uses Chart.js from a CDN, so an internet connection is required to load charts.
- No build step is needed: the app runs as plain static files.
- If you add new files or pages, ensure they are referenced correctly from `index.html`.
- Pages load asynchronously - the app will show loading spinners until content is ready.
