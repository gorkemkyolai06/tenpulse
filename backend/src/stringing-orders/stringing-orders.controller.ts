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
import { StringingOrdersService } from './stringing-orders.service';
import { CreateStringingOrderDto, UpdateStringingOrderDto } from './dto/stringing-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stringing-orders')
@UseGuards(JwtAuthGuard)
export class StringingOrdersController {
  constructor(private stringingOrdersService: StringingOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { tennisClubId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('stringType') stringType?: string,
  ) {
    return this.stringingOrdersService.list(req.user.tennisClubId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      stringType,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { tennisClubId: string } }) {
    return this.stringingOrdersService.pending(req.user.tennisClubId);
  }

  @Get(':id')
  get(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.stringingOrdersService.get(req.user.tennisClubId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: CreateStringingOrderDto,
  ) {
    return this.stringingOrdersService.create(req.user.tennisClubId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateStringingOrderDto,
  ) {
    return this.stringingOrdersService.update(req.user.tennisClubId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.stringingOrdersService.remove(req.user.tennisClubId, id);
  }
}
