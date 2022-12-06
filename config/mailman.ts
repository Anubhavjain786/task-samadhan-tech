import { registerAs } from '@nestjs/config';
import { MailmanOptions } from 'libs/mailman/src/interfaces';

export default registerAs('mailman', () => {
  return {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_SENDER_ID,
    path: '/project-dir/resources/mails',
  } as MailmanOptions;
});
