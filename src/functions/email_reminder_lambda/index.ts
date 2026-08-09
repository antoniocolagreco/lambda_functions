import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import {
	type EventWithTaskInput,
	EventWithTaskInputSchema,
} from "@commons/schema/task-input"
import type { Handler } from "aws-lambda"
import * as v from "valibot"

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS

const ses = new SESClient()

type LambdaFunctionResult =
	| {
			statusCode: 200
			message: "Success"
	  }
	| {
			statusCode: 400
			message: "Invalid Data"
	  }

export const handler: Handler<
	EventWithTaskInput,
	LambdaFunctionResult
> = async (event) => {
	console.log("Received Event:", JSON.stringify(event))

	const result = v.safeParse(EventWithTaskInputSchema, event)

	if (!result.success) {
		return {
			statusCode: 400,
			message: "Invalid Data",
		}
	}

	const { email, message } = result.output.Input

	const sendEmailCommand = new SendEmailCommand({
		Source: FROM_EMAIL_ADDRESS,
		Destination: { ToAddresses: [email] },
		Message: {
			Subject: { Data: "Whiskers Commands You to attend!" },
			Body: {
				Text: { Data: message },
			},
		},
	})

	await ses.send(sendEmailCommand)
	return {
		statusCode: 200,
		message: "Success",
	}
}
