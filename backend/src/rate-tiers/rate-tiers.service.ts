import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateTierDto, UpdateRateTierDto } from './dto/rate-tier.dto';

@Injectable()
export class RateTiersService {
  constructor(private prisma: PrismaService) {}

  async list(tennisClubId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tennisClubId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.rateTier.findMany({
        where,
        orderBy: { rateCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.rateTier.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tennisClubId: string, id: string) {
    const tier = await this.prisma.rateTier.findFirst({
      where: { id, tennisClubId },
    });
    if (!tier) throw new NotFoundException('Tarife bulunamadı');
    return tier;
  }

  async create(tennisClubId: string, dto: CreateRateTierDto) {
    return this.prisma.rateTier.create({ data: { ...dto, tennisClubId } });
  }

  async update(tennisClubId: string, id: string, dto: UpdateRateTierDto) {
    await this.get(tennisClubId, id);
    return this.prisma.rateTier.update({ where: { id }, data: dto });
  }

  async remove(tennisClubId: string, id: string) {
    await this.get(tennisClubId, id);
    return this.prisma.rateTier.delete({ where: { id } });
  }
}
