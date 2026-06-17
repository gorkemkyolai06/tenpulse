import { Module } from '@nestjs/common';
import { RateTiersController } from './rate-tiers.controller';
import { RateTiersService } from './rate-tiers.service';

@Module({
  controllers: [RateTiersController],
  providers: [RateTiersService],
})
export class RateTiersModule {}
