import { Job } from '@libs/boat';
import { Injectable } from '@nestjs/common';
import { Mailman } from 'libs/mailman/src/mailman';
import { MailMessage } from 'libs/mailman/src/message';

@Injectable()
export class MailService {
  @Job('SEND_SIGNUP_MAIL', {})
  async sendSignupMail(data: Record<string, any>) {
    const mail = MailMessage.init();
    mail.subject(data.subject);
    mail.greeting(`Hello ${data.name}`);
    mail.line('Welcome! We are pleased that you joined');

    Mailman.init().to(data.email).send(mail);
  }
}
