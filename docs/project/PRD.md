# TenPulse — Ürün Gereksinim Belgesi (PRD)

**Durum:** MVP Tamamlandı  
**Oluşturma:** 2026-06-17  
**GitHub:** https://github.com/gorkemkyolai06/tenpulse

## Özet

TenPulse, ABD'deki bağımsız tenis kulüpleri için kort envanteri, ders oturum geliri takibi, top makinesi bakım yönetimi, kort bakım planlaması, kordon siparişleri ve fiyat kademesi yönetimi sunan B2B SaaS platformudur.

## Tasarım Yönü: Clay Court Editorial

Toprak kort ve editoryal tenis estetiği — terracotta kil (#C4662A), kort yeşili (#2D5A27), tebeşir beyazı (#FAFAF5), baseline lacivert (#1E3A5F). Libre Baskerville + Source Sans 3 tipografi, üst sekme navigasyon, 2px köşe yarıçapı, kort çizgisi ayırıcılar.

## Hedef Kitle

- ABD Sun Belt'teki 4-12 kortlu bağımsız tenis kulüpleri (Arizona, Florida, California)
- 1-2 lokasyonlu aile işletmeleri
- Kort bakımını ve ders gelirlerini Excel ile yöneten operatörler

## Problem

Kort durumları, top makinesi bakım iş emirleri, kordon siparişleri ve günlük ders gelir kayıtları dağınık tablolarda tutuluyor. Kort bakım planları senkronize değil; kordon teslim tarihleri kağıt formlarda kayboluyor.

## Çözüm

- Kort envanteri ve durum takibi (müsait, kullanımda, bakımda, kapalı)
- Ders oturum geliri ve katılımcı kayıtları
- Top makinesi bakım iş emirleri ve öncelik yönetimi
- Kort bakım planı ve tamamlanma kaydı
- Kordon siparişleri (müşteri, raket, tel tipi, gerilim)
- Fiyat kademeleri (kort kiralama, ders paketi, lig gecesi)

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@suncourtstennis.com |
| Şifre | demo123456 |
| Tesis | Sun Courts Tennis Club |

## Portlar

| Servis | Port |
|--------|------|
| Frontend | 3015 |
| Backend | 4015 |
| Postgres | 5455 |

## Modüller

1. **Kortlar** — Kil, sert, çim, kapalı kort envanteri
2. **Ders Oturumları** — Özel ders, grup, klinik gelir kayıtları
3. **Top Makinesi Bakımı** — Motor, besleme, genel bakım iş emirleri
4. **Kort Bakımı** — Yüzey yenileme, file değişimi, çizgi boyama
5. **Kordon Siparişleri** — Müşteri, raket markası, tel tipi, gerilim
6. **Fiyat Kademeleri** — Kort kiralama, ders paketi, lig gecesi
