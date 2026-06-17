import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { TennisClubModule } from './tennis-club/tennis-club.module';
import { CourtsModule } from './courts/courts.module';
import { LessonSessionsModule } from './lesson-sessions/lesson-sessions.module';
import { BallMachineMaintenanceModule } from './ball-machine-maintenance/ball-machine-maintenance.module';
import { CourtMaintenanceModule } from './court-maintenance/court-maintenance.module';
import { RateTiersModule } from './rate-tiers/rate-tiers.module';
import { StringingOrdersModule } from './stringing-orders/stringing-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    TennisClubModule,
    CourtsModule,
    LessonSessionsModule,
    BallMachineMaintenanceModule,
    CourtMaintenanceModule,
    RateTiersModule,
    StringingOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
