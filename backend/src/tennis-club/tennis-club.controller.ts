import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { TennisClubService } from './tennis-club.service';
import { UpdateTennisClubDto } from './dto/update-tennis-club.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tennis-club')
@UseGuards(JwtAuthGuard)
export class TennisClubController {
  constructor(private tennisClubService: TennisClubService) {}

  @Get()
  get(@Request() req: { user: { tennisClubId: string } }) {
    return this.tennisClubService.get(req.user.tennisClubId);
  }

  @Patch()
  update(
    @Request() req: { user: { tennisClubId: string } },
    @Body() dto: UpdateTennisClubDto,
  ) {
    return this.tennisClubService.update(req.user.tennisClubId, dto);
  }
}
