import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SaveMailDto } from './dto/save-mail.dto';

@Controller('api/v1/mail')
export class MailController {

  constructor(private readonly mailService: MailService) {}

  @Post()
  async save(@Body() data: SaveMailDto) {
    return this.mailService.save(data)
  }

}
