import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ExternalService],
  exports: [ExternalService]
})
export class ExternalModule { }
