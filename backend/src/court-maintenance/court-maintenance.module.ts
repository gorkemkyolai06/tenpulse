import { Module } from '@nestjs/common';
import { CourtMaintenanceController } from './court-maintenance.controller';
import { CourtMaintenanceService } from './court-maintenance.service';

@Module({
  controllers: [CourtMaintenanceController],
  providers: [CourtMaintenanceService],
})
export class CourtMaintenanceModule {}
