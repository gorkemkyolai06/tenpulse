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
import { RateTiersService } from './rate-tiers.service';
import { CreateRateTierDto, UpdateRateTierDto } from './dto/rate-tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rate-tiers')
@UseGuards(JwtAuthGuard)
export class RateTiersController {
  constructor(private rateTiersService: RateTiersService) {}

  @Get()
  list(
    @Request() req: { user: { tennisClubId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.rateTiersService.list(req.user.tennisClubId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.rateTiersService.get(req.user.tennisClubId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: CreateRateTierDto,
  ) {
    return this.rateTiersService.create(req.user.tennisClubId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateRateTierDto,
  ) {
    return this.rateTiersService.update(req.user.tennisClubId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tennisClubId: string } }, @Param('id') id: string) {
    return this.rateTiersService.remove(req.user.tennisClubId, id);
  }
}
