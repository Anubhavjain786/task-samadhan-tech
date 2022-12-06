import { Module } from '@nestjs/common';
import { AuthLibService } from './service';

@Module({
  imports: [],
  providers: [AuthLibService],
  exports: [AuthLibService],
})
export class AuthLibModule {}
