const hmacSHA512 = require("crypto-js/hmac-sha512");

const webhookSecret = process.env.WEBHOOK_SECRET;

const isSigned = (timestamp, nonce, webhookId, signature) => {
  const concatHeaders = `${timestamp}|${nonce}|${webhookId}`;
  const checkHash = hmacSHA512(concatHeaders, webhookSecret);

  return signature === checkHash;
}

exports.handler = async (event, callback) => {
  if (!event.body) {
    callback(null, {
      statusCode: 400,
      body: "Invalid request"
    });
  }

  if (!isSigned(
    event.headers["X-Timestamp"], 
    event.headers["X-Nonce"], 
    event.headers["X-Webhook-ID"], 
    event.headers["X-Signature"])
  ) {
    callback(null, {
      statusCode: 400,
      body: "Signature is invalid"
    });
  }

  let webhook;
  try {
    webhook = JSON.parse(event.body);
  } catch (err) {
    callback(null, {
      statusCode: 400,
      body: "Invalid JSON"
    });
  }

  console.log("Webhook received!");
  callback(null, {
    statusCode: 200
  });
};