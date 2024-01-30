import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { EmailService } from './email.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PaginationService, EmailService],
  exports: [PaginationService, EmailService],
})
export class SharedModule {}