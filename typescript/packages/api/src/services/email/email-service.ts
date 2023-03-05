import mail from "@sendgrid/mail";

export class SendGridEmailService {
  constructor(readonly apiKey: string) {
    mail.setApiKey(apiKey);
  }

  async sendEmail(_: SendEmailArguments): Promise<void> {
    console.log(_);
    throw new Error("not implemented");
  }
}

export interface EmailService {
  sendEmail(args: SendEmailArguments): Promise<void>;
}

interface SendEmailArguments {
  foo: "bar";
}
