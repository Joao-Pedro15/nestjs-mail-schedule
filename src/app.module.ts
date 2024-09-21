import { Module } from '@nestjs/common';
import { ExternalModule } from './app/external/external.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from './app/mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      database: "mailschedule",
      username: "postgres",
      password: "123456789",
      port: 5432,
      synchronize: true,
      entities: [__dirname + '/**/*entity{.js,.ts}']
    }),
    ScheduleModule.forRoot(),
    ExternalModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
