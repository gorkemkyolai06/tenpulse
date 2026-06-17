# TenPulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| TennisClub | tennis_clubs | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| LessonSession | lesson_sessions | Ders gelir kayıtları |
| BallMachineMaintenance | ball_machine_maintenance | Top makinesi bakım |
| CourtMaintenance | court_maintenance | Kort bakım planı |
| StringingOrder | stringing_orders | Kordon siparişleri |
| RateTier | rate_tiers | Fiyat kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Sun Courts Tennis Club (Phoenix, AZ)
- 1 demo kullanıcı: demo@suncourtstennis.com
- 8 kort (kil, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
