import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SendEmailInterface } from './interface/external-email-interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExternalService {
  private readonly EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  private readonly EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY

  constructor(
    private readonly httpService: HttpService
  ) { }


  async sendEmail(data: SendEmailInterface): Promise<boolean> {
    const url = this.EXTERNAL_API_URL
    const config = {
      headers: { Authorization: this.EXTERNAL_API_KEY }
    }
    const response = await lastValueFrom(this.httpService.post(url, data, config))
    return response.status == 202
  }

}
