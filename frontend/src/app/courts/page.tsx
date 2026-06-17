'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, CircleDot } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatCourtStatus, formatCourtType } from '@/lib/utils';

interface CourtItem {
  id: string;
  name: string;
  section: string;
  courtType: string;
  surfaceSpec?: string;
  status: string;
}

interface ListResponse {
  data: CourtItem[];
  total: number;
}

const COURT_TYPES = ['hard', 'clay', 'grass', 'indoor'];
const STATUSES = ['available', 'in_use', 'maintenance', 'retired'];

const emptyForm = {
  name: '',
  section: '',
  courtType: 'hard',
  surfaceSpec: '',
  status: 'available',
};

export default function CourtsPage() {
  const { token } = useAuth();
  const [courts, setCourts] = useState<CourtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.courts
      .list(token)
      .then((res) => setCourts((res as ListResponse).data))
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
      await api.courts.create(token, {
        name: form.name,
        section: form.section,
        courtType: form.courtType,
        surfaceSpec: form.surfaceSpec || undefined,
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

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bu kortu silmek istediğinize emin misiniz?')) return;
    try {
      await api.courts.delete(token, id);
      load();
    } catch {
      setError(true);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Kortlar</h1>
            <p className="text-muted-foreground">Sert zemin, kil, çim ve kapalı kort envanteri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="clay-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kort'}
          </Button>
        </div>

        {showForm && (
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="font-display">Kort Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Kort Adı</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Örn: Kort 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Kort Bölgesi</Label>
                  <Input id="section" value={form.section} onChange={(e) => update('section', e.target.value)} required placeholder="Örn: Ana Tesis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtType">Zemin Tipi</Label>
                  <select
                    id="courtType"
                    value={form.courtType}
                    onChange={(e) => update('courtType', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                  >
                    {COURT_TYPES.map((t) => (
                      <option key={t} value={t}>{formatCourtType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surfaceSpec">Zemin Özelliği</Label>
                  <Input
                    id="surfaceSpec"
                    value={form.surfaceSpec}
                    onChange={(e) => update('surfaceSpec', e.target.value)}
                    placeholder="Örn: Profesyonel kil, LED aydınlatma"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatCourtStatus(s)}</option>
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
        {error && !loading && courts.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && courts.length === 0 && (
          <EmptyState
            title="Kort bulunamadı"
            description="Henüz kort eklenmemiş."
            action={
              <Button onClick={() => setShowForm(true)} className="clay-btn">
                <Plus className="mr-2 h-4 w-4" />
                Kort Ekle
              </Button>
            }
          />
        )}
        {!loading && courts.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {courts.map((court) => (
              <Card key={court.id} className="clay-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-accent/10 text-accent">
                      <CircleDot className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-display text-lg">{court.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {court.section} · {formatCourtType(court.courtType)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {court.surfaceSpec || 'Zemin özelliği belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{formatCourtStatus(court.status)}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(court.id)}
                      className="text-destructive"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
