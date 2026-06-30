// Market Data Service — live quotes with smart caching & simulated fallbacks

export interface StockData {
  symbol: string;
  name: string;
  country: string;
  quantity: number;
  price: string;
  priceNum: number;
  gain: string;
  gainNum: number;
  dayChange: string;
  dayChangeNum: number;
  currency: 'INR' | 'USD';
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
  value?: string;
}

export interface MutualFundData {
  name: string;
  category: string;
  ytd: string;
  ytdNum: number;
  nav: string;
}

export interface DebtFundData {
  name: string;
  type: string;
  yield: string;
  yieldNum: number;
}

export interface GlobalIndexData {
  name: string;
  region: string;
  flag: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface ForeignEquityData {
  name: string;
  ticker: string;
  region: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export interface ForeignDebtData {
  issuer: string;
  rating: string;
  assetClass: string;
  yield: string;
}

export interface PortfolioAsset {
  label: string;
  percent: number;
  value: number;
  valueFormatted: string;
  color: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalValueFormatted: string;
  ytdGain: string;
  ytdPositive: boolean;
  dayChange: string;
  dayChangePositive: boolean;
  assets: PortfolioAsset[];
  holdingsCount: number;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const USD_TO_INR = 84;

const CACHE_KEYS = {
  STOCKS: 'wealth_stocks_cache',
  TICKERS: 'wealth_tickers_cache',
  MUTUAL_FUNDS: 'wealth_mutual_funds_cache',
  DEBT_FUNDS: 'wealth_debt_funds_cache',
  SWING_STOCKS: 'wealth_swing_stocks_cache',
  MONTHLY_PERFORMERS: 'wealth_monthly_performers_cache',
  GLOBAL_INDEXES: 'wealth_global_indexes_cache',
  FOREIGN_EQUITIES: 'wealth_foreign_equities_cache',
  FOREIGN_DEBT: 'wealth_foreign_debt_cache',
  PORTFOLIO: 'wealth_portfolio_cache',
  LAST_UPDATE: 'wealth_last_update',
};

// ─── Seeded random (changes every 15 min for live feel) ─────────────────────

function getTimeSeed(): number {
  const now = Date.now();
  const slot = Math.floor(now / CACHE_DURATION);
  const d = new Date();
  return slot + d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPct(n: number, signed = true): string {
  const prefix = signed && n >= 0 ? '+' : '';
  return `${prefix}${n.toFixed(2)}%`;
}

function applyJitter(base: number, rng: () => number, range = 0.03): number {
  return base * (1 + (rng() - 0.5) * 2 * range);
}

// ─── Yahoo Finance live fetch ───────────────────────────────────────────────

interface QuoteResult {
  price: number;
  changePercent: number;
  previousClose: number;
}

async function fetchYahooQuote(yahooSymbol: string): Promise<QuoteResult | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;

  const parse = (json: unknown): QuoteResult | null => {
    const meta = (json as { chart?: { result?: { meta?: Record<string, number> }[] } })
      ?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    const price = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const changePercent = prev ? ((price - prev) / prev) * 100 : 0;
    return { price, changePercent, previousClose: prev };
  };

  try {
    const res = await fetch(url);
    if (res.ok) return parse(await res.json());
  } catch {
    /* try proxy */
  }

  try {
    const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res = await fetch(proxy);
    if (res.ok) return parse(await res.json());
  } catch {
    /* try next proxy */
  }

  try {
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxy);
    if (res.ok) {
      const wrapper = await res.json();
      return parse(JSON.parse(wrapper.contents));
    }
  } catch {
    /* fall through */
  }

  return null;
}

interface HistoryResult {
  currentPrice: number;
  changePercent: number; // daily change
  gain1M: number; // 30-day gain
  sparkline: number[];
  minPrice: number;
  maxPrice: number;
  rsi: number;
}

function calculateRSI(prices: number[]): number {
  if (prices.length < 15) {
    if (prices.length < 2) return 50;
    let gains = 0, losses = 0;
    for (let i = 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    if (gains + losses === 0) return 50;
    return (gains / (gains + losses)) * 100;
  }

  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let avgGain = gains.slice(0, 14).reduce((a, b) => a + b, 0) / 14;
  let avgLoss = losses.slice(0, 14).reduce((a, b) => a + b, 0) / 14;

  for (let i = 14; i < gains.length; i++) {
    avgGain = (avgGain * 13 + gains[i]) / 14;
    avgLoss = (avgLoss * 13 + losses[i]) / 14;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function generateMockHistory(
  basePrice: number,
  rng: () => number
): HistoryResult {
  const prices: number[] = [basePrice];
  let current = basePrice;
  for (let i = 0; i < 20; i++) {
    const change = (rng() - 0.48) * 0.04;
    current = current * (1 + change);
    prices.push(current);
  }
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];
  const changePercent = ((currentPrice - prevPrice) / prevPrice) * 100;
  const gain1M = ((currentPrice - prices[0]) / prices[0]) * 100;

  const range = maxPrice - minPrice;
  const sparkline = prices.map((p) => (range > 0 ? ((p - minPrice) / range) * 100 : 50));
  const rsi = calculateRSI(prices);

  return {
    currentPrice,
    changePercent,
    gain1M,
    sparkline,
    minPrice,
    maxPrice,
    rsi,
  };
}

async function fetchYahooHistory(yahooSymbol: string): Promise<HistoryResult | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1mo`;

  const parse = (json: any): HistoryResult | null => {
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta?.regularMarketPrice) return null;

    const closePrices: number[] = result?.indicators?.quote?.[0]?.close?.filter((p: any) => typeof p === 'number') ?? [];
    if (closePrices.length === 0) return null;

    const currentPrice = meta.regularMarketPrice;
    const firstPrice = closePrices[0];
    const gain1M = firstPrice ? ((currentPrice - firstPrice) / firstPrice) * 100 : 0;

    const minPrice = Math.min(...closePrices);
    const maxPrice = Math.max(...closePrices);

    const range = maxPrice - minPrice;
    const sparkline = closePrices.map((p) => (range > 0 ? ((p - minPrice) / range) * 100 : 50));

    const rsi = calculateRSI(closePrices);
    const prev = meta.previousClose ?? (closePrices.length > 1 ? closePrices[closePrices.length - 2] : currentPrice);
    const changePercent = prev ? ((currentPrice - prev) / prev) * 100 : 0;

    return {
      currentPrice,
      changePercent,
      gain1M,
      sparkline,
      minPrice,
      maxPrice,
      rsi,
    };
  };

  try {
    const res = await fetch(url);
    if (res.ok) return parse(await res.json());
  } catch {
    /* try proxy */
  }

  try {
    const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res = await fetch(proxy);
    if (res.ok) return parse(await res.json());
  } catch {
    /* try next proxy */
  }

  try {
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxy);
    if (res.ok) {
      const wrapper = await res.json();
      return parse(JSON.parse(wrapper.contents));
    }
  } catch {
    /* fall through */
  }

  return null;
}


async function fetchQuotesMap(
  symbols: Record<string, string>
): Promise<Map<string, QuoteResult>> {
  const entries = Object.entries(symbols);
  const results = await Promise.all(
    entries.map(async ([key, yahoo]) => {
      const quote = await fetchYahooQuote(yahoo);
      return [key, quote] as const;
    })
  );
  const map = new Map<string, QuoteResult>();
  for (const [key, quote] of results) {
    if (quote) map.set(key, quote);
  }
  return map;
}

// ─── Holdings & index definitions ───────────────────────────────────────────

interface HoldingDef {
  symbol: string;
  yahoo: string;
  name: string;
  country: string;
  quantity: number;
  currency: 'INR' | 'USD';
  assetClass: 'equity' | 'international';
  basePrice: number;
  baseGain: number;
}

const HOLDINGS: HoldingDef[] = [
  { symbol: 'TCS', yahoo: 'TCS.NS', name: 'TCS Ltd.', country: 'India', quantity: 140, currency: 'INR', assetClass: 'equity', basePrice: 2094, baseGain: 6.1 },
  { symbol: 'RELIANCE', yahoo: 'RELIANCE.NS', name: 'Reliance Industries', country: 'India', quantity: 80, currency: 'INR', assetClass: 'equity', basePrice: 1302, baseGain: 5.4 },
  { symbol: 'INFY', yahoo: 'INFY.NS', name: 'Infosys Ltd.', country: 'India', quantity: 110, currency: 'INR', assetClass: 'equity', basePrice: 1041, baseGain: 4.8 },
  { symbol: 'HDFCBANK', yahoo: 'HDFCBANK.NS', name: 'HDFC Bank', country: 'India', quantity: 90, currency: 'INR', assetClass: 'equity', basePrice: 799, baseGain: 5.9 },
  { symbol: 'ICICIBANK', yahoo: 'ICICIBANK.NS', name: 'ICICI Bank', country: 'India', quantity: 120, currency: 'INR', assetClass: 'equity', basePrice: 1388, baseGain: 4.6 },
  { symbol: 'HINDUNILVR', yahoo: 'HINDUNILVR.NS', name: 'Hindustan Unilever', country: 'India', quantity: 70, currency: 'INR', assetClass: 'equity', basePrice: 2151, baseGain: 3.7 },
  { symbol: 'BAJFINANCE', yahoo: 'BAJFINANCE.NS', name: 'Bajaj Finance', country: 'India', quantity: 45, currency: 'INR', assetClass: 'equity', basePrice: 988, baseGain: 7.4 },
  { symbol: 'KOTAKBANK', yahoo: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', country: 'India', quantity: 65, currency: 'INR', assetClass: 'equity', basePrice: 396, baseGain: 4.2 },
  { symbol: 'MARUTI', yahoo: 'MARUTI.NS', name: 'Maruti Suzuki India', country: 'India', quantity: 55, currency: 'INR', assetClass: 'equity', basePrice: 13412, baseGain: 6.0 },
  { symbol: 'ASIANPAINT', yahoo: 'ASIANPAINT.NS', name: 'Asian Paints', country: 'India', quantity: 75, currency: 'INR', assetClass: 'equity', basePrice: 2657, baseGain: 5.8 },
  { symbol: 'AAPL', yahoo: 'AAPL', name: 'Apple Inc.', country: 'US', quantity: 50, currency: 'USD', assetClass: 'international', basePrice: 175.17, baseGain: 8.4 },
  { symbol: 'MSFT', yahoo: 'MSFT', name: 'Microsoft Corp.', country: 'US', quantity: 35, currency: 'USD', assetClass: 'international', basePrice: 330.45, baseGain: 5.6 },
  { symbol: 'AMZN', yahoo: 'AMZN', name: 'Amazon.com', country: 'US', quantity: 18, currency: 'USD', assetClass: 'international', basePrice: 145.6, baseGain: 9.2 },
  { symbol: 'GOOGL', yahoo: 'GOOGL', name: 'Alphabet Inc.', country: 'US', quantity: 22, currency: 'USD', assetClass: 'international', basePrice: 133.9, baseGain: 6.7 },
  { symbol: 'TSLA', yahoo: 'TSLA', name: 'Tesla Inc.', country: 'US', quantity: 28, currency: 'USD', assetClass: 'international', basePrice: 255.22, baseGain: 4.1 },
  { symbol: 'NVDA', yahoo: 'NVDA', name: 'NVIDIA Corp.', country: 'US', quantity: 14, currency: 'USD', assetClass: 'international', basePrice: 804.34, baseGain: 11.5 },
  { symbol: 'JPM', yahoo: 'JPM', name: 'JPMorgan Chase', country: 'US', quantity: 40, currency: 'USD', assetClass: 'international', basePrice: 176.14, baseGain: 3.9 },
  { symbol: 'JNJ', yahoo: 'JNJ', name: 'Johnson & Johnson', country: 'US', quantity: 30, currency: 'USD', assetClass: 'international', basePrice: 168.25, baseGain: 4.2 },
  { symbol: 'V', yahoo: 'V', name: 'Visa Inc.', country: 'US', quantity: 25, currency: 'USD', assetClass: 'international', basePrice: 264.9, baseGain: 5.1 },
  { symbol: 'META', yahoo: 'META', name: 'Meta Platforms', country: 'US', quantity: 20, currency: 'USD', assetClass: 'international', basePrice: 444.08, baseGain: 7.2 },
  { symbol: 'BABA', yahoo: 'BABA', name: 'Alibaba Group', country: 'China', quantity: 60, currency: 'USD', assetClass: 'international', basePrice: 79.45, baseGain: 6.0 },
  { symbol: 'TCEHY', yahoo: 'TCEHY', name: 'Tencent Holdings', country: 'China', quantity: 50, currency: 'USD', assetClass: 'international', basePrice: 43.22, baseGain: 5.3 },
  { symbol: 'BIDU', yahoo: 'BIDU', name: 'Baidu Inc.', country: 'China', quantity: 35, currency: 'USD', assetClass: 'international', basePrice: 147.1, baseGain: 4.8 },
  { symbol: 'PDD', yahoo: 'PDD', name: 'PDD Holdings', country: 'China', quantity: 28, currency: 'USD', assetClass: 'international', basePrice: 54.9, baseGain: 6.9 },
  { symbol: 'NIO', yahoo: 'NIO', name: 'NIO Inc.', country: 'China', quantity: 55, currency: 'USD', assetClass: 'international', basePrice: 12.4, baseGain: 9.8 },
  { symbol: 'JD', yahoo: 'JD', name: 'JD.com Inc.', country: 'China', quantity: 30, currency: 'USD', assetClass: 'international', basePrice: 61.6, baseGain: 5.7 },
  { symbol: 'NTES', yahoo: 'NTES', name: 'NetEase Inc.', country: 'China', quantity: 18, currency: 'USD', assetClass: 'international', basePrice: 78.25, baseGain: 4.5 },
  { symbol: 'LI', yahoo: 'LI', name: 'Li Auto Inc.', country: 'China', quantity: 40, currency: 'USD', assetClass: 'international', basePrice: 28.3, baseGain: 8.2 },
  { symbol: 'IQ', yahoo: 'IQ', name: 'iQIYI, Inc.', country: 'China', quantity: 65, currency: 'USD', assetClass: 'international', basePrice: 8.55, baseGain: 3.6 },
];

const INDEX_DEFS = [
  { index: 'S&P 500', yahoo: '^GSPC', fallbackChange: 0.42 },
  { index: 'NASDAQ', yahoo: '^IXIC', fallbackChange: 1.48 },
  { index: 'Dow Jones', yahoo: '^DJI', fallbackChange: 0.31 },
  { index: 'Sensex', yahoo: '^BSESN', fallbackChange: -0.32 },
  { index: 'Nifty 50', yahoo: '^NSEI', fallbackChange: -0.18 },
  { index: 'FTSE 100', yahoo: '^FTSE', fallbackChange: 0.78 },
  { index: 'DAX', yahoo: '^GDAXI', fallbackChange: 0.55 },
  { index: 'Nikkei 225', yahoo: '^N225', fallbackChange: 0.92 },
];

const GLOBAL_INDEX_DEFS = [
  { name: 'S&P 500', region: 'United States', flag: '🇺🇸', yahoo: '^GSPC', baseValue: 5280 },
  { name: 'NASDAQ Composite', region: 'United States', flag: '🇺🇸', yahoo: '^IXIC', baseValue: 16780 },
  { name: 'Dow Jones Industrial Average', region: 'United States', flag: '🇺🇸', yahoo: '^DJI', baseValue: 39200 },
  { name: 'FTSE 100', region: 'United Kingdom', flag: '🇬🇧', yahoo: '^FTSE', baseValue: 8120 },
  { name: 'DAX', region: 'Germany', flag: '🇩🇪', yahoo: '^GDAXI', baseValue: 18250 },
  { name: 'CAC 40', region: 'France', flag: '🇫🇷', yahoo: '^FCHI', baseValue: 7980 },
  { name: 'Nikkei 225', region: 'Japan', flag: '🇯🇵', yahoo: '^N225', baseValue: 39850 },
  { name: 'Hang Seng', region: 'Hong Kong', flag: '🇭🇰', yahoo: '^HSI', baseValue: 16820 },
  { name: 'Shanghai Composite', region: 'China', flag: '🇨🇳', yahoo: '000001.SS', baseValue: 3050 },
  { name: 'BSE Sensex', region: 'India', flag: '🇮🇳', yahoo: '^BSESN', baseValue: 73200 },
  { name: 'Nifty 50', region: 'India', flag: '🇮🇳', yahoo: '^NSEI', baseValue: 22250 },
  { name: 'ASX 200', region: 'Australia', flag: '🇦🇺', yahoo: '^AXJO', baseValue: 7820 },
  { name: 'TSX Composite', region: 'Canada', flag: '🇨🇦', yahoo: '^GSPTSE', baseValue: 22450 },
  { name: 'Euro Stoxx 50', region: 'Eurozone', flag: '🇪🇺', yahoo: '^STOXX50E', baseValue: 4920 },
  { name: 'MSCI World', region: 'Global', flag: '🌐', yahoo: 'URTH', baseValue: 142.5 },
];

const MUTUAL_FUND_DEFS = [
  { name: 'ABC Large Cap Fund', category: 'Large Cap', baseYtd: 12.2, baseNav: 48.5 },
  { name: 'PQR Mid Cap Fund', category: 'Mid Cap', baseYtd: 15.1, baseNav: 62.3 },
  { name: 'XYZ Flexi Cap Fund', category: 'Flexi Cap', baseYtd: 14.3, baseNav: 55.8 },
  { name: 'Global Equity Fund', category: 'International', baseYtd: 11.8, baseNav: 38.2 },
  { name: 'Debt Hybrid Fund', category: 'Hybrid', baseYtd: 9.6, baseNav: 22.4 },
  { name: 'Small Cap Advantage', category: 'Small Cap', baseYtd: 18.4, baseNav: 71.6 },
  { name: 'ELSS Tax Saver', category: 'ELSS', baseYtd: 10.9, baseNav: 41.2 },
  { name: 'Value Fund Strategy', category: 'Value', baseYtd: 13.7, baseNav: 36.9 },
  { name: 'Dividend Yield Fund', category: 'Dividend', baseYtd: 8.5, baseNav: 28.7 },
  { name: 'Balanced Advantage Fund', category: 'Balanced', baseYtd: 10.1, baseNav: 33.4 },
];

const DEBT_FUND_DEFS = [
  { name: 'Secure Income Fund', type: 'Short Duration', baseYield: 6.4 },
  { name: 'AAA Corporate Bond Fund', type: 'Corporate Bond', baseYield: 7.1 },
  { name: 'Government Securities Fund', type: 'Gilt', baseYield: 6.0 },
  { name: 'Dynamic Bond Fund', type: 'Dynamic Bond', baseYield: 6.7 },
  { name: 'Medium Duration Fund', type: 'Medium Duration', baseYield: 6.5 },
  { name: 'Liquid Fund', type: 'Ultra Short Duration', baseYield: 5.1 },
  { name: 'Credit Risk Fund', type: 'Credit Risk', baseYield: 7.8 },
  { name: 'Income Advantage Fund', type: 'Income', baseYield: 6.9 },
  { name: 'Banking & PSU Debt Fund', type: 'Banking & PSU', baseYield: 6.6 },
  { name: 'Dynamic Gilt Fund', type: 'Dynamic Gilt', baseYield: 6.2 },
];

const FOREIGN_EQUITY_DEFS = [
  { name: 'Apple Inc.', ticker: 'AAPL', region: 'US Tech', yahoo: 'AAPL', basePrice: 175 },
  { name: 'Microsoft Corp.', ticker: 'MSFT', region: 'US Tech', yahoo: 'MSFT', basePrice: 330 },
  { name: 'Amazon.com Inc.', ticker: 'AMZN', region: 'US Consumer', yahoo: 'AMZN', basePrice: 146 },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', region: 'US Tech', yahoo: 'GOOGL', basePrice: 134 },
  { name: 'Tesla Inc.', ticker: 'TSLA', region: 'US Automotive', yahoo: 'TSLA', basePrice: 255 },
  { name: 'Nestlé S.A.', ticker: 'NESN.SW', region: 'Europe Consumer', yahoo: 'NESN.SW', basePrice: 92 },
  { name: 'ASML Holding', ticker: 'ASML', region: 'Europe Tech', yahoo: 'ASML', basePrice: 920 },
  { name: 'Samsung Electronics', ticker: '005930.KS', region: 'Asia Tech', yahoo: '005930.KS', basePrice: 72000 },
  { name: 'Toyota Motor', ticker: '7203.T', region: 'Asia Automotive', yahoo: '7203.T', basePrice: 2850 },
  { name: 'Roche Holding', ticker: 'ROG.SW', region: 'Europe Healthcare', yahoo: 'ROG.SW', basePrice: 268 },
];

const SWING_CANDIDATES = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', basePrice: 1302, yahoo: 'RELIANCE.NS' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', basePrice: 2094, yahoo: 'TCS.NS' },
  { symbol: 'INFY', name: 'Infosys Ltd.', basePrice: 1041, yahoo: 'INFY.NS' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', basePrice: 799, yahoo: 'HDFCBANK.NS' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', basePrice: 1388, yahoo: 'ICICIBANK.NS' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', basePrice: 423, yahoo: 'TATAMOTORS.NS' },
  { symbol: 'SBIN', name: 'State Bank of India', basePrice: 1036, yahoo: 'SBIN.NS' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', basePrice: 1835, yahoo: 'BHARTIARTL.NS' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', basePrice: 4173, yahoo: 'LT.NS' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', basePrice: 1357, yahoo: 'AXISBANK.NS' },
  { symbol: 'ITC', name: 'ITC Ltd.', basePrice: 291, yahoo: 'ITC.NS' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', basePrice: 13412, yahoo: 'MARUTI.NS' },
];

const MONTHLY_PERFORMER_CANDIDATES = [
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Ltd.', basePrice: 1458, yahoo: 'COCHINSHIP.NS' },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Ltd.', basePrice: 2447, yahoo: 'MAZDOCK.NS' },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd.', basePrice: 238, yahoo: 'RVNL.NS' },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd.', basePrice: 412, yahoo: 'BEL.NS' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', basePrice: 4343, yahoo: 'HAL.NS' },
  { symbol: 'TRENT', name: 'Trent Ltd.', basePrice: 3258, yahoo: 'TRENT.NS' },
  { symbol: 'ADANIPOWER', name: 'Adani Power Ltd.', basePrice: 227, yahoo: 'ADANIPOWER.NS' },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Dev Agency', basePrice: 127, yahoo: 'IREDA.NS' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', basePrice: 190, yahoo: 'TATASTEEL.NS' },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd.', basePrice: 239, yahoo: 'JIOFIN.NS' },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals Ltd.', basePrice: 403, yahoo: 'BHEL.NS' },
  { symbol: 'PFC', name: 'Power Finance Corporation Ltd.', basePrice: 433, yahoo: 'PFC.NS' },
];

const FOREIGN_DEBT_DEFS: ForeignDebtData[] = [
  { issuer: 'US Treasury', rating: 'AA+', assetClass: 'Sovereign Debt', yield: '4.25%' },
  { issuer: 'German Bund', rating: 'AAA', assetClass: 'Sovereign Debt', yield: '2.35%' },
  { issuer: 'Japan Government Bond', rating: 'A+', assetClass: 'Sovereign Debt', yield: '0.72%' },
  { issuer: 'UK Gilt', rating: 'AA', assetClass: 'Sovereign Debt', yield: '4.10%' },
  { issuer: 'France OAT', rating: 'AA', assetClass: 'Sovereign Debt', yield: '3.05%' },
  { issuer: 'Australia Government Bond', rating: 'AAA', assetClass: 'Sovereign Debt', yield: '4.18%' },
  { issuer: 'Canada Government Bond', rating: 'AAA', assetClass: 'Sovereign Debt', yield: '3.42%' },
  { issuer: 'Singapore Government Bond', rating: 'AAA', assetClass: 'Sovereign Debt', yield: '3.15%' },
  { issuer: 'World Bank Bond', rating: 'AAA', assetClass: 'Supranational', yield: '4.55%' },
  { issuer: 'Toyota Motor Credit Bond', rating: 'AAA', assetClass: 'Corporate Debt', yield: '4.82%' },
];

// ─── Cache helpers ────────────────────────────────────────────────────────────

function isCacheValid(): boolean {
  const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
  if (!lastUpdate) return false;
  return Date.now() - parseInt(lastUpdate) < CACHE_DURATION;
}

function setCache(data: unknown, key: string): void {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
}

function getCache<T>(key: string): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

function clearCache(): void {
  Object.values(CACHE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ─── Fetch implementations ────────────────────────────────────────────────────

async function fetchStocksFromAPI(): Promise<StockData[]> {
  const yahooMap = Object.fromEntries(HOLDINGS.map((h) => [h.symbol, h.yahoo]));
  const quotes = await fetchQuotesMap(yahooMap);
  const rng = getSeededRandom(getTimeSeed());

  return HOLDINGS.map((h) => {
    const live = quotes.get(h.symbol);
    const priceNum = live?.price ?? applyJitter(h.basePrice, rng);
    const dayChangeNum = live?.changePercent ?? (rng() - 0.45) * 4;
    const gainNum = h.baseGain + dayChangeNum * 0.3 + (rng() - 0.5) * 0.5;
    const fmt = h.currency === 'INR' ? formatINR : formatUSD;

    return {
      symbol: h.symbol,
      name: h.name,
      country: h.country,
      quantity: h.quantity,
      price: fmt(priceNum),
      priceNum,
      gain: formatPct(gainNum),
      gainNum,
      dayChange: formatPct(dayChangeNum),
      dayChangeNum,
      currency: h.currency,
    };
  });
}

async function fetchTickersFromAPI(): Promise<TickerData[]> {
  const yahooMap = Object.fromEntries(INDEX_DEFS.map((d) => [d.index, d.yahoo]));
  const quotes = await fetchQuotesMap(yahooMap);
  const rng = getSeededRandom(getTimeSeed() + 7);

  return INDEX_DEFS.map((def) => {
    const live = quotes.get(def.index);
    const changeNum = live?.changePercent ?? applyJitter(def.fallbackChange, rng, 0.5);
    const isPositive = changeNum >= 0;
    const value = live?.price
      ? live.price > 1000
        ? live.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : live.price.toFixed(2)
      : undefined;

    return {
      index: def.index,
      change: formatPct(changeNum),
      isPositive,
      value,
    };
  });
}

async function fetchMutualFundsFromAPI(): Promise<MutualFundData[]> {
  const rng = getSeededRandom(getTimeSeed() + 11);
  return MUTUAL_FUND_DEFS.map((f) => {
    const ytdNum = Math.round(applyJitter(f.baseYtd, rng, 0.08) * 10) / 10;
    const nav = applyJitter(f.baseNav, rng, 0.02);
    return {
      name: f.name,
      category: f.category,
      ytd: `${ytdNum.toFixed(1)}%`,
      ytdNum,
      nav: `₹${nav.toFixed(2)}`,
    };
  });
}

async function fetchDebtFundsFromAPI(): Promise<DebtFundData[]> {
  const rng = getSeededRandom(getTimeSeed() + 13);
  return DEBT_FUND_DEFS.map((f) => {
    const yieldNum = Math.round(applyJitter(f.baseYield, rng, 0.04) * 10) / 10;
    return {
      name: f.name,
      type: f.type,
      yield: `${yieldNum.toFixed(1)}%`,
      yieldNum,
    };
  });
}

async function fetchGlobalIndexesFromAPI(): Promise<GlobalIndexData[]> {
  const yahooMap = Object.fromEntries(GLOBAL_INDEX_DEFS.map((d) => [d.name, d.yahoo]));
  const quotes = await fetchQuotesMap(yahooMap);
  const rng = getSeededRandom(getTimeSeed() + 17);

  return GLOBAL_INDEX_DEFS.map((def) => {
    const live = quotes.get(def.name);
    const changeNum = live?.changePercent ?? (rng() - 0.45) * 2.5;
    const valueNum = live?.price ?? applyJitter(def.baseValue, rng, 0.01);
    const isPositive = changeNum >= 0;

    return {
      name: def.name,
      region: def.region,
      flag: def.flag,
      value: valueNum > 1000 ? valueNum.toLocaleString('en-US', { maximumFractionDigits: 0 }) : valueNum.toFixed(2),
      change: formatPct(changeNum),
      isPositive,
    };
  });
}

async function fetchForeignEquitiesFromAPI(): Promise<ForeignEquityData[]> {
  const yahooMap = Object.fromEntries(FOREIGN_EQUITY_DEFS.map((d) => [d.ticker, d.yahoo]));
  const quotes = await fetchQuotesMap(yahooMap);
  const rng = getSeededRandom(getTimeSeed() + 19);

  return FOREIGN_EQUITY_DEFS.map((def) => {
    const live = quotes.get(def.ticker);
    const priceNum = live?.price ?? applyJitter(def.basePrice, rng);
    const changeNum = live?.changePercent ?? (rng() - 0.45) * 3;
    const isPositive = changeNum >= 0;
    const price =
      def.ticker.includes('.KS') || def.ticker.includes('.T')
        ? `${Math.round(priceNum).toLocaleString()}`
        : `$${priceNum.toFixed(2)}`;

    return {
      name: def.name,
      ticker: def.ticker,
      region: def.region,
      price,
      change: formatPct(changeNum),
      isPositive,
    };
  });
}

async function fetchForeignDebtFromAPI(): Promise<ForeignDebtData[]> {
  const rng = getSeededRandom(getTimeSeed() + 23);
  return FOREIGN_DEBT_DEFS.map((d) => {
    const base = parseFloat(d.yield);
    const jittered = Math.round(applyJitter(base, rng, 0.03) * 100) / 100;
    return { ...d, yield: `${jittered.toFixed(2)}%` };
  });
}

async function fetchSwingStocksFromAPI(): Promise<SwingTradeStock[]> {
  const rng = getSeededRandom(getTimeSeed() + 29);

  const shuffled = [...SWING_CANDIDATES].sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 10);

  const results = await Promise.all(
    selected.map(async (stock) => {
      const history = await fetchYahooHistory(stock.yahoo);
      let priceVal: number;
      let changeNum: number;
      let supportVal: number;
      let resistanceVal: number;
      let rsiVal: number;

      if (history) {
        priceVal = history.currentPrice;
        changeNum = history.changePercent;
        supportVal = history.minPrice;
        resistanceVal = history.maxPrice;
        rsiVal = history.rsi;
      } else {
        const mockSeed = stock.symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + getTimeSeed();
        const mock = generateMockHistory(stock.basePrice, getSeededRandom(mockSeed));
        priceVal = mock.currentPrice;
        changeNum = mock.changePercent;
        supportVal = mock.support;
        resistanceVal = mock.resistance;
        rsiVal = mock.rsi;
      }

      let signal: 'Strong Buy' | 'Buy' | 'Hold';
      let rationale: string;

      if (rsiVal < 38) {
        signal = 'Strong Buy';
        rationale = `RSI is oversold at ${rsiVal.toFixed(0)}, indicating high rebound potential near ₹${Math.round(supportVal).toLocaleString('en-IN')} support.`;
      } else if (rsiVal >= 38 && rsiVal < 52) {
        signal = 'Buy';
        rationale = `Strong bounce from ₹${Math.round(supportVal).toLocaleString('en-IN')} support, RSI is constructive at ${rsiVal.toFixed(0)}.`;
      } else {
        signal = 'Hold';
        rationale = `Trading in consolidation range below ₹${Math.round(resistanceVal).toLocaleString('en-IN')} resistance. RSI is at ${rsiVal.toFixed(0)}.`;
      }

      return {
        symbol: stock.symbol,
        name: stock.name,
        price: `₹${Math.round(priceVal).toLocaleString('en-IN')}`,
        support: `₹${Math.round(supportVal).toLocaleString('en-IN')}`,
        resistance: `₹${Math.round(resistanceVal).toLocaleString('en-IN')}`,
        change: formatPct(changeNum),
        signal,
        rationale,
      };
    })
  );

  return results;
}

async function fetchMonthlyPerformersFromAPI(): Promise<MonthlyPerformer[]> {
  const results = await Promise.all(
    MONTHLY_PERFORMER_CANDIDATES.map(async (stock) => {
      const history = await fetchYahooHistory(stock.yahoo);
      let priceVal: number;
      let gainVal: number;
      let sparkline: number[];

      if (history) {
        priceVal = history.currentPrice;
        gainVal = history.gain1M;
        sparkline = history.sparkline;
      } else {
        const mockSeed = stock.symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + getTimeSeed() + 7;
        const mock = generateMockHistory(stock.basePrice, getSeededRandom(mockSeed));
        priceVal = mock.currentPrice;
        gainVal = mock.gain1M;
        sparkline = mock.sparkline;
      }

      return {
        symbol: stock.symbol,
        name: stock.name,
        price: `₹${Math.round(priceVal).toLocaleString('en-IN')}`,
        gainVal,
        gain1M: `${gainVal >= 0 ? '+' : ''}${gainVal.toFixed(1)}%`,
        sparkline,
      };
    })
  );

  return results
    .sort((a, b) => b.gainVal - a.gainVal)
    .slice(0, 10)
    .map(({ symbol, name, price, gain1M, sparkline }) => ({
      symbol,
      name,
      price,
      gain1M,
      sparkline,
    }));
}

function computePortfolioSummary(stocks: StockData[], mutualFunds: MutualFundData[], debtFunds: DebtFundData[]): PortfolioSummary {
  const toINR = (s: StockData) => (s.currency === 'USD' ? s.priceNum * USD_TO_INR : s.priceNum) * s.quantity;

  const indiaEquity = stocks.filter((s) => s.country === 'India');
  const intlEquity = stocks.filter((s) => s.country !== 'India');

  const equityValue = indiaEquity.reduce((sum, s) => sum + toINR(s), 0);
  const intlValue = intlEquity.reduce((sum, s) => sum + toINR(s), 0);
  const mfValue = mutualFunds.reduce((sum, f) => sum + f.ytdNum * 120000, 0);
  const debtValue = debtFunds.reduce((sum, f) => sum + f.yieldNum * 110000, 0);

  const totalValue = equityValue + intlValue + mfValue + debtValue;

  const assets: PortfolioAsset[] = [
    { label: 'Equities', percent: 0, value: equityValue, valueFormatted: formatINR(equityValue), color: '#2563eb' },
    { label: 'Mutual Funds', percent: 0, value: mfValue, valueFormatted: formatINR(mfValue), color: '#10b981' },
    { label: 'Debt Funds', percent: 0, value: debtValue, valueFormatted: formatINR(debtValue), color: '#f59e0b' },
    { label: 'International', percent: 0, value: intlValue, valueFormatted: formatINR(intlValue), color: '#8b5cf6' },
  ].map((a) => ({
    ...a,
    percent: totalValue > 0 ? Math.round((a.value / totalValue) * 100) : 0,
  }));

  const avgYtd = stocks.length > 0 ? stocks.reduce((s, x) => s + x.gainNum, 0) / stocks.length : 0;
  const avgDay = stocks.length > 0 ? stocks.reduce((s, x) => s + x.dayChangeNum, 0) / stocks.length : 0;

  return {
    totalValue,
    totalValueFormatted: formatINR(totalValue),
    ytdGain: formatPct(avgYtd),
    ytdPositive: avgYtd >= 0,
    dayChange: formatPct(avgDay),
    dayChangePositive: avgDay >= 0,
    assets,
    holdingsCount: stocks.length + mutualFunds.length + debtFunds.length,
  };
}

async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  const [stocks, mutualFunds, debtFunds] = await Promise.all([
    fetchStocksFromAPI(),
    fetchMutualFundsFromAPI(),
    fetchDebtFundsFromAPI(),
  ]);
  return computePortfolioSummary(stocks, mutualFunds, debtFunds);
}

// ─── Generic cached fetch ─────────────────────────────────────────────────────

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>, forceRefresh: boolean): Promise<T> {
  if (!forceRefresh && isCacheValid()) {
    const cached = getCache<T>(key);
    if (cached) return cached;
  }
  try {
    const data = await fetcher();
    setCache(data, key);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${key}:`, error);
    const cached = getCache<T>(key);
    if (cached) return cached;
    throw error;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getStockData(forceRefresh = false): Promise<StockData[]> {
  return cachedFetch(CACHE_KEYS.STOCKS, fetchStocksFromAPI, forceRefresh);
}

export async function getTickerData(forceRefresh = false): Promise<TickerData[]> {
  return cachedFetch(CACHE_KEYS.TICKERS, fetchTickersFromAPI, forceRefresh);
}

export async function getMutualFundData(forceRefresh = false): Promise<MutualFundData[]> {
  return cachedFetch(CACHE_KEYS.MUTUAL_FUNDS, fetchMutualFundsFromAPI, forceRefresh);
}

export async function getDebtFundData(forceRefresh = false): Promise<DebtFundData[]> {
  return cachedFetch(CACHE_KEYS.DEBT_FUNDS, fetchDebtFundsFromAPI, forceRefresh);
}

export async function getSwingTradingStocks(forceRefresh = false): Promise<SwingTradeStock[]> {
  return cachedFetch(CACHE_KEYS.SWING_STOCKS, fetchSwingStocksFromAPI, forceRefresh);
}

export async function getMonthlyPerformers(forceRefresh = false): Promise<MonthlyPerformer[]> {
  return cachedFetch(CACHE_KEYS.MONTHLY_PERFORMERS, fetchMonthlyPerformersFromAPI, forceRefresh);
}

export async function getGlobalIndexesData(forceRefresh = false): Promise<GlobalIndexData[]> {
  return cachedFetch(CACHE_KEYS.GLOBAL_INDEXES, fetchGlobalIndexesFromAPI, forceRefresh);
}

export async function getForeignEquities(forceRefresh = false): Promise<ForeignEquityData[]> {
  return cachedFetch(CACHE_KEYS.FOREIGN_EQUITIES, fetchForeignEquitiesFromAPI, forceRefresh);
}

export async function getForeignDebt(forceRefresh = false): Promise<ForeignDebtData[]> {
  return cachedFetch(CACHE_KEYS.FOREIGN_DEBT, fetchForeignDebtFromAPI, forceRefresh);
}

export async function getPortfolioSummary(forceRefresh = false): Promise<PortfolioSummary> {
  return cachedFetch(CACHE_KEYS.PORTFOLIO, fetchPortfolioSummary, forceRefresh);
}

export function getLastUpdateTime(): Date | null {
  const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
  if (!lastUpdate) return null;
  return new Date(parseInt(lastUpdate));
}

export function forceRefreshAll(): Promise<[
  StockData[],
  TickerData[],
  MutualFundData[],
  DebtFundData[],
  SwingTradeStock[],
  MonthlyPerformer[],
  GlobalIndexData[],
  ForeignEquityData[],
  ForeignDebtData[],
  PortfolioSummary,
]> {
  clearCache();
  return Promise.all([
    getStockData(true),
    getTickerData(true),
    getMutualFundData(true),
    getDebtFundData(true),
    getSwingTradingStocks(true),
    getMonthlyPerformers(true),
    getGlobalIndexesData(true),
    getForeignEquities(true),
    getForeignDebt(true),
    getPortfolioSummary(true),
  ]);
}
