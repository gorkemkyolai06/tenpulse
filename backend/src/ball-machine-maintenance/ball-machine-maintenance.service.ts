import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBallMachineMaintenanceDto,
  UpdateBallMachineMaintenanceDto,
} from './dto/ball-machine-maintenance.dto';

@Injectable()
export class BallMachineMaintenanceService {
  constructor(private prisma: PrismaService) {}

  async list(
    tennisClubId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tennisClubId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.ballMachineMaintenance.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          court: { select: { id: true, name: true, wing: true } },
        },
      }),
      this.prisma.ballMachineMaintenance.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(tennisClubId: string) {
    return this.prisma.ballMachineMaintenance.findMany({
      where: {
        tennisClubId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: { court: { select: { name: true, wing: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 10,
    });
  }

  async get(tennisClubId: string, id: string) {
    const maintenance = await this.prisma.ballMachineMaintenance.findFirst({
      where: { id, tennisClubId },
      include: { court: true },
    });
    if (!maintenance) throw new NotFoundException('Top makinesi bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(tennisClubId: string, dto: CreateBallMachineMaintenanceDto) {
    return this.prisma.ballMachineMaintenance.create({
      data: {
        ...dto,
        tennisClubId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
      },
      include: { court: true },
    });
  }

  async update(tennisClubId: string, id: string, dto: UpdateBallMachineMaintenanceDto) {
    await this.get(tennisClubId, id);
    const data = { ...dto };
    if (dto.reportedAt) {
      (data as { reportedAt?: Date }).reportedAt = new Date(dto.reportedAt);
    }
    if (dto.completedAt) {
      (data as { completedAt?: Date }).completedAt = new Date(dto.completedAt);
    }
    return this.prisma.ballMachineMaintenance.update({
      where: { id },
      data,
      include: { court: true },
    });
  }

  async remove(tennisClubId: string, id: string) {
    await this.get(tennisClubId, id);
    return this.prisma.ballMachineMaintenance.delete({ where: { id } });
  }
}
