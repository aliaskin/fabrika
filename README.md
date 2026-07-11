# FABRİKA Eğitim Akademi Web Sitesi

Next.js 14 + TypeScript + Tailwind CSS + Framer Motion tabanlı butik eğitim kurumu websitesi.

## Kurulum

```bash
npm install
npm run prisma:generate
# Veritabanını ilk kurulumda oluştur
npm run prisma:push
npm run dev
```

`.env.example` dosyasını `.env` olarak kopyalayıp doldurun.

## Sayfalar

- `/` Anasayfa
- `/hakkimizda`
- `/programlar`
- `/kazananlarimiz`
- `/yayinlar`
- `/iletisim`
- `/admin` (admin giriş)
- `/admin/loglar` (audit log ve form kayıtları)

## Admin CMS ve İçerik Yönetimi

Admin giriş yaptıktan sonra ana sayfada ve ilgili bölümlerde:

- Kalem ikonuyla metin/resim düzenleme
- Çöp ikonuyla içerik kaldırma
- Kazananlarımız kartlarını ekleme/düzenleme/silme

API uçları:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET|POST /api/cms`
- `PATCH|DELETE /api/cms/[key]`
- `GET|POST /api/winners`
- `PATCH|DELETE /api/winners/[id]`
- `POST /api/contact`
- `POST /api/log`

## Log Altyapısı

Veritabanında şu loglar tutulur:

- Sayfa görüntüleme/ayrılma (`page_view`, `page_leave`)
- Admin giriş/çıkış
- CMS düzenleme/silme
- Kazanan kaydı ekleme/güncelleme/silme
- Form gönderimleri

`/admin/loglar` sayfasından görüntülenebilir.

## Görsel / Medya Değiştirme

Gerçek medya eklemek için:

1. Gerçek görselleri `public/images` altına ekleyin.
2. Görsel gereken alanlarda `next/image` kullanın.
3. Harita iframe adresi `data/site-content.ts` içindeki `contactInfo.mapEmbed` değerinden yönetilir.

## Logo Değiştirme

- Hero logosu: `public/fabrika-logo.png`
- Marka işareti bileşeni: `components/shared/brand-mark.tsx`

## İletişim Bilgisi Değiştirme

- Telefon / WhatsApp / e-posta / adres:
  `data/site-content.ts` içindeki `contactInfo`

## Vercel Yayın Notu

- Vercel’de **Postgres** (Vercel Postgres / Neon / Supabase) bağlantısı kullanın.
- `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` env değerlerini Vercel’e ekleyin.
- Deploy sonrası bir kez `npm run prisma:push` çalıştırın (veya CI adımı ekleyin).
