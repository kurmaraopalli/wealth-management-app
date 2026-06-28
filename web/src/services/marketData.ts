// Market Data Service with caching for daily updates
// Caches data for 24 hours to minimize API calls

export interface StockData {
  symbol: string;
  name: string;
  country: string;
  quantity: number;
  price: string;
  gain: string;
}

export interface TickerData {
  index: string;
  change: string;
  isPositive: boolean;
}

export interface MutualFundData {
  name: string;
  category: string;
  ytd: string;
}

export interface DebtFundData {
  name: string;
  type: string;
  yield: string;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEYS = {
  STOCKS: 'wealth_stocks_cache',
  TICKERS: 'wealth_tickers_cache',
  MUTUAL_FUNDS: 'wealth_mutual_funds_cache',
  DEBT_FUNDS: 'wealth_debt_funds_cache',
  LAST_UPDATE: 'wealth_last_update'
};

// Mock data fallback (used when API fails or for demo)
const MOCK_STOCKS: StockData[] = [
  { symbol: 'TCS', name: 'TCS Ltd.', country: 'India', quantity: 140, price: '₹3,420', gain: '+6.1%' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', country: 'India', quantity: 80, price: '₹2,650', gain: '+5.4%' },
  { symbol: 'INFY', name: 'Infosys Ltd.', country: 'India', quantity: 110, price: '₹1,920', gain: '+4.8%' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', country: 'India', quantity: 90, price: '₹1,730', gain: '+5.9%' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', country: 'India', quantity: 120, price: '₹905', gain: '+4.6%' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', country: 'India', quantity: 70, price: '₹2,680', gain: '+3.7%' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', country: 'India', quantity: 45, price: '₹7,200', gain: '+7.4%' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', country: 'India', quantity: 65, price: '₹2,120', gain: '+4.2%' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', country: 'India', quantity: 55, price: '₹10,150', gain: '+6.0%' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', country: 'India', quantity: 75, price: '₹3,450', gain: '+5.8%' },
  { symbol: 'AAPL', name: 'Apple Inc.', country: 'US', quantity: 50, price: '$175.17', gain: '+8.4%' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', country: 'US', quantity: 35, price: '$330.45', gain: '+5.6%' },
  { symbol: 'AMZN', name: 'Amazon.com', country: 'US', quantity: 18, price: '$145.60', gain: '+9.2%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', country: 'US', quantity: 22, price: '$133.90', gain: '+6.7%' },
  { symbol: 'TSLA', name: 'Tesla Inc.', country: 'US', quantity: 28, price: '$255.22', gain: '+4.1%' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', country: 'US', quantity: 14, price: '$804.34', gain: '+11.5%' },
  { symbol: 'JPM', name: 'JPMorgan Chase', country: 'US', quantity: 40, price: '$176.14', gain: '+3.9%' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', country: 'US', quantity: 30, price: '$168.25', gain: '+4.2%' },
  { symbol: 'V', name: 'Visa Inc.', country: 'US', quantity: 25, price: '$264.90', gain: '+5.1%' },
  { symbol: 'META', name: 'Meta Platforms', country: 'US', quantity: 20, price: '$444.08', gain: '+7.2%' },
  { symbol: 'BABA', name: 'Alibaba Group', country: 'China', quantity: 60, price: '$79.45', gain: '+6.0%' },
  { symbol: 'TCEHY', name: 'Tencent Holdings', country: 'China', quantity: 50, price: '$43.22', gain: '+5.3%' },
  { symbol: 'BIDU', name: 'Baidu Inc.', country: 'China', quantity: 35, price: '$147.10', gain: '+4.8%' },
  { symbol: 'PDD', name: 'PDD Holdings', country: 'China', quantity: 28, price: '$54.90', gain: '+6.9%' },
  { symbol: 'NIO', name: 'NIO Inc.', country: 'China', quantity: 55, price: '$12.40', gain: '+9.8%' },
  { symbol: 'BYD', name: 'BYD Co. Ltd.', country: 'China', quantity: 22, price: '$34.55', gain: '+7.1%' },
  { symbol: 'JD', name: 'JD.com Inc.', country: 'China', quantity: 30, price: '$61.60', gain: '+5.7%' },
  { symbol: 'NTES', name: 'NetEase Inc.', country: 'China', quantity: 18, price: '$78.25', gain: '+4.5%' },
  { symbol: 'LI', name: 'Li Auto Inc.', country: 'China', quantity: 40, price: '$28.30', gain: '+8.2%' },
  { symbol: 'IQ', name: 'iQIYI, Inc.', country: 'China', quantity: 65, price: '$8.55', gain: '+3.6%' },
];

const MOCK_TICKERS: TickerData[] = [
  { index: 'NASDAQ', change: '+1.48%', isPositive: true },
  { index: 'Sensex', change: '-0.32%', isPositive: false },
  { index: 'FTSE 100', change: '+0.78%', isPositive: true },
];

const MOCK_MUTUAL_FUNDS: MutualFundData[] = [
  { name: 'ABC Large Cap Fund', category: 'Large Cap', ytd: '12.2%' },
  { name: 'PQR Mid Cap Fund', category: 'Mid Cap', ytd: '15.1%' },
  { name: 'XYZ Flexi Cap Fund', category: 'Flexi Cap', ytd: '14.3%' },
  { name: 'Global Equity Fund', category: 'International', ytd: '11.8%' },
  { name: 'Debt Hybrid Fund', category: 'Hybrid', ytd: '9.6%' },
  { name: 'Small Cap Advantage', category: 'Small Cap', ytd: '18.4%' },
  { name: 'ELSS Tax Saver', category: 'ELSS', ytd: '10.9%' },
  { name: 'Value Fund Strategy', category: 'Value', ytd: '13.7%' },
  { name: 'Dividend Yield Fund', category: 'Dividend', ytd: '8.5%' },
  { name: 'Balanced Advantage Fund', category: 'Balanced', ytd: '10.1%' },
];

const MOCK_DEBT_FUNDS: DebtFundData[] = [
  { name: 'Secure Income Fund', type: 'Short Duration', yield: '6.4%' },
  { name: 'AAA Corporate Bond Fund', type: 'Corporate Bond', yield: '7.1%' },
  { name: 'Government Securities Fund', type: 'Gilt', yield: '6.0%' },
  { name: 'Dynamic Bond Fund', type: 'Dynamic Bond', yield: '6.7%' },
  { name: 'Medium Duration Fund', type: 'Medium Duration', yield: '6.5%' },
  { name: 'Liquid Fund', type: 'Ultra Short Duration', yield: '5.1%' },
  { name: 'Credit Risk Fund', type: 'Credit Risk', yield: '7.8%' },
  { name: 'Income Advantage Fund', type: 'Income', yield: '6.9%' },
  { name: 'Banking & PSU Debt Fund', type: 'Banking & PSU', yield: '6.6%' },
  { name: 'Dynamic Gilt Fund', type: 'Dynamic Gilt', yield: '6.2%' },
];

// Cache management
function isCacheValid(): boolean {
  const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
  if (!lastUpdate) return false;
  const now = Date.now();
  return (now - parseInt(lastUpdate)) < CACHE_DURATION;
}

function setCache(data: any, key: string): void {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
}

function getCache<T>(key: string): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

function clearCache(): void {
  Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
}

// API fetching (placeholder - replace with actual API calls)
async function fetchStocksFromAPI(): Promise<StockData[]> {
  // TODO: Replace with actual API call
  // Example: fetch from Alpha Vantage, Yahoo Finance, etc.
  // For now, return mock data with slight randomization to simulate live data
  return MOCK_STOCKS.map(stock => ({
    ...stock,
    price: stock.price,
    gain: stock.gain
  }));
}

async function fetchTickersFromAPI(): Promise<TickerData[]> {
  // TODO: Replace with actual API call
  // Example: fetch from financial market data API
  return MOCK_TICKERS;
}

async function fetchMutualFundsFromAPI(): Promise<MutualFundData[]> {
  // TODO: Replace with actual API call
  // Example: fetch from mutual fund data provider
  return MOCK_MUTUAL_FUNDS;
}

async function fetchDebtFundsFromAPI(): Promise<DebtFundData[]> {
  // TODO: Replace with actual API call
  // Example: fetch from debt fund data provider
  return MOCK_DEBT_FUNDS;
}

// Public API
export async function getStockData(forceRefresh = false): Promise<StockData[]> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<StockData[]>(CACHE_KEYS.STOCKS);
    if (cached) return cached;
  }

  try {
    const data = await fetchStocksFromAPI();
    setCache(data, CACHE_KEYS.STOCKS);
    return data;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    // Return cached data if available, even if expired
    const cached = getCache<StockData[]>(CACHE_KEYS.STOCKS);
    if (cached) return cached;
    // Fallback to mock data
    return MOCK_STOCKS;
  }
}

export async function getTickerData(forceRefresh = false): Promise<TickerData[]> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<TickerData[]>(CACHE_KEYS.TICKERS);
    if (cached) return cached;
  }

  try {
    const data = await fetchTickersFromAPI();
    setCache(data, CACHE_KEYS.TICKERS);
    return data;
  } catch (error) {
    console.error('Failed to fetch ticker data:', error);
    const cached = getCache<TickerData[]>(CACHE_KEYS.TICKERS);
    if (cached) return cached;
    return MOCK_TICKERS;
  }
}

export function getLastUpdateTime(): Date | null {
  const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
  if (!lastUpdate) return null;
  return new Date(parseInt(lastUpdate));
}

export function forceRefreshAll(): Promise<[StockData[], TickerData[], MutualFundData[], DebtFundData[]]> {
  clearCache();
  return Promise.all([getStockData(true), getTickerData(true), getMutualFundData(true), getDebtFundData(true)]);
}

export async function getMutualFundData(forceRefresh = false): Promise<MutualFundData[]> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<MutualFundData[]>(CACHE_KEYS.MUTUAL_FUNDS);
    if (cached) return cached;
  }

  try {
    const data = await fetchMutualFundsFromAPI();
    setCache(data, CACHE_KEYS.MUTUAL_FUNDS);
    return data;
  } catch (error) {
    console.error('Failed to fetch mutual fund data:', error);
    const cached = getCache<MutualFundData[]>(CACHE_KEYS.MUTUAL_FUNDS);
    if (cached) return cached;
    return MOCK_MUTUAL_FUNDS;
  }
}

export async function getDebtFundData(forceRefresh = false): Promise<DebtFundData[]> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<DebtFundData[]>(CACHE_KEYS.DEBT_FUNDS);
    if (cached) return cached;
  }

  try {
    const data = await fetchDebtFundsFromAPI();
    setCache(data, CACHE_KEYS.DEBT_FUNDS);
    return data;
  } catch (error) {
    console.error('Failed to fetch debt fund data:', error);
    const cached = getCache<DebtFundData[]>(CACHE_KEYS.DEBT_FUNDS);
    if (cached) return cached;
    return MOCK_DEBT_FUNDS;
  }
}
