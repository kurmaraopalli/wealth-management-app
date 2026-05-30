# Wealth Management App

This workspace contains a dual-app scaffold:

- `web/` — React + Vite web application
- `mobile/` — Expo React Native mobile application

Both apps include:
- Homepage
- Equities
- Mutual Funds
- Debt Funds
- Foreign Portfolio

## Run the Web App

1. Open `c:\Khavish_Workspace\Wealth management app\web`
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`

## Run the Mobile App

1. Open `c:\Khavish_Workspace\Wealth management app\mobile`
2. Install dependencies: `npm install`
3. Start Expo: `npm start`

## GitHub Deployment (Web App)

This project includes a GitHub Actions workflow that builds the web app and deploys it to GitHub Pages.

1. Create a GitHub repository and push this workspace to it.
2. Ensure your default branch is `main` or `master`.
3. The workflow in `.github/workflows/deploy-web.yml` will run automatically on each push.
4. After the workflow completes, enable GitHub Pages using the repository settings and select the GitHub Pages deployment source if required.

> Note: The mobile app is not deployed to GitHub Pages. The workflow only publishes the web app from `web/dist`.

---

The scaffold is ready for further styling, data integration, and backend services.