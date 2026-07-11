

import { BookOpenCheck, GraduationCap, SearchCheck } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';

const tytAytPublishers = [
  'ÖZDEBİR YAYINLARI',
  'ENDEMİK YAYINLARI',
  '3D YAYINLARI',
  'KAREKÖK YAYINLARI',
  'ÜÇ DÖRT BEŞ YAYINLARI',
  'BİLGİ SARMAL YAYINLARI',
  'KAFA DENGİ YAYINLARI',
  'LİMİT YAYINLARI',
  'AYDIN YAYINLARI',
  'KRALLAR KARMASI',
  'SONUÇ YAYINLARI',
  'PAYLAŞIM YAYINLARI',
  'ENS YAYINLARI',
  'YANIT YAYINLARI',
  'OKSİJEN YAYINLARI',
  'NİTELİK YAYINLARI',
  'NEGO YAYINLARI',
  'AVANTAJ YAYINLARI',
  'TÖDER YAYINLARI',
  'APOTEMİ YAYINLARI',
  'HIZ VE RENK YAYINLARI',
  'TOPRAK YAYINLARI',
  'PALME YAYINLARI',
  'ACİL YAYINLARI',
  'HIZ YAYINLARI',
  'VİP YAYINLARI',
  'ANKARA YAYINLARI',
  'ÇAP YAYINLARI',
  'TEST OKUL YAYINLARI',
  'PRO YAYINLARI',
  'MİRAY YAYINLARI',
  'PRF YAYINLARI',
  'ADAY YAYINLARI',
  '4K YAYINLARI',
  'EĞİTİM VADİSİ',
  'SUPARA YAYINLARI'
];

const lgsPublishers = [
  'ÖZDEBİR YAYINLARI',
  'NARTEST YAYINLARI',
  'ANKARA YAYINCILIK',
  'HIZ YAYINLARI',
  'KAFA DENGİ YAYINLARI',
  'VİP YAYINLARI',
  'BİLFEN YAYINLARI',
  'İŞLEYEN ZEKA YAYINLARI',
  'KR AKADEMİ YAYINLARI',
  'AYDIN YAYINLARI',
  'GÜNAY YAYINLARI',
  'ADAY YAYINLARI',
  'STARFEN YAYINLARI',
  'ÇANTA YAYINLARI',
  'OKSİJEN YAYINLARI',
  'MOZAİK YAYINLARI',
  'PRUVA AKADEMİ',
  'NEWTON YAYINLARI',
  'PRF YAYINLARI',
  'NEGO YAYINLARI',
  'MC2 YAYINLARI',
  'TÖDER YAYINLARI',
  'FENOMEN YAYINLARI',
  'OKYANUS YAYINLARI',
  'SİNAN KUZUCU YAYINLARI',
  'KAREKÖK YAYINLARI',
  'PALME YAYINLARI',
  'SONUÇ YAYINLARI',
  'OMAGE YAYINLARI',
  'NİTELİK YAYINLARI',
  'MUBA YAYINLARI',
  'KÖŞE BİLGİ YAYINLARI',
  'ÇALIŞKAN YAYINLARI',
  'RİTMİK YAYINLARI',
  'YANIT YAYINLARI',
  'NOT YAYINLARI',
  'İSEM YAYINCILIK',
  'GİZLİ YAYINLARI',
  'YENİYORUM YAYINLARI',
  'KANIT YAYINCILIK',
  'BES YAYINLARI',
  'KVK YAYINLARI'
];

function PublisherCard({
  title,
  description,
  publishers,
  icon: Icon
}: {
  title: string;
  description: string;
  publishers: string[];
  icon: typeof BookOpenCheck;
}) {
  const columns = [publishers.slice(0, Math.ceil(publishers.length / 2)), publishers.slice(Math.ceil(publishers.length / 2))];

  return (
    <MotionReveal>
      <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="border-b border-gray-100 bg-gradient-to-r from-black to-[#2b2b2b] p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#ffb18a]">2025-2026 Deneme Yayınları</p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{description}</p>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff611a] text-white shadow-lg shadow-[#ff611a]/30">
              <Icon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={columnIndex === 0 ? 'border-b border-gray-100 md:border-b-0 md:border-r' : ''}>
              {column.map((publisher, index) => {
                const itemNumber = columnIndex === 0 ? index + 1 : index + columns[0].length + 1;

                return (
                  <div key={publisher} className="flex items-center gap-4 border-b border-gray-100 px-5 py-3 last:border-b-0 transition hover:bg-[#fff7f3]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff611a]/10 text-xs font-bold text-[#ff611a]">
                      {itemNumber}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{publisher}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </MotionReveal>
  );
}

export default function YayinlarPage() {
  return (
    <main className="bg-gradient-to-b from-white via-[#fff7f3] to-white">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute left-[-120px] top-10 h-72 w-72 rounded-full bg-[#ff611a]/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-140px] h-80 w-80 rounded-full bg-black/5 blur-3xl" />

        <Container>
          <MotionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-black md:text-6xl">2025-2026 Deneme Yayınlarımız</h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                TYT-AYT ve LGS hazırlık sürecinde öğrencilerimizi farklı zorluk seviyelerindeki seçkin yayınlarla düzenli deneme pratiğine alıyoruz.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <MotionReveal delay={0.05}>
              <div className="rounded-3xl border border-[#ff611a]/15 bg-white p-5 text-center shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
                <SearchCheck className="mx-auto h-7 w-7 text-[#ff611a]" />
                <strong className="mt-3 block text-3xl text-black">{tytAytPublishers.length}</strong>
                <p className="mt-1 text-sm text-gray-500">TYT-AYT yayını</p>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.1}>
              <div className="rounded-3xl border border-[#ff611a]/15 bg-white p-5 text-center shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
                <GraduationCap className="mx-auto h-7 w-7 text-[#ff611a]" />
                <strong className="mt-3 block text-3xl text-black">{lgsPublishers.length}</strong>
                <p className="mt-1 text-sm text-gray-500">LGS yayını</p>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.15}>
              <div className="rounded-3xl border border-[#ff611a]/15 bg-white p-5 text-center shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
                <BookOpenCheck className="mx-auto h-7 w-7 text-[#ff611a]" />
                <strong className="mt-3 block text-3xl text-black">78</strong>
                <p className="mt-1 text-sm text-gray-500">Toplam deneme kaynağı</p>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="space-y-10">
            <PublisherCard
              title="TYT-AYT Deneme Yayınları"
              description="Üniversite hazırlık öğrencilerimiz için farklı soru tarzlarını, seviye geçişlerini ve gerçek sınav temposunu kapsayan yayın seçkisi."
              publishers={tytAytPublishers}
              icon={BookOpenCheck}
            />
            <PublisherCard
              title="LGS Deneme Yayınları"
              description="LGS öğrencilerimiz için konu kazanımı, yeni nesil soru becerisi ve düzenli ölçme-değerlendirme odağında kullanılan yayın havuzu."
              publishers={lgsPublishers}
              icon={GraduationCap}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}