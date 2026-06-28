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

## Dynamic Data Integration

The web application now features **dynamic market data** with automatic daily updates:

### Features
- **24-hour caching**: Data is cached locally and refreshed automatically once per day
- **Manual refresh**: Users can force refresh data using the 🔄 button on any page
- **Fallback to mock data**: If API calls fail, the app gracefully falls back to mock data
- **Last updated timestamp**: Shows when data was last fetched

### Data Sources
Currently using mock data as placeholders. To integrate real market data:

1. **Stock Data**: Update `fetchStocksFromAPI()` in `web/src/services/marketData.ts`
   - Recommended APIs: Alpha Vantage, Yahoo Finance, IEX Cloud
2. **Ticker Data**: Update `fetchTickersFromAPI()` in `web/src/services/marketData.ts`
   - Recommended APIs: Financial market data providers
3. **Mutual Funds**: Update `fetchMutualFundsFromAPI()` in `web/src/services/marketData.ts`
   - Recommended APIs: Morningstar, CRISIL (India), mutual fund providers
4. **Debt Funds**: Update `fetchDebtFundsFromAPI()` in `web/src/services/marketData.ts`
   - Recommended APIs: Debt fund data providers, bond market APIs

### API Integration Example

```typescript
// In web/src/services/marketData.ts
async function fetchStocksFromAPI(): Promise<StockData[]> {
  // Example with Alpha Vantage
  const response = await fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE...');
  const data = await response.json();
  // Transform API response to StockData format
  return transformedData;
}
```

### Cache Management
- Cache duration: 24 hours
- Storage: Browser localStorage
- Cache keys: `wealth_stocks_cache`, `wealth_tickers_cache`, `wealth_mutual_funds_cache`, `wealth_debt_funds_cache`
- Clear cache: Use `forceRefreshAll()` or clear browser localStorage

## Run the Web App

1. Open `c:\Users\kurma\OneDrive\Documents\Workspace\wealth-management-app\web`
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`

## Run the Mobile App

1. Open `c:\Users\kurma\OneDrive\Documents\Workspace\wealth-management-app\mobile`
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