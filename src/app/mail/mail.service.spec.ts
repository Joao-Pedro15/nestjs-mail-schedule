import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailEntity } from './mail.entity';
import { Repository } from 'typeorm';
import { SaveMailDto } from './dto/save-mail.dto';

describe('MailService', () => {
  let mailService: MailService;
  let mailRepository: Repository<MailEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: getRepositoryToken(MailEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          },
        }
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailRepository = module.get<Repository<MailEntity>>(getRepositoryToken(MailEntity))
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
    expect(mailRepository).toBeDefined();
  });

  describe('save', () => {
    it('should save a new mail with success', async () => {
      // Arrange
      const data:  SaveMailDto = {
        destinationAddress: "user@gmail.com",
        dueDate: "2022-05-01T12:00:00Z" ,
        body: "<p>Hi</p>",
        destinationName: "User",
        subject: "Email test"
      }
      const mailEntityMock = {
        destinationAddress: "user@gmail.com",
        dueDate: "2022-05-01T12:00:00Z" ,
        body: "<p>Hi</p>",
        destinationName: "User",
        subject: "Email test"
      } as MailEntity

      jest.spyOn(mailRepository, 'create').mockReturnValueOnce(mailEntityMock)
      jest.spyOn(mailRepository, 'save').mockResolvedValueOnce(mailEntityMock)

      // Act
      const result = await mailService.save(data)
      // Assert
      expect(result).toBeDefined()
      expect(mailRepository.create).toHaveBeenCalledTimes(1)
      expect(mailRepository.save).toHaveBeenCalledTimes(1)
    })
  })

});
