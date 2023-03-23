import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { AppEnvironment } from "@lib/backend-shared";
const aws_ses_client = new SESClient({ region: "us-east-1" });



export function sendAwsEmail(params: {
  to: string,
  subject: string,
  message?: string,
  html?: string,
}) {
  const command = new SendEmailCommand({
    Source: AppEnvironment.AWS.SES.EMAIL,
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Subject: {
        Data: params.subject,
      },
      Body: !!params.html
        ? { Html: { Data: params.html, Charset: `utf-8` } }
        : { Text: { Data: params.message, Charset: `utf-8` } }
    },
    ReplyToAddresses: [],
    SourceArn: AppEnvironment.AWS.SES.ARN
  });
  return aws_ses_client.send(command);
}