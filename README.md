# Webhook handler

This app shows how easy it is to verify the signature of a webhook message coming from Moov using a serverless function. [Read the docs](https://docs.moov.io/guides/developer-tools/webhooks/) for more information.

## Setting things up

We're using Netlify is quickly deploy the serverless function to AWS. The only other dependency is [crypto-js](https://github.com/brix/crypto-js) for creating a hash of the header values and the webhook signature.

1. Clone the repo and install dependencies with `yarn`
2. After creating a webhook in the Moov Dashboard, copy the signing secret and assign the value to a `WEBHOOK_SECRET` environment variable. If using `netlify cli` you can use the `netlify env:set WEBHOOK_SECRET {value}` command.
