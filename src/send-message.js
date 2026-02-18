/**
 * Send a text message via Twilio (SMS or WhatsApp).
 * Uses env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, MY_PHONE_NUMBER, DELIVERY_MODE (sms|whatsapp).
 */

const twilio = require('twilio');

/**
 * @param {string} body - Message body
 * @returns {Promise<void>}
 */
async function sendMessage(body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.MY_PHONE_NUMBER;
  const deliveryMode = (process.env.DELIVERY_MODE || 'sms').toLowerCase();

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    throw new Error(
      'Missing Twilio env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, MY_PHONE_NUMBER'
    );
  }

  const client = twilio(accountSid, authToken);

  if (deliveryMode === 'whatsapp') {
    const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
    const to = toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`;
    await client.messages.create({ body, from, to });
  } else {
    await client.messages.create({
      body,
      from: fromNumber,
      to: toNumber,
    });
  }
}

module.exports = { sendMessage };
