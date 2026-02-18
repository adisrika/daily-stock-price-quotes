# Daily Stock Price Quotes

Sends a short daily message with US stock quotes (e.g. NVDA, LIFE, TEAM, GOOGL) to your phone via **SMS** or **WhatsApp**. Runs every morning on a schedule in the cloud (GitHub Actions), so it works even when your laptop is off.

## One-time setup

### 1. Alpha Vantage (stock data)

- Sign up at [alphavantage.co](https://www.alphavantage.co/) and get a free API key.
- Free tier: 25 requests per day (this job uses 4 per run).

### 2. Twilio (SMS or WhatsApp)

- Create an account at [twilio.com](https://www.twilio.com).
- **SMS**: Buy a phone number (or use trial with verified numbers).
- **WhatsApp**: Use [Twilio WhatsApp Sandbox](https://www.twilio.com/docs/whatsapp/sandbox) for quick setup, or full WhatsApp Business for your own number.
- From the Twilio console get: **Account SID**, **Auth Token**, and the **Twilio phone number** (or WhatsApp sender).

### 3. GitHub repository and secrets

- Push this project to a GitHub repo (public = free Actions minutes).
- In the repo: **Settings → Secrets and variables → Actions**.
- Add these secrets:

| Secret | Description |
|--------|-------------|
| `ALPHA_VANTAGE_API_KEY` | Your Alpha Vantage API key |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio number (e.g. `+1234567890` or `whatsapp:+1234567890` for WhatsApp) |
| `MY_PHONE_NUMBER` | Your phone number in E.164 (e.g. `+1234567890`) |
| `DELIVERY_MODE` | Optional. `sms` (default) or `whatsapp` |
| `STOCK_SYMBOLS` | Optional. Comma-separated tickers (default: `NVDA,LIFE,TEAM,GOOGL`) |

## Schedule and timezone

- The workflow runs on **UTC**. Default cron: `5 13 * * *` (about 8:00 AM **EST**).
- To change the time, edit [`.github/workflows/daily-stock-quotes.yml`](.github/workflows/daily-stock-quotes.yml) and set the `schedule` cron:

| Local time (approx.) | Cron (UTC) |
|----------------------|------------|
| 8:00 AM EST          | `5 13 * * *` |
| 8:00 AM EDT          | `5 12 * * *` |
| 9:00 AM EST          | `5 14 * * *` |

Use [crontab.guru](https://crontab.guru/) to convert your desired local time to UTC. Note: US daylight saving changes EST/EDT; adjust the cron twice a year if you want exact local time.

## Add or remove stocks

- **Via GitHub**: Add or edit the `STOCK_SYMBOLS` secret (e.g. `NVDA,LIFE,TEAM,GOOGL,AAPL`).
- **Locally**: Set `STOCK_SYMBOLS=NVDA,AAPL` when running `npm start`.

## Run locally

```bash
npm install
export ALPHA_VANTAGE_API_KEY=your_key
export TWILIO_ACCOUNT_SID=...
export TWILIO_AUTH_TOKEN=...
export TWILIO_PHONE_NUMBER=...
export MY_PHONE_NUMBER=...
export DELIVERY_MODE=sms   # or whatsapp
npm start
```

## Manual run (GitHub Actions)

In your repo: **Actions → Daily Stock Quotes → Run workflow**.

## Message format

Example:

```
Stocks 8am: NVDA $142.50 (1.2%), LIFE $19.00 (0.5%), TEAM $185.30 (-0.3%), GOOGL $172.10 (0.8%).
Data: Alpha Vantage
```

## License

MIT
