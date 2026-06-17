# TenPulse — Final Dokümantasyon

**Proje:** TenPulse  
**Tamamlanma:** 2026-06-17  
**GitHub:** https://github.com/gorkemkyolai06/tenpulse

## Özet

TenPulse, ABD'deki bağımsız tenis kulüpleri için kort envanteri, ders geliri, top makinesi bakımı, kort bakım planı, kordon siparişleri ve fiyat kademesi yönetimi sunan B2B SaaS platformudur.

## Benzersizlik

| Boyut | TenPulse | En Yakın Proje |
|-------|----------|----------------|
| Sektör | Tenis tesisi | BayPulse (indoor golf) |
| Varlık | Kort / top makinesi | Bay / simulator |
| İş akışı | Kordon siparişleri, ders geliri | Oturum geliri, bay bakımı |
| Tasarım | Clay Court Editorial | Velocity Pit (KartPulse) |

## Demo Hesabı

- E-posta: demo@suncourtstennis.com
- Şifre: demo123456

## Teknik Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS 10, Prisma 5, PostgreSQL 16
- CI: GitHub Actions
- CD: Railway (backend) + Vercel (frontend) — bekliyor

## Modüller

1. Kortlar (8 demo kort)
2. Ders Oturumları
3. Top Makinesi Bakımı
4. Kort Bakımı
5. Kordon Siparişleri
6. Fiyat Kademeleri

## Test Sonuçları

- Unit tests: 1 suite passed
- Integration tests: 18/18 passed
- Frontend build: success

## Deployment Durumu

⏳ Railway ve Vercel GitHub native entegrasyonu henüz yapılandırılmadı. RAILWAY_API_TOKEN ortam değişkeni mevcut değil.

## Kararlar

1. **Tasarım:** Clay Court Editorial — terracotta/yeşil palet, üst sekme navigasyon (sidebar yerine)
2. **Domain:** Tennis-specific modeller (Court, LessonSession, StringingOrder)
3. **Portlar:** 3015/4015/5455 (diğer projelerden farklı)
4. **Deployment:** GitHub native integration tercih edildi (CLI yasak)
