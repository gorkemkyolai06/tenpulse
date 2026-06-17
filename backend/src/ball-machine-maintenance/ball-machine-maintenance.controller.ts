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
import { BallMachineMaintenanceService } from './ball-machine-maintenance.service';
import {
  CreateBallMachineMaintenanceDto,
  UpdateBallMachineMaintenanceDto,
} from './dto/ball-machine-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ball-machine-maintenance')
@UseGuards(JwtAuthGuard)
export class BallMachineMaintenanceController {
  constructor(private ballMachineMaintenanceService: BallMachineMaintenanceService) {}

  @Get()
  list(
    @Request() req: { user: { tennisClubId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.ballMachineMaintenanceService.list(req.user.tennisClubId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { tennisClubId: string } }) {
    return this.ballMachineMaintenanceService.urgent(req.user.tennisClubId);
  }

  @Get(':id')
  get(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.ballMachineMaintenanceService.get(req.user.tennisClubId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: CreateBallMachineMaintenanceDto,
  ) {
    return this.ballMachineMaintenanceService.create(req.user.tennisClubId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateBallMachineMaintenanceDto,
  ) {
    return this.ballMachineMaintenanceService.update(req.user.tennisClubId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.ballMachineMaintenanceService.remove(req.user.tennisClubId, id);
  }
}
