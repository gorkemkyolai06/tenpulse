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
import { CourtsService } from './courts.service';
import { CreateCourtDto, UpdateCourtDto } from './dto/court.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courts')
@UseGuards(JwtAuthGuard)
export class CourtsController {
  constructor(private courtsService: CourtsService) {}

  @Get()
  list(
    @Request() req: { user: { tennisClubId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('wing') wing?: string,
  ) {
    return this.courtsService.list(req.user.tennisClubId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      wing,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.courtsService.get(req.user.tennisClubId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: CreateCourtDto,
  ) {
    return this.courtsService.create(req.user.tennisClubId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCourtDto,
  ) {
    return this.courtsService.update(req.user.tennisClubId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.courtsService.remove(req.user.tennisClubId, id);
  }
}
