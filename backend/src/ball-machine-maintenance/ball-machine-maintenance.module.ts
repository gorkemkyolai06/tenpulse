import { Module } from '@nestjs/common';
import { BallMachineMaintenanceController } from './ball-machine-maintenance.controller';
import { BallMachineMaintenanceService } from './ball-machine-maintenance.service';

@Module({
  controllers: [BallMachineMaintenanceController],
  providers: [BallMachineMaintenanceService],
})
export class BallMachineMaintenanceModule {}
