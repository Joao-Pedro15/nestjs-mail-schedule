import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailEntity } from './mail.entity';
import { Repository } from 'typeorm';
import { SaveMailDto } from './dto/save-mail.dto';
import { FindAllMailDto } from './dto/find-all-mail.dto';
import { MailStatusEnum } from './enum/mail-status.enum';

describe('MailService', () => {
  let mailService: MailService;
  let mailRepository: Repository<MailEntity>
  const getMany = jest.fn()


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: getRepositoryToken(MailEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            andWhere: jest.fn(),
            getMany,
            findOneOrFail: jest.fn(),
            merge: jest.fn()
          },
        }
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailRepository = module.get<Repository<MailEntity>>(getRepositoryToken(MailEntity))
  });

  afterEach(() => {
    getMany.mockRestore()
  })

  it('should be defined', () => {
    expect(mailService).toBeDefined();
    expect(mailRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a mail list with success', async () => {

      const mailEntityMockList = [
        { id: '1', dueDate: '2022-04-01T12:00:00Z' },
        { id: '2', dueDate: '2022-04-01T12:00:00Z' }
      ] as MailEntity[]

      getMany.mockResolvedValueOnce(mailEntityMockList)

      const result = await mailService.findAll()
      expect(result).toHaveLength(2)
    })

    it('should return a filtered mail list with dueDateLte', async () => {

      const mailEntityMockList = [
        { id: '1', dueDate: '2022-04-01T12:00:00Z' },
      ] as MailEntity[]

      getMany.mockResolvedValueOnce(mailEntityMockList)


      const params: Partial<FindAllMailDto> = { dueDateLte: '2024-04-01T12:00:00Z' }
      const result = await mailService.findAll(params)

      expect(result).toHaveLength(1)
    })

    it('should return a filtered mail list with WAITING status', async () => {

      const mailEntityMockList = [
        { id: '1', dueDate: '2022-04-01T12:00:00Z' },
      ] as MailEntity[]

      getMany.mockResolvedValueOnce(mailEntityMockList)


      const params: Partial<FindAllMailDto> = { status: MailStatusEnum.WAITING }
      const result = await mailService.findAll(params)

      expect(result).toHaveLength(1)
    })


  })

  describe('save', () => {
    it('should save a new mail with success', async () => {
      // Arrange
      const data: SaveMailDto = {
        destinationAddress: "user@gmail.com",
        dueDate: "2022-05-01T12:00:00Z",
        body: "<p>Hi</p>",
        destinationName: "User",
        subject: "Email test"
      }
      const mailEntityMock = {
        destinationAddress: "user@gmail.com",
        dueDate: "2022-05-01T12:00:00Z",
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


  describe('updateStatus', () => {
    it('should update mail status with success', async () => {
      const id = 'id'
      const result = await mailService.updateStatus(id, MailStatusEnum.SENT)
      expect(result).toBeUndefined()
    })
  })

});
