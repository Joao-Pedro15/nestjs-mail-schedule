import { Module } from '@nestjs/common';
import { ExternalModule } from './app/external/external.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExternalModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
