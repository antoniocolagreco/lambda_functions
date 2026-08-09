// src/email_reminder_lambda/index.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
var FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
var ses = new SESClient();
var handler = async (event) => {
  console.log("Received Event:", JSON.stringify(event));
  const sendEmailCommand = new SendEmailCommand({
    Source: FROM_EMAIL_ADDRESS,
    Destination: { ToAddresses: [event.Input.email] },
    Message: {
      Subject: { Data: "Whiskers Commands You to attend!" },
      Body: {
        Text: { Data: event.Input.message }
      }
    }
  });
  await ses.send(sendEmailCommand);
  const response = {
    statusCode: 200,
    body: JSON.stringify("Success!")
  };
  return response;
};
export {
  handler
};
