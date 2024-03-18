package main

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(handler)
}

func handler(r events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	var (
		webhookSecret = os.Getenv("WEBHOOK_SECRET")

		timestamp = r.Headers["x-timestamp"]
		nonce     = r.Headers["x-nonce"]
		webhookID = r.Headers["x-webhook-id"]
		gotHash   = r.Headers["x-signature"]
	)

	concatHeaders := timestamp + "|" + nonce + "|" + webhookID
	wantHash, err := hash([]byte(concatHeaders), []byte(webhookSecret))
	if err != nil {
		return nil, err
	}

	if *wantHash != gotHash {
		msg := "Signature is invalid"
		fmt.Println(msg)
		return &events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       msg,
		}, nil

	}

	fmt.Println("Webhook received!")
	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}

// hash generates a SHA512 HMAC hash of p using the secret provided.
func hash(p []byte, secret []byte) (*string, error) {
	h := hmac.New(sha512.New, secret)
	_, err := h.Write(p)
	if err != nil {
		return nil, err
	}
	hash := hex.EncodeToString(h.Sum(nil))
	return &hash, nil
}
