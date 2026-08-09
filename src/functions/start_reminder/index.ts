import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn"
import { StartReminderInputSchema } from "@commons/schema/start-reminder-input"
import type { APIGatewayProxyHandler } from "aws-lambda"
import * as v from "valibot"

const STATE_MACHINE_ARN = process.env.STATE_MACHINE_ARN

const sfn = new SFNClient()

const CORS_HEADERS = { "Access-Control-Allow-Origin": "*" }

export const handler: APIGatewayProxyHandler = async (event) => {
	console.log("Received Event:", JSON.stringify(event))

	let body: unknown
	try {
		body = JSON.parse(event.body ?? "")
	} catch {
		return {
			statusCode: 400,
			headers: CORS_HEADERS,
			body: JSON.stringify({ Status: "Error", Reason: "Invalid JSON body" }),
		}
	}

	const result = v.safeParse(StartReminderInputSchema, body)

	if (!result.success) {
		return {
			statusCode: 400,
			headers: CORS_HEADERS,
			body: JSON.stringify({
				Status: "Error",
				Reason: "Input failed validation",
			}),
		}
	}

	if (!STATE_MACHINE_ARN) {
		console.error("Missing STATE_MACHINE_ARN environment variable")
		return {
			statusCode: 500,
			headers: CORS_HEADERS,
			body: JSON.stringify({ Status: "Error", Reason: "Server misconfigured" }),
		}
	}

	await sfn.send(
		new StartExecutionCommand({
			stateMachineArn: STATE_MACHINE_ARN,
			input: JSON.stringify(result.output),
		}),
	)

	return {
		statusCode: 200,
		headers: CORS_HEADERS,
		body: JSON.stringify({ Status: "Success" }),
	}
}
