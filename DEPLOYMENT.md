# Deployment Notları

## Ortam Değişkenleri

Vercel Project Settings > Environment Variables alanına eklenmesi gerekenler:

```bash
DATABASE_URL="postgresql://..."
ADMIN_SESSION_SECRET="uzun-rastgele-secret"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="gecici-ilk-admin-sifresi"
NEXT_PUBLIC_ENABLE_ANALYTICS_LOGS="false"
```

İlk admin hesabı DB'de yoksa `ADMIN_USERNAME` / `ADMIN_PASSWORD` fallback login olarak çalışır. Yayında ilk girişten sonra `/admin/users` içinden gerçek admin hesabı oluşturup fallback şifreyi güçlü ve gizli tutun.

## Neon

Yeni boş Neon veritabanında:

```bash
npm run prisma:migrate:deploy
```

Mevcut ve boş olmayan Neon şemasında migration baseline gerekebilir. Bu projede aktif geliştirme veritabanı `npx prisma db push` ile senkronlandı.

## Vercel

Build komutu:

```bash
npm run build
```

Install sonrası `postinstall` otomatik `prisma generate` çalıştırır.

## Cloudflare

Alan adını Cloudflare DNS'te Vercel'in verdiği CNAME/A kayıtlarına yönlendirin. Proxy açık kullanılabilir; SSL/TLS modu `Full` veya Vercel önerisine göre `Full (strict)` olmalıdır.

## Yayın Öncesi Kontrol

- `/admin` login çalışıyor.
- `/admin/users` ile admin, öğretmen ve öğrenci hesabı oluşturuluyor.
- Öğretmen `/teacher/assignments/new` üzerinden öğrenciye ödev atıyor.
- Öğrenci `/student/assignments` üzerinden durumu güncelliyor.
- Öğretmen `/teacher/assignments` üzerinden kontrol/puan/feedback giriyor.
- Admin deneme sonucu ve ders programı giriyor.
- Öğrenci deneme sonucu ve aktif ders programını görüyor.
- Header masaüstü ve mobilde taşmıyor.

