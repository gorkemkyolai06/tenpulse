import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtMaintenanceDto, UpdateCourtMaintenanceDto } from './dto/court-maintenance.dto';

@Injectable()
export class CourtMaintenanceService {
  constructor(private prisma: PrismaService) {}

  async list(tennisClubId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tennisClubId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.courtMaintenance.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.courtMaintenance.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tennisClubId: string, id: string) {
    const maintenance = await this.prisma.courtMaintenance.findFirst({
      where: { id, tennisClubId },
    });
    if (!maintenance) throw new NotFoundException('Kort bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(tennisClubId: string, dto: CreateCourtMaintenanceDto) {
    return this.prisma.courtMaintenance.create({
      data: {
        ...dto,
        tennisClubId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(tennisClubId: string, id: string, dto: UpdateCourtMaintenanceDto) {
    await this.get(tennisClubId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.courtMaintenance.update({ where: { id }, data });
  }

  async remove(tennisClubId: string, id: string) {
    await this.get(tennisClubId, id);
    return this.prisma.courtMaintenance.delete({ where: { id } });
  }
}
