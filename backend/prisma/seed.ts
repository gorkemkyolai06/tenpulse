import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TENNIS_CLUB_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.tennisClub.upsert({
    where: { id: TENNIS_CLUB_ID },
    update: {},
    create: {
      id: TENNIS_CLUB_ID,
      name: 'Sun Courts Tennis Club',
      phone: '+16025550187',
      address: '420 Desert Palm Dr',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85016',
      totalCourts: 8,
      timezone: 'America/Phoenix',
      users: {
        create: {
          email: 'demo@suncourtstennis.com',
          passwordHash,
          firstName: 'Ayşe',
          lastName: 'Yılmaz',
          role: 'owner',
        },
      },
    },
  });

  const courtData = [
    { id: '00000000-0000-0000-0000-000000000101', name: 'Court 1', wing: 'East Wing', surface: 'hard' as const, ballMachineSpec: 'Spinfire Pro 2', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000102', name: 'Court 2', wing: 'East Wing', surface: 'hard' as const, ballMachineSpec: 'Spinfire Pro 2', status: 'in_use' as const },
    { id: '00000000-0000-0000-0000-000000000103', name: 'Court 3', wing: 'East Wing', surface: 'clay' as const, ballMachineSpec: 'Lobster Elite 3', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000104', name: 'Court 4', wing: 'West Wing', surface: 'clay' as const, ballMachineSpec: 'Lobster Elite 3', status: 'in_use' as const },
    { id: '00000000-0000-0000-0000-000000000105', name: 'Court 5', wing: 'West Wing', surface: 'hard' as const, ballMachineSpec: null, status: 'maintenance' as const },
    { id: '00000000-0000-0000-0000-000000000106', name: 'Court 6', wing: 'West Wing', surface: 'hard' as const, ballMachineSpec: 'Spinfire Pro 2', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000107', name: 'Court 7', wing: 'Indoor Pavilion', surface: 'indoor' as const, ballMachineSpec: 'Playmate Grand', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000108', name: 'Court 8', wing: 'Indoor Pavilion', surface: 'indoor' as const, ballMachineSpec: 'Playmate Grand', status: 'closed' as const },
  ];

  const courts = [];
  for (const court of courtData) {
    const created = await prisma.court.upsert({
      where: { id: court.id },
      update: {},
      create: { ...court, tennisClubId: TENNIS_CLUB_ID },
    });
    courts.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.lessonSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      tennisClubId: TENNIS_CLUB_ID,
      courtId: courts[2].id,
      sessionAt: yesterday,
      lessonType: 'group',
      cashAmount: 45.0,
      cardAmount: 980.0,
      participants: 6,
      ballMachineRentalRevenue: 120.0,
      status: 'verified',
    },
  });

  await prisma.lessonSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      tennisClubId: TENNIS_CLUB_ID,
      courtId: courts[3].id,
      sessionAt: yesterday,
      lessonType: 'private',
      cashAmount: 0,
      cardAmount: 540.0,
      participants: 2,
      ballMachineRentalRevenue: 35.0,
      status: 'verified',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.ballMachineMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      tennisClubId: TENNIS_CLUB_ID,
      courtId: courts[4].id,
      title: 'Top makinesi motor arızası — Court 5',
      description: 'Spinfire Pro 2 motor aşırı ısınma ve top besleme takılması',
      reportedAt,
      priority: 'high',
      status: 'in_progress',
    },
  });

  await prisma.ballMachineMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      tennisClubId: TENNIS_CLUB_ID,
      courtId: courts[1].id,
      title: 'Top sepeti sensör kontrolü — Court 2',
      description: 'Lobster Elite 3 top algılama sensörü kalibrasyonu gerekli',
      reportedAt,
      priority: 'urgent',
      status: 'open',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  await prisma.courtMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      tennisClubId: TENNIS_CLUB_ID,
      title: 'Kort yüzeyi yenileme — Court 3',
      description: 'Kil kort yüzeyi yenileme ve çizgi boyama',
      category: 'resurfacing',
      wing: 'East Wing',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.courtMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      tennisClubId: TENNIS_CLUB_ID,
      title: 'Aydınlatma armatürü değişimi',
      description: 'West Wing gece oyunu LED armatür değişimi',
      category: 'lighting',
      wing: 'West Wing',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      tennisClubId: TENNIS_CLUB_ID,
      title: 'Saatlik Kort Kiralama',
      rateCategory: 'court_rental',
      basePrice: 42.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      tennisClubId: TENNIS_CLUB_ID,
      title: '10 Ders Paketi',
      rateCategory: 'lesson_package',
      basePrice: 650.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000503' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000503',
      tennisClubId: TENNIS_CLUB_ID,
      title: 'Lig Gecesi',
      rateCategory: 'league_night',
      basePrice: 28.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  const stringingData = [
    { id: '00000000-0000-0000-0000-000000000601', customerName: 'Mehmet Demir', stringType: 'Luxilon ALU Power', racketModel: 'Wilson Blade 98', status: 'pending' as const, price: 35.0 },
    { id: '00000000-0000-0000-0000-000000000602', customerName: 'Zeynep Kaya', stringType: 'Babolat RPM Blast', racketModel: 'Head Radical MP', status: 'in_progress' as const, price: 32.0 },
    { id: '00000000-0000-0000-0000-000000000603', customerName: 'Can Öztürk', stringType: 'Yonex Poly Tour Pro', racketModel: 'Yonex Ezone 100', status: 'completed' as const, price: 30.0 },
    { id: '00000000-0000-0000-0000-000000000604', customerName: 'Elif Arslan', stringType: 'Tecnifibre Razor Code', racketModel: 'Babolat Pure Drive', status: 'delivered' as const, price: 34.0 },
    { id: '00000000-0000-0000-0000-000000000605', customerName: 'Burak Şahin', stringType: 'Luxilon 4G', racketModel: 'Wilson Pro Staff 97', status: 'pending' as const, price: 38.0 },
  ];

  for (const order of stringingData) {
    await prisma.stringingOrder.upsert({
      where: { id: order.id },
      update: {},
      create: { ...order, tennisClubId: TENNIS_CLUB_ID },
    });
  }

  console.log('TenPulse seed completed — demo@suncourtstennis.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
