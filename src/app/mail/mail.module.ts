import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailEntity } from './mail.entity';
import { MailController } from './mail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MailEntity])],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
