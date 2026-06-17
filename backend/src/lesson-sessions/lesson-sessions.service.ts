import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonSessionDto, UpdateLessonSessionDto } from './dto/lesson-session.dto';

@Injectable()
export class LessonSessionsService {
  constructor(private prisma: PrismaService) {}

  async list(tennisClubId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tennisClubId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.lessonSession.findMany({
        where,
        orderBy: { sessionAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          court: { select: { id: true, name: true, wing: true, surface: true } },
        },
      }),
      this.prisma.lessonSession.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tennisClubId: string, id: string) {
    const session = await this.prisma.lessonSession.findFirst({
      where: { id, tennisClubId },
      include: { court: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(tennisClubId: string, dto: CreateLessonSessionDto) {
    return this.prisma.lessonSession.create({
      data: {
        ...dto,
        tennisClubId,
        sessionAt: dto.sessionAt ? new Date(dto.sessionAt) : new Date(),
      },
      include: { court: true },
    });
  }

  async update(tennisClubId: string, id: string, dto: UpdateLessonSessionDto) {
    await this.get(tennisClubId, id);
    const data = { ...dto };
    if (dto.sessionAt) {
      (data as { sessionAt?: Date }).sessionAt = new Date(dto.sessionAt);
    }
    return this.prisma.lessonSession.update({
      where: { id },
      data,
      include: { court: true },
    });
  }

  async remove(tennisClubId: string, id: string) {
    await this.get(tennisClubId, id);
    return this.prisma.lessonSession.delete({ where: { id } });
  }
}
