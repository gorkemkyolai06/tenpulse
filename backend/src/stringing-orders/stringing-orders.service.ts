import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStringingOrderDto, UpdateStringingOrderDto } from './dto/stringing-order.dto';

@Injectable()
export class StringingOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    tennisClubId: string,
    params: { page?: number; status?: string; stringType?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tennisClubId };
    if (params.status) where.status = params.status;
    if (params.stringType) where.stringType = params.stringType;

    const [data, total] = await Promise.all([
      this.prisma.stringingOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { customerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.stringingOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(tennisClubId: string) {
    return this.prisma.stringingOrder.findMany({
      where: { tennisClubId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(tennisClubId: string, id: string) {
    const order = await this.prisma.stringingOrder.findFirst({
      where: { id, tennisClubId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(tennisClubId: string, dto: CreateStringingOrderDto) {
    return this.prisma.stringingOrder.create({ data: { ...dto, tennisClubId } });
  }

  async update(tennisClubId: string, id: string, dto: UpdateStringingOrderDto) {
    await this.get(tennisClubId, id);
    return this.prisma.stringingOrder.update({ where: { id }, data: dto });
  }

  async remove(tennisClubId: string, id: string) {
    await this.get(tennisClubId, id);
    return this.prisma.stringingOrder.delete({ where: { id } });
  }
}
