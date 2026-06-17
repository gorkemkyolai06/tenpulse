import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTennisClubDto } from './dto/update-tennis-club.dto';

@Injectable()
export class TennisClubService {
  constructor(private prisma: PrismaService) {}

  async get(tennisClubId: string) {
    const tennisClub = await this.prisma.tennisClub.findUnique({
      where: { id: tennisClubId },
    });
    if (!tennisClub) throw new NotFoundException('Tenis kulübü bulunamadı');
    return tennisClub;
  }

  async update(tennisClubId: string, dto: UpdateTennisClubDto) {
    await this.get(tennisClubId);
    return this.prisma.tennisClub.update({ where: { id: tennisClubId }, data: dto });
  }
}
