const hmacSHA512 = require("crypto-js/hmac-sha512");

const webhookSecret = process.env.WEBHOOK_SECRET;

const isSigned = (timestamp, nonce, webhookId, signature) => {
  const concatHeaders = `${timestamp}|${nonce}|${webhookId}`;
  const checkHash = hmacSHA512(concatHeaders, webhookSecret);

  return signature === checkHash.toString();
}

exports.handler = async (event, context, callback) => {
  if (!event.body) {
    console.log("Invalid request");
    callback(null, {
      statusCode: 400,
      body: "Invalid request"
    });
  }

  // headers are lowercased
  if (!isSigned(
    event.headers["x-timestamp"], 
    event.headers["x-nonce"], 
    event.headers["x-webhook-id"], 
    event.headers["x-signature"])
  ) {
    console.log("Signature is invalid");
    callback(null, {
      statusCode: 400,
      body: "Signature is invalid"
    });
  }

  let webhook;
  try {
    webhook = JSON.parse(event.body);
  } catch (err) {
    console.log("Invalid JSON");
    callback(null, {
      statusCode: 400,
      body: "Invalid JSON"
    });
  }

  console.log("Webhook received!");
  console.log(event.body);
  callback(null, {
    statusCode: 200
  });
};
