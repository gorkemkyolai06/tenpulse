'use client';

import { useEffect, useState } from 'react';
import { CircleDot, DollarSign, Cog, CalendarClock, TrendingUp, AlertTriangle, GraduationCap } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatSessionStatus,
  formatBallMachineMaintenanceStatus,
  formatBallMachineMaintenancePriority,
  formatCourtType,
} from '@/lib/utils';

interface DashboardStats {
  totalCourts: number;
  availableCourts: number;
  inUseCourts: number;
  courtUtilizationRate: number;
  openBallMachineMaintenance: number;
  urgentBallMachineMaintenance: number;
  pendingCourtMaintenance: number;
  dailyRevenue: number;
  recentLessons: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    stringingRevenue: number;
    sessionAt: string;
    status: string;
    court?: { name: string; section: string; courtType: string };
  }>;
  recentBallMachineMaintenance: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    machineName?: string;
  }>;
  courtSections: Array<{ section: string; courtCount: number }>;
  monthlyTrend: Array<{ month: string; sessions: number; revenue: number }>;
}

function formatTrendMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Operasyon Paneli</h1>
          <p className="text-muted-foreground">Kort kullanımı ve günlük gelir özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Kort Kullanımı"
                value={formatPercent(stats.courtUtilizationRate)}
                description={`${stats.availableCourts}/${stats.totalCourts} kort müsait`}
                icon={<CircleDot className="h-4 w-4" />}
              />
              <StatCard
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.inUseCourts} kort kullanımda`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatCard
                title="Top Makinesi Bakımı"
                value={stats.openBallMachineMaintenance}
                description={`${stats.urgentBallMachineMaintenance} acil/yüksek öncelik`}
                icon={<Cog className="h-4 w-4" />}
              />
              <StatCard
                title="Kort Bakım Planı"
                value={stats.pendingCourtMaintenance}
                description="7 gün içinde planlanan"
                icon={<CalendarClock className="h-4 w-4" />}
              />
            </div>

            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <GraduationCap className="h-4 w-4 text-accent" />
                  Son Ders Oturumları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentLessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz oturum kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentLessons.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{session.court?.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.court?.section} · {formatCourtType(session.court?.courtType || '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {formatCurrency(
                              session.cashAmount + session.cardAmount + session.stringingRevenue,
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                        </div>
                        <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Açık Top Makinesi Bakım Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentBallMachineMaintenance.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Açık bakım kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentBallMachineMaintenance.map((item) => (
                      <div key={item.id} className="bg-muted/40 px-4 py-3">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.machineName || 'Makine belirtilmemiş'} · {formatBallMachineMaintenancePriority(item.priority)} ·{' '}
                          {formatBallMachineMaintenanceStatus(item.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Aylık Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.monthlyTrend.map((row) => (
                    <div key={row.month} className="flex justify-between text-sm">
                      <span>{formatTrendMonth(row.month)}</span>
                      <span className="font-mono font-semibold">{formatCurrency(row.revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="clay-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <CircleDot className="h-4 w-4 text-accent" />
                    Kort Bölge Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.courtSections.map((z) => (
                    <div key={z.section} className="flex justify-between text-sm">
                      <span>{z.section}</span>
                      <Badge variant="secondary">{z.courtCount} kort</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
