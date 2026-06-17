import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    tennisClub: { findUnique: jest.fn() },
    court: { count: jest.fn(), groupBy: jest.fn() },
    lessonSession: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    ballMachineMaintenance: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    courtMaintenance: { count: jest.fn() },
    rateTier: { count: jest.fn() },
    stringingOrder: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return tennis club dashboard stats', async () => {
    mockPrisma.tennisClub.findUnique.mockResolvedValue({ totalCourts: 8 });
    mockPrisma.court.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.lessonSession.count.mockResolvedValue(42);
    mockPrisma.ballMachineMaintenance.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.lessonSession.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, ballMachineRentalRevenue: 95 },
    });
    mockPrisma.lessonSession.findMany.mockResolvedValue([]);
    mockPrisma.ballMachineMaintenance.findMany.mockResolvedValue([]);
    mockPrisma.courtMaintenance.count.mockResolvedValue(2);
    mockPrisma.rateTier.count.mockResolvedValue(3);
    mockPrisma.stringingOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.court.groupBy.mockResolvedValue([
      { wing: 'East Wing', _count: { id: 3 } },
      { wing: 'West Wing', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('tennis-club-1');

    expect(stats).toHaveProperty('courtUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyBallMachineRentalRevenue', 95);
    expect(stats).toHaveProperty('courtWings');
    expect(stats).toHaveProperty('urgentBallMachineMaintenance');
    expect(stats).toHaveProperty('pendingCourtMaintenance');
    expect(stats).toHaveProperty('activeRateTiers', 3);
    expect(stats).toHaveProperty('pendingStringingOrders', 3);
    expect(stats).toHaveProperty('completedStringingOrders', 2);
    expect(stats).toHaveProperty('availableCourts', 4);
    expect(stats).toHaveProperty('totalCourts', 8);
  });
});
