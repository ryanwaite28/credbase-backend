import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const aws_ses_client = new SESClient({ region: "us-east-1" });



export function sendAwsEmail(params: {
  to: string,
  subject: string,
  message?: string,
  html?: string,
}) {
  const command = new SendEmailCommand({
    Source: process.env.PLATFORM_AWS_SES_EMAIL,
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
    ReplyToAddresses: [process.env.PLATFORM_AWS_SES_EMAIL!],
    SourceArn: process.env.PLATFORM_AWS_SES_ARN
  });
  return aws_ses_client.send(command);
}