import { Module } from '@nestjs/common';
import { StringingOrdersController } from './stringing-orders.controller';
import { StringingOrdersService } from './stringing-orders.service';

@Module({
  controllers: [StringingOrdersController],
  providers: [StringingOrdersService],
})
export class StringingOrdersModule {}
