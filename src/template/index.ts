import type { Handler } from "aws-lambda"

export const handler: Handler = async (event) => {
	console.log("Received Event:", JSON.stringify(event))
	// TODO implement
	const response = {
		statusCode: 200,
		body: JSON.stringify("Hello from Lambda!"),
	}
	return response
}
