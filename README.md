# Moov webhook handler

This app shows how easy it is to verify the signature of a webhook message coming from Moov using a serverless function. [Read the docs](https://docs.moov.io/guides/developer-tools/webhooks/) for more information.

## Setting things up
We're using Netlify to quickly deploy the serverless function. We'll use ngrok to create a public URL that can tunnel to your localhost. The only other dependency is [crypto-js](https://github.com/brix/crypto-js) for creating a hash of the header values and the webhook signature.

1. Install the following libraries through a package manager (e.g. Homebrew):
    1. [yarn](https://classic.yarnpkg.com/lang/en/docs/cli/)
    1. [netlify-cli](https://docs.netlify.com/cli/get-started/)
    2. [ngrok-cli](https://ngrok.com/docs/agent/cli/)
        - To use `ngrok` in the next steps, you'll need to signup.
2. Clone the repo and install dependencies with `yarn`
3. After creating a webhook in the Moov Dashboard, copy the signing secret and assign the value to a `WEBHOOK_SECRET` environment variable. If using `netlify cli` you can use the `netlify env:set WEBHOOK_SECRET {value}` command.
4. In [netlify.toml](netlify.toml), you can set `redirects.to` to point to either the `javascript` or `go` function in [functions](/functions).
5. Run `netlify dev` to start the server
6. Run `ngrok http 8888` to create a public URL attached to the port your server is running on
7. Copy the public URL and paste it into the Moov Dashboard as you create a new webhook. It should look like `https://random-number.ngrok.io/webhook-handler`
8. Send a test ping through the Moov Dashboard to your webhook or take an action that generates an event. You should see the event message logged in your console where ngrok is logged responses or from the web interface at `http://localhost:4040`
