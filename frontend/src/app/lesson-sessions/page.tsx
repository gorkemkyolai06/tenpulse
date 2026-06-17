'use client';

import { useEffect, useState } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatSessionStatus,
  formatCourtType,
} from '@/lib/utils';

interface CourtOption {
  id: string;
  name: string;
  section: string;
}

interface LessonSession {
  id: string;
  cashAmount: number;
  cardAmount: number;
  stringingRevenue: number;
  participants: number;
  sessionAt: string;
  status: string;
  court?: { id: string; name: string; section: string; courtType: string };
}

interface ListResponse {
  data: LessonSession[];
  total: number;
}

const SESSION_STATUSES = ['recorded', 'verified', 'disputed'];

const emptyForm = {
  courtId: '',
  cashAmount: '0',
  cardAmount: '0',
  stringingRevenue: '0',
  participants: '0',
  sessionAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function LessonSessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<LessonSession[]>([]);
  const [courts, setCourts] = useState<CourtOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.lessonSessions.list(token), api.courts.list(token)])
      .then(([sessionsRes, courtsRes]) => {
        setSessions((sessionsRes as ListResponse).data);
        setCourts(
          ((courtsRes as { data: CourtOption[] }).data || []).map((c) => ({
            id: c.id,
            name: c.name,
            section: c.section,
          })),
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await api.lessonSessions.create(token, {
        courtId: form.courtId,
        cashAmount: parseFloat(form.cashAmount),
        cardAmount: parseFloat(form.cardAmount),
        stringingRevenue: parseFloat(form.stringingRevenue),
        participants: parseInt(form.participants, 10),
        sessionAt: form.sessionAt,
        status: form.status,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Ders Oturumları</h1>
            <p className="text-muted-foreground">Günlük ders geliri ve oturum kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="clay-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oturum'}
          </Button>
        </div>

        {showForm && (
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="font-display">Ders Oturumu Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="courtId">Kort</Label>
                  <select
                    id="courtId"
                    value={form.courtId}
                    onChange={(e) => update('courtId', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Kort seçin</option>
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashAmount">Nakit ($)</Label>
                  <Input id="cashAmount" type="number" min={0} step="0.01" value={form.cashAmount} onChange={(e) => update('cashAmount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardAmount">Kart ($)</Label>
                  <Input id="cardAmount" type="number" min={0} step="0.01" value={form.cardAmount} onChange={(e) => update('cardAmount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stringingRevenue">Kordon Geliri ($)</Label>
                  <Input id="stringingRevenue" type="number" min={0} step="0.01" value={form.stringingRevenue} onChange={(e) => update('stringingRevenue', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Katılımcı Sayısı</Label>
                  <Input id="participants" type="number" min={0} value={form.participants} onChange={(e) => update('participants', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionAt">Oturum Tarihi</Label>
                  <Input id="sessionAt" type="datetime-local" value={form.sessionAt} onChange={(e) => update('sessionAt', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm">
                    {SESSION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatSessionStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="clay-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && sessions.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && sessions.length === 0 && (
          <EmptyState title="Oturum bulunamadı" description="Henüz ders oturumu eklenmemiş." />
        )}
        {!loading && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="clay-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{session.court?.name || '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.court?.section} · {formatCourtType(session.court?.courtType || '')} · {session.participants} katılımcı
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold">
                      {formatCurrency(session.cashAmount + session.cardAmount + session.stringingRevenue)}
                    </span>
                    <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
