import { ExternalService } from "../../external/external.service";
import { MailEntity } from "../mail.entity";
import { MailService } from "../mail.service";
import { MailCron } from "./mail-cron";
import { Test, TestingModule } from "@nestjs/testing";

describe('MailCron', () => {
 let mailCron: MailCron
 let mailService: MailService
 let externalService: ExternalService

 beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
   providers: [
    MailCron,
    {
     provide: MailService,
     useValue: {
      findAll: jest.fn(),
      updateStatus: jest.fn()
     }
    },
    {
     provide: ExternalService,
     useValue: {
      sendEmail: jest.fn()
     }
    }
   ],
  }).compile();

  mailCron = module.get<MailCron>(MailCron)
  mailService = module.get<MailService>(MailService);
  externalService = module.get<ExternalService>(ExternalService)
 })


 it('should be defined', async () => {
  expect(mailCron).toBeDefined()
  expect(mailService).toBeDefined()
  expect(externalService).toBeDefined()
 })

 describe('handler', () => {

  it('should send mail every 10 seconds', async () => {

   const mailEntityMockList = [
    { id: '1', dueDate: '2022-04-01T12:00:00Z' },
    { id: '2', dueDate: '2022-04-01T12:00:00Z' }
   ] as MailEntity[]

   jest.spyOn(mailService, 'findAll').mockResolvedValueOnce(mailEntityMockList)
   jest.spyOn(mailService, 'updateStatus').mockResolvedValueOnce()
   jest.spyOn(externalService, 'sendEmail').mockResolvedValueOnce(true)

   const result = await mailCron.handler()
   expect(result).toBeUndefined()
   expect(mailService.findAll).toHaveBeenCalled()
   expect(mailService.updateStatus).toHaveBeenCalled()
   expect(mailService.updateStatus).toHaveBeenLastCalledWith("2", "SENT")
   expect(externalService.sendEmail).toHaveBeenCalledTimes(2)

  })

 })

})