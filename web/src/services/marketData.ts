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

export interface SwingTradeStock {
  symbol: string;
  name: string;
  price: string;
  support: string;
  resistance: string;
  change: string;
  signal: 'Buy' | 'Strong Buy' | 'Hold';
  rationale: string;
}

export interface MonthlyPerformer {
  symbol: string;
  name: string;
  price: string;
  gain1M: string;
  sparkline: number[];
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
  SWING_STOCKS: 'wealth_swing_stocks_cache',
  MONTHLY_PERFORMERS: 'wealth_monthly_performers_cache',
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

export function forceRefreshAll(): Promise<[StockData[], TickerData[], MutualFundData[], DebtFundData[], SwingTradeStock[], MonthlyPerformer[]]> {
  clearCache();
  return Promise.all([
    getStockData(true),
    getTickerData(true),
    getMutualFundData(true),
    getDebtFundData(true),
    getSwingTradingStocks(true),
    getMonthlyPerformers(true)
  ]);
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

// Seeded Random Helper to generate deterministic simulated daily updates
function getSeededRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function getSeedForToday(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const SWING_CANDIDATES = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', basePrice: 2450 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', basePrice: 3400 },
  { symbol: 'INFY', name: 'Infosys Ltd.', basePrice: 1550 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', basePrice: 1600 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', basePrice: 920 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', basePrice: 620 },
  { symbol: 'SBIN', name: 'State Bank of India', basePrice: 580 },
  { symbol: 'BHARTARTL', name: 'Bharti Airtel Ltd.', basePrice: 870 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', basePrice: 2350 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', basePrice: 960 },
  { symbol: 'ITC', name: 'ITC Ltd.', basePrice: 440 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', basePrice: 9700 },
];

const MONTHLY_PERFORMER_CANDIDATES = [
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Ltd.', basePrice: 1120 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Ltd.', basePrice: 1850 },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd.', basePrice: 125 },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd.', basePrice: 130 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', basePrice: 2800 },
  { symbol: 'TRENT', name: 'Trent Ltd.', basePrice: 2050 },
  { symbol: 'ADANIPOWER', name: 'Adani Power Ltd.', basePrice: 320 },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Dev Agency', basePrice: 105 },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', basePrice: 118 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd.', basePrice: 245 },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals Ltd.', basePrice: 110 },
  { symbol: 'PFC', name: 'Power Finance Corporation Ltd.', basePrice: 220 },
];

async function fetchSwingStocksFromAPI(): Promise<SwingTradeStock[]> {
  const seed = getSeedForToday();
  const rng = getSeededRandom(seed);
  
  // Shuffle candidates and pick 10
  const shuffled = [...SWING_CANDIDATES].sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 10);
  
  const rationales = [
    'Consolidation breakout above daily resistance.',
    'RSI divergence indicating strong reversal from support.',
    'Rebounding from 50-day moving average on high volume.',
    'Bullish flag pattern completion with target up to 8%.',
    'MACD bullish crossover confirmed on daily chart.',
    'Forming higher high and higher low on weekly timeframes.',
    'Hammer candlestick forming at major demand zone.',
    'Volume breakout indicating institutional accumulation.',
  ];

  return selected.map(stock => {
    // Generate current price with small fluctuation (-1.5% to +2.5%) based on seed
    const pct = -0.015 + rng() * 0.04;
    const currentPrice = Math.round(stock.basePrice * (1 + pct) * 10) / 10;
    const change = Math.round(pct * 1000) / 10;
    
    // Support and resistance
    const support = Math.round(currentPrice * (0.95 - rng() * 0.02) * 10) / 10;
    const resistance = Math.round(currentPrice * (1.05 + rng() * 0.03) * 10) / 10;
    
    // Signal
    const signals: ('Buy' | 'Strong Buy' | 'Hold')[] = ['Buy', 'Strong Buy', 'Hold'];
    const signalIndex = Math.floor(rng() * 3);
    const signal = signals[signalIndex];
    
    const rationalIndex = Math.floor(rng() * rationales.length);
    const rationale = rationales[rationalIndex];

    return {
      symbol: stock.symbol,
      name: stock.name,
      price: `₹${currentPrice.toLocaleString('en-IN')}`,
      support: `₹${support.toLocaleString('en-IN')}`,
      resistance: `₹${resistance.toLocaleString('en-IN')}`,
      change: `${change >= 0 ? '+' : ''}${change}%`,
      signal,
      rationale
    };
  });
}

async function fetchMonthlyPerformersFromAPI(): Promise<MonthlyPerformer[]> {
  const seed = getSeedForToday() + 42; // different seed for monthly performers
  const rng = getSeededRandom(seed);
  
  const shuffled = [...MONTHLY_PERFORMER_CANDIDATES].sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 10);
  
  return selected.map(stock => {
    // 1-month gain (high gainers, e.g. +12% to +55%)
    const gainVal = Math.round((12 + rng() * 43) * 10) / 10;
    const currentPrice = Math.round(stock.basePrice * (1 + (rng() - 0.5) * 0.1) * 10) / 10;
    
    // Generate simulated sparkline values (7 points) with an upward trend
    let val = 20 + Math.floor(rng() * 20);
    const sparkline: number[] = [val];
    for (let i = 0; i < 6; i++) {
      val += Math.floor(rng() * 20) - (rng() < 0.2 ? 5 : 0);
      val = Math.min(100, Math.max(0, val));
      sparkline.push(val);
    }

    return {
      symbol: stock.symbol,
      name: stock.name,
      price: `₹${currentPrice.toLocaleString('en-IN')}`,
      gain1M: `+${gainVal}%`,
      sparkline
    };
  }).sort((a, b) => parseFloat(b.gain1M) - parseFloat(a.gain1M));
}

export async function getSwingTradingStocks(forceRefresh = false): Promise<SwingTradeStock[]> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<SwingTradeStock[]>(CACHE_KEYS.SWING_STOCKS);
    if (cached) return cached;
  }

  try {
    const data = await fetchSwingStocksFromAPI();
    setCache(data, CACHE_KEYS.SWING_STOCKS);
    return data;
  } catch (error) {
    console.error('Failed to fetch swing stock data:', error);
    const cached = getCache<SwingTradeStock[]>(CACHE_KEYS.SWING_STOCKS);
    if (cached) return cached;
    return [];
  }
}

export async function getMonthlyPerformers(forceRefresh = false): Promise<MonthlyPerformer[]> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<MonthlyPerformer[]>(CACHE_KEYS.MONTHLY_PERFORMERS);
    if (cached) return cached;
  }

  try {
    const data = await fetchMonthlyPerformersFromAPI();
    setCache(data, CACHE_KEYS.MONTHLY_PERFORMERS);
    return data;
  } catch (error) {
    console.error('Failed to fetch monthly performer data:', error);
    const cached = getCache<MonthlyPerformer[]>(CACHE_KEYS.MONTHLY_PERFORMERS);
    if (cached) return cached;
    return [];
  }
}
