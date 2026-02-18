/**
 * Fetch US stock quotes from Alpha Vantage (GLOBAL_QUOTE).
 * One request per symbol; includes retry and respects free-tier rate limits (5 req/min).
 */

const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const DELAY_BETWEEN_REQUESTS_MS = 15000; // stay under 5 req/min
const RETRY_DELAY_MS = 30000;
const MAX_RETRIES = 1;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} apiKey - Alpha Vantage API key
 * @param {string} symbol - Ticker symbol (e.g. NVDA, GOOGL)
 * @returns {Promise<{ symbol: string, price: string, changePercent: string } | null>}
 */
async function fetchOneQuote(apiKey, symbol) {
  const url = new URL(ALPHA_VANTAGE_BASE);
  url.searchParams.set('function', 'GLOBAL_QUOTE');
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('apikey', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Alpha Vantage HTTP ${res.status} for ${symbol}`);
  }
  const data = await res.json();

  const globalQuote = data['Global Quote'];
  if (!globalQuote || !globalQuote['05. price']) {
    const note = data.Note || data['Error Message'] || JSON.stringify(data);
    throw new Error(`Alpha Vantage: no quote for ${symbol} - ${note}`);
  }

  return {
    symbol: globalQuote['01. symbol'] || symbol,
    price: globalQuote['05. price'],
    changePercent: (globalQuote['10. change percent'] || '0%').trim(),
  };
}

/**
 * Fetch quote with one retry after RETRY_DELAY_MS.
 */
async function fetchOneWithRetry(apiKey, symbol) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetchOneQuote(apiKey, symbol);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        console.error(`Retry in ${RETRY_DELAY_MS / 1000}s for ${symbol}:`, err.message);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  throw lastErr;
}

/**
 * @param {string} apiKey - Alpha Vantage API key
 * @param {string[]} symbols - Ticker symbols (e.g. ['NVDA','LIFE','TEAM','GOOGL'])
 * @returns {Promise<Array<{ symbol: string, price: string, changePercent: string }>>}
 */
async function fetchQuotes(apiKey, symbols) {
  const results = [];
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i].trim();
    if (!symbol) continue;
    if (i > 0) {
      await sleep(DELAY_BETWEEN_REQUESTS_MS);
    }
    const quote = await fetchOneWithRetry(apiKey, symbol);
    if (quote) results.push(quote);
  }
  return results;
}

module.exports = { fetchQuotes };
