import { Module } from '@nestjs/common';
import { TennisClubController } from './tennis-club.controller';
import { TennisClubService } from './tennis-club.service';

@Module({
  controllers: [TennisClubController],
  providers: [TennisClubService],
})
export class TennisClubModule {}
