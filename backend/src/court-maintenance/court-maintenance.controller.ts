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
import { CourtMaintenanceService } from './court-maintenance.service';
import { CreateCourtMaintenanceDto, UpdateCourtMaintenanceDto } from './dto/court-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('court-maintenance')
@UseGuards(JwtAuthGuard)
export class CourtMaintenanceController {
  constructor(private courtMaintenanceService: CourtMaintenanceService) {}

  @Get()
  list(
    @Request() req: { user: { tennisClubId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.courtMaintenanceService.list(req.user.tennisClubId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.courtMaintenanceService.get(req.user.tennisClubId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: CreateCourtMaintenanceDto,
  ) {
    return this.courtMaintenanceService.create(req.user.tennisClubId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCourtMaintenanceDto,
  ) {
    return this.courtMaintenanceService.update(req.user.tennisClubId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.courtMaintenanceService.remove(req.user.tennisClubId, id);
  }
}
