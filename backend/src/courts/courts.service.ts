import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtDto, UpdateCourtDto } from './dto/court.dto';

@Injectable()
export class CourtsService {
  constructor(private prisma: PrismaService) {}

  async list(tennisClubId: string, params: { page?: number; status?: string; wing?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tennisClubId };
    if (params.status) where.status = params.status;
    if (params.wing) where.wing = params.wing;

    const [data, total] = await Promise.all([
      this.prisma.court.findMany({
        where,
        orderBy: [{ wing: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          ballMachineMaintenance: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.court.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tennisClubId: string, id: string) {
    const court = await this.prisma.court.findFirst({
      where: { id, tennisClubId },
      include: {
        ballMachineMaintenance: { orderBy: { reportedAt: 'desc' }, take: 5 },
        lessonSessions: { orderBy: { sessionAt: 'desc' }, take: 5 },
      },
    });
    if (!court) throw new NotFoundException('Kort bulunamadı');
    return court;
  }

  async create(tennisClubId: string, dto: CreateCourtDto) {
    return this.prisma.court.create({ data: { ...dto, tennisClubId } });
  }

  async update(tennisClubId: string, id: string, dto: UpdateCourtDto) {
    await this.get(tennisClubId, id);
    return this.prisma.court.update({ where: { id }, data: dto });
  }

  async remove(tennisClubId: string, id: string) {
    await this.get(tennisClubId, id);
    return this.prisma.court.delete({ where: { id } });
  }
}
