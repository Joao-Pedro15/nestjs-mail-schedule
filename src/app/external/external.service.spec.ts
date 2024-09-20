import { Test, TestingModule } from '@nestjs/testing';
import { ExternalService } from './external.service';
import { HttpService } from '@nestjs/axios';
import { SendEmailInterface } from './interface/external-email-interface';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('ExternalService', () => {
  let external: ExternalService;
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalService,
        { 
          provide: HttpService,
          useValue: {
            post: jest.fn()
          } 
        }
      ],
    }).compile();

    external = module.get<ExternalService>(ExternalService);
    httpService = module.get<HttpService>(HttpService)
  });

  it('should be defined', () => {
    expect(external).toBeDefined();
    expect(httpService).toBeDefined()
  });


  describe('sendMail', () => {
    it('should send an email with success', async () => {
      const data: SendEmailInterface = {
        content: [
          {
            type: "text/html",
            value: "<p>Sua fatura chegou!</p>"
          }
        ],
        subject: "fatura",
        from: {
          name: "Leonardo",
          email: "leonardo@gmail.com"
        },
        reply_to: {
          name: "Leonardo",
          email: "leonardo@gmail.com"
        },
        personalizations: [
          {
            to: [
              {
                name: "Leonardo",
                email: "leonardo@gmail.com"
              }
            ],
            from: {
              email: "enterprise@gmail.com",
              name: "enterprise"
            },
          }
        ]
      }

      const mockResponse: AxiosResponse = {
        status: 202,
        statusText: "ACCEPTED",
        data: "",
        headers: {},
        config: { headers: null }
      }

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockResponse))

      const reuslt = await external.sendEmail(data)
      expect(reuslt).toBeTruthy()
      expect(httpService.post).toHaveBeenCalledTimes(1)
    })
  })

});
