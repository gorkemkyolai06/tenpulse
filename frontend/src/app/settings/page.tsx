'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface TennisClubProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalCourts: number;
  timezone: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [club, setClub] = useState<TennisClubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.tennisClub
      .get(token)
      .then((data) => setClub(data as TennisClubProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !club) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.tennisClub.update(token, club as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Ayarlar</h1>
          <p className="text-muted-foreground">Tenis kulübü profil bilgileri</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && !club && <ErrorState onRetry={load} />}
        {club && !loading && (
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="font-display">Kulüp Profili</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="border border-success bg-success/10 p-3 text-sm text-success" role="status">
                    Ayarlar kaydedildi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Kulüp Adı</Label>
                  <Input
                    id="name"
                    value={club.name}
                    onChange={(e) => setClub({ ...club, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={club.phone || ''}
                    onChange={(e) => setClub({ ...club, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={club.address || ''}
                    onChange={(e) => setClub({ ...club, address: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      value={club.city || ''}
                      onChange={(e) => setClub({ ...club, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">İl</Label>
                    <Input
                      id="state"
                      value={club.state || ''}
                      onChange={(e) => setClub({ ...club, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Posta Kodu</Label>
                    <Input
                      id="zipCode"
                      value={club.zipCode || ''}
                      onChange={(e) => setClub({ ...club, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCourts">Toplam Kort Sayısı</Label>
                  <Input
                    id="totalCourts"
                    type="number"
                    value={club.totalCourts}
                    onChange={(e) =>
                      setClub({ ...club, totalCourts: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <Button type="submit" disabled={saving} className="clay-btn">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
