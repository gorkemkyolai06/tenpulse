'use client';

import { useEffect, useState } from 'react';
import { Plus, CalendarClock } from 'lucide-react';
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
  formatDateTime,
  formatCourtMaintenanceStatus,
  formatCourtMaintenanceCategory,
} from '@/lib/utils';

interface CourtMaintenanceItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  section?: string;
  scheduledAt: string;
  status: string;
}

interface ListResponse {
  data: CourtMaintenanceItem[];
  total: number;
}

const CATEGORIES = ['surface_repair', 'net_post', 'lighting', 'irrigation', 'line_marking', 'other'];
const STATUSES = ['scheduled', 'in_progress', 'completed', 'overdue'];

const emptyForm = {
  title: '',
  description: '',
  category: 'other',
  section: '',
  scheduledAt: new Date().toISOString().slice(0, 16),
  status: 'scheduled',
};

export default function CourtMaintenancePage() {
  const { token } = useAuth();
  const [items, setItems] = useState<CourtMaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.courtMaintenance
      .list(token)
      .then((res) => setItems((res as ListResponse).data))
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
      await api.courtMaintenance.create(token, {
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        section: form.section || undefined,
        scheduledAt: form.scheduledAt,
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
            <h1 className="font-display text-3xl text-primary">Kort Bakımı</h1>
            <p className="text-muted-foreground">Kort yüzeyi, ağ direği ve aydınlatma bakım planları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="clay-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Plan'}
          </Button>
        </div>

        {showForm && (
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="font-display">Bakım Planı Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Input id="description" value={form.description} onChange={(e) => update('description', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <select id="category" value={form.category} onChange={(e) => update('category', e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatCourtMaintenanceCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Kort / Bölüm</Label>
                  <Input id="section" value={form.section} onChange={(e) => update('section', e.target.value)} placeholder="Örn: Kort 3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Planlanan Tarih</Label>
                  <Input id="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatCourtMaintenanceStatus(s)}</option>
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
        {error && !loading && items.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Bakım planı yok" description="Henüz kort bakım planı eklenmemiş." />
        )}
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="clay-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCourtMaintenanceCategory(item.category)} · {item.section || 'Genel'} · {formatDateTime(item.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatCourtMaintenanceStatus(item.status)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
