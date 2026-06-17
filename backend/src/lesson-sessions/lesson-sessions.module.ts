import { Module } from '@nestjs/common';
import { LessonSessionsController } from './lesson-sessions.controller';
import { LessonSessionsService } from './lesson-sessions.service';

@Module({
  controllers: [LessonSessionsController],
  providers: [LessonSessionsService],
})
export class LessonSessionsModule {}
