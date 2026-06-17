import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { LessonSessionsService } from './lesson-sessions.service';
import { CreateLessonSessionDto, UpdateLessonSessionDto } from './dto/lesson-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lesson-sessions')
@UseGuards(JwtAuthGuard)
export class LessonSessionsController {
  constructor(private lessonSessionsService: LessonSessionsService) {}

  @Get()
  list(
    @Request() req: { user: { tennisClubId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.lessonSessionsService.list(req.user.tennisClubId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.lessonSessionsService.get(req.user.tennisClubId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: CreateLessonSessionDto,
  ) {
    return this.lessonSessionsService.create(req.user.tennisClubId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateLessonSessionDto,
  ) {
    return this.lessonSessionsService.update(req.user.tennisClubId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.lessonSessionsService.remove(req.user.tennisClubId, id);
  }
}
