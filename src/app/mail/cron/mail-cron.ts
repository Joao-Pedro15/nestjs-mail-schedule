import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MailService } from "../mail.service";
import { MailStatusEnum } from "../enum/mail-status.enum";
import { ExternalService } from "../../external/external.service";
import { SendEmailInterface } from "../../external/interface/external-email-interface";

@Injectable()
export class MailCron {
 private logger = new Logger(MailCron.name)
 constructor(
  private readonly mailService: MailService,
  private readonly externalService: ExternalService
 ) { }

 @Cron(CronExpression.EVERY_10_SECONDS)
 async handler() {
  const mailList = await this.mailService.findAll({ dueDateLte: new Date('2021').toISOString(), status: MailStatusEnum.WAITING })

  for (const mail of mailList) {

   const data: SendEmailInterface = {
    personalizations: [{
     to: [{
      name: mail.destinationName,
      email: mail.destinationAddress
     }]
    }],
    from: { email: "its.me@gmail.com", name: 'me' },
    reply_to: { email: 'its.me@gmail.com', name: 'me' },
    subject: mail.subject,
    content: [{ type: "text/html", value: mail.body }]
   }

   await this.externalService.sendEmail(data)
   await this.mailService.updateStatus(mail.id, MailStatusEnum.SENT)
   this.logger.log('E-mail enviado com sucesso!')

  }
  console.log(mailList)
 }

}