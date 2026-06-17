'use client';

import { useEffect, useState } from 'react';
import { Plus, Tags } from 'lucide-react';
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
  formatRateStatus,
  formatRateCategory,
} from '@/lib/utils';

interface RateTier {
  id: string;
  title: string;
  rateCategory: string;
  basePrice: number;
  status: string;
}

interface ListResponse {
  data: RateTier[];
  total: number;
}

const CATEGORIES = [
  'court_rental',
  'lesson_package',
  'clinic',
  'league',
  'tournament',
  'membership',
  'other',
];
const STATUSES = ['active', 'upcoming', 'archived'];

const emptyForm = {
  title: '',
  rateCategory: 'court_rental',
  basePrice: '35.00',
  status: 'active',
};

export default function RateTiersPage() {
  const { token } = useAuth();
  const [tiers, setTiers] = useState<RateTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.rateTiers
      .list(token)
      .then((res) => setTiers((res as ListResponse).data))
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
      await api.rateTiers.create(token, {
        title: form.title,
        rateCategory: form.rateCategory,
        basePrice: parseFloat(form.basePrice),
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
            <h1 className="font-display text-3xl text-primary">Fiyat Kademeleri</h1>
            <p className="text-muted-foreground">Kort kiralama, ders paketi ve turnuva fiyatları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="clay-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kademe'}
          </Button>
        </div>

        {showForm && (
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="font-display">Fiyat Kademesi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    required
                    placeholder="Örn: Saatlik Kort Kiralama"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateCategory">Kategori</Label>
                  <select
                    id="rateCategory"
                    value={form.rateCategory}
                    onChange={(e) => update('rateCategory', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatRateCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Temel Fiyat ($)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.basePrice}
                    onChange={(e) => update('basePrice', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 text-sm sm:max-w-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatRateStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="clay-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && tiers.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && tiers.length === 0 && (
          <EmptyState
            title="Fiyat kademesi bulunamadı"
            description="Henüz fiyat kademesi yok."
            action={
              <Button onClick={() => setShowForm(true)} className="clay-btn">
                <Plus className="mr-2 h-4 w-4" />
                Kademe Ekle
              </Button>
            }
          />
        )}
        {!loading && tiers.length > 0 && (
          <Card className="clay-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3" scope="col">Başlık</th>
                      <th className="p-3" scope="col">Kategori</th>
                      <th className="p-3" scope="col">Temel Fiyat</th>
                      <th className="p-3" scope="col">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier) => (
                      <tr key={tier.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Tags className="h-4 w-4 text-accent" />
                            {tier.title}
                          </span>
                        </td>
                        <td className="p-3">{formatRateCategory(tier.rateCategory)}</td>
                        <td className="p-3 font-mono font-bold">{formatCurrency(tier.basePrice)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatRateStatus(tier.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
