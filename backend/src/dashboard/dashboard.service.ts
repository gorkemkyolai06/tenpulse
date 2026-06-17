import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tennisClubId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      tennisClub,
      totalCourts,
      availableCourts,
      inUseCourts,
      totalLessons,
      openBallMachineMaintenance,
      urgentBallMachineMaintenance,
      pendingCourtMaintenance,
      activeRateTiers,
      pendingStringingOrders,
      completedStringingOrders,
      revenueTotals,
      recentLessons,
      recentBallMachineMaintenance,
      courtWings,
    ] = await Promise.all([
      this.prisma.tennisClub.findUnique({ where: { id: tennisClubId } }),
      this.prisma.court.count({ where: { tennisClubId } }),
      this.prisma.court.count({ where: { tennisClubId, status: 'available' } }),
      this.prisma.court.count({ where: { tennisClubId, status: 'in_use' } }),
      this.prisma.lessonSession.count({ where: { tennisClubId } }),
      this.prisma.ballMachineMaintenance.count({
        where: { tennisClubId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.ballMachineMaintenance.count({
        where: {
          tennisClubId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.courtMaintenance.count({
        where: {
          tennisClubId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.rateTier.count({
        where: { tennisClubId, status: 'active' },
      }),
      this.prisma.stringingOrder.count({
        where: { tennisClubId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.stringingOrder.count({
        where: { tennisClubId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.lessonSession.aggregate({
        where: { tennisClubId, sessionAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, ballMachineRentalRevenue: true },
      }),
      this.prisma.lessonSession.findMany({
        where: { tennisClubId },
        include: {
          court: { select: { name: true, wing: true, surface: true } },
        },
        orderBy: { sessionAt: 'desc' },
        take: 5,
      }),
      this.prisma.ballMachineMaintenance.findMany({
        where: { tennisClubId, status: { in: ['open', 'in_progress'] } },
        include: {
          court: { select: { name: true, wing: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.court.groupBy({
        by: ['wing'],
        where: { tennisClubId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = tennisClub?.totalCourts || totalCourts || 1;
    const courtUtilizationRate =
      totalCourts > 0 ? Math.round((inUseCourts / totalCourts) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.ballMachineRentalRevenue || 0);

    const dailyBallMachineRentalRevenue = revenueTotals._sum.ballMachineRentalRevenue || 0;

    const monthlyTrend = await this.getMonthlyTrend(tennisClubId, sixMonthsAgo);

    return {
      totalCourts,
      availableCourts,
      inUseCourts,
      totalCapacity,
      courtUtilizationRate,
      totalLessons,
      openBallMachineMaintenance,
      urgentBallMachineMaintenance,
      pendingCourtMaintenance,
      activeRateTiers,
      pendingStringingOrders,
      completedStringingOrders,
      dailyRevenue,
      dailyBallMachineRentalRevenue,
      recentLessons,
      recentBallMachineMaintenance,
      courtWings: courtWings.map((w) => ({
        wing: w.wing,
        courtCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(tennisClubId: string, since: Date) {
    const sessions = await this.prisma.lessonSession.findMany({
      where: { tennisClubId, sessionAt: { gte: since } },
      select: {
        sessionAt: true,
        cashAmount: true,
        cardAmount: true,
        ballMachineRentalRevenue: true,
        participants: true,
      },
    });

    const months: Record<string, { lessons: number; revenue: number; participants: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { lessons: 0, revenue: 0, participants: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.sessionAt.getFullYear()}-${String(session.sessionAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].lessons++;
        months[key].revenue +=
          session.cashAmount + session.cardAmount + session.ballMachineRentalRevenue;
        months[key].participants += session.participants;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
