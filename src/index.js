#!/usr/bin/env node
/**
 * Daily stock quotes: fetch from Alpha Vantage, format, send via Twilio (SMS or WhatsApp).
 * Env: ALPHA_VANTAGE_API_KEY, TWILIO_*, MY_PHONE_NUMBER, DELIVERY_MODE, STOCK_SYMBOLS (optional).
 * Loads .env from project root if present (for local runs).
 */
require('dotenv').config();

const { fetchQuotes } = require('./fetch-quotes');
const { sendMessage } = require('./send-message');

const DEFAULT_SYMBOLS = ['NVDA', 'LIFE', 'TEAM', 'GOOGL'];

function getSymbols() {
  const env = process.env.STOCK_SYMBOLS;
  if (!env || !env.trim()) return DEFAULT_SYMBOLS;
  return env.split(',').map((s) => s.trim()).filter(Boolean);
}

function formatMessage(quotes) {
  const parts = quotes.map((q) => `${q.symbol} $${q.price} (${q.changePercent})`);
  const line = `Stocks 8am: ${parts.join(', ')}.`;
  return line + '\nData: Alpha Vantage';
}

async function main() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error('Missing ALPHA_VANTAGE_API_KEY');
    process.exit(1);
  }

  const symbols = getSymbols();
  console.log('Fetching quotes for:', symbols.join(', '));

  let quotes;
  try {
    quotes = await fetchQuotes(apiKey, symbols);
  } catch (err) {
    console.error('Fetch failed:', err.message);
    process.exit(1);
  }

  if (quotes.length === 0) {
    console.error('No quotes returned');
    process.exit(1);
  }

  const message = formatMessage(quotes);
  console.log('Message:', message);

  try {
    await sendMessage(message);
    console.log('Sent successfully');
  } catch (err) {
    console.error('Send failed:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
