import type { Metadata } from 'next';
import { CheckCircle2, Eye, Flag, Target } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Hakkımızda | Fabrika Eğitim Akademi',
  description:
    'Fabrika Eğitim Akademi’nin butik dershane, kişiye özel öğretim, özel ders, LGS ve YKS hazırlık yaklaşımı.'
};

const aboutParagraphs = [
  'Her öğrencinin özel ve değerli olduğu anlayışıyla kişiye özgü yaklaşım üzerine kurulmuş bir kurum olarak 2013 yılından beri Beşiktaş merkezde Çizgi Ötesi Akademi ismiyle eğitim vermekteydik. 2023-2024 yılında isim değişikliğine giderek Fabrika Eğitim Akademi adıyla aynı özveri ve çalışmayla kaldığımız yerden devam ediyoruz. YKS (TYT-AYT), LGS grup ve bireysel çalışmalarla kalabalık olmayan sınıflarda genç ve enerjik, Türkiye’nin önde gelen üniversitelerinden mezun deneyimli eğitmenlerimizle öğrencilerimizi hazırlıyoruz. Kurumumuz her sene Türkiye’nin en iyi üniversitelerine büyük bir gururla öğrencilerini yollamaktadır.',
  'Klasik dershaneciliğin önüne geçen butik dershane, butik eğitim ve özel öğretim anlayışı ile 2013 yılında kuruluş temelleri atılan ve o tarihten bu yana Beşiktaş’ta hizmetine devam eden Fabrika Eğitim Akademi; bu alanda verdiği özel ders hizmeti, eğitim ve öğretim kalitesi, deneyimli öğretmen kadrosu, kalabalık olmayan sınıflarda eğitim, kişiye özel hazırlanan programlar, lise ve üniversiteye hazırlık, YKS-LGS kurs programları ve koçluk sistemi ile İstanbul’daki en iyi butik dershaneler sıralamasında hızla yükselen ve kısa sürede isminden söz ettiren bir kurum haline gelmiştir.'
];

const visionItems = [
  'Eğitim ve öğretim sektöründe akademik bir altyapı ile üstün kaliteyi benimsemiş örnek ve lider bir kurum olmak.',
  'Modern eğitim anlayışıyla ileri öğretim düzeylerine ulaşabilecek donanımlı bireyler yetiştirmek.',
  'Profesyonel, dinamik öğretim ve yönetim kadrosu ile en iyi olmak amacıyla üstün hizmet sağlamak.',
  'Uzman rehber öğretmen kadrosunun desteği ile öğrencilerin karşılaşabileceği her türlü sosyal ve psikolojik sorunların üstesinden gelmesini sağlayarak başarıyı garantilemektir.'
];

const missionItems = [
  'Atatürk ilke ve inkılaplarını yaşam biçimi olarak benimseyen,',
  'Ailesine, ülkesine ve içinde yaşadığı dünyaya saygı duyan ve faydalı olan,',
  'Kültürler arası deneyimlere açık olan ve kültürel farklılıklara saygı duyan,',
  'Öğrenmeyi seven ve ders ortamında mutlu olan,',
  'Sürekli öğrenen, öğrendiklerini günlük hayatla ilişkilendiren ve öğrendikçe gelişen,',
  'Sadece zihinsel olarak değil, katılmış olduğu sosyal, kültürel, sanatsal ve sportif etkinliklerde bütünsel olarak gelişen,',
  'Yapılan sınavlarda başarılı olan,',
  'Özgüveni yüksek ve bu kapsamda hem kendisine hem de başkalarına güven duyan,',
  'Sorumluluklarını bilen ve bunları yerine getiren,',
  'Etkili iletişim becerilerine sahip,',
  'Eğitim teknolojilerini kullanabilen ve bu yeteneğini diğer bireylere aktarabilen bireyler yetiştirmeyi hedeflemekteyiz.'
];

const goalsText =
  'Fabrika Eğitim Akademi olarak Atatürk ilke ve inkılaplarına bağlı, vatanını, milletini seven, çağın gereklerine ayak uydurabilen, özgüveni yüksek, yenilikçi, yaratıcı, çağdaş bireyler yetiştirmek için bir yola çıkmış bulunmaktayız. Üniversiteye ve liseye hazırlanan öğrencilerimizin rakiplerinin çok üstünde bir öğretim anlayışıyla eksiklerinin bireysel olarak deneyimli öğretmenlerle kısa zamanda giderilmesini amaçlamaktayız.';

function ListPanel({
  eyebrow,
  title,
  items,
  icon: Icon,
  delay = 0
}: {
  eyebrow: string;
  title: string;
  items: string[];
  icon: typeof Eye;
  delay?: number;
}) {
  return (
    <MotionReveal delay={delay}>
      <section className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
        <div className="border-b border-gray-100 bg-gradient-to-r from-black to-[#2b2b2b] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb18a]">{eyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#ff611a] text-white">
              <Icon className="h-6 w-6" />
            </span>
          </div>
        </div>
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item} className="flex gap-3 px-5 py-4 text-sm leading-relaxed text-gray-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff611a]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </MotionReveal>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-white via-[#fff8f4] to-white">
      <section className="pb-14 pt-28 md:pb-20 md:pt-36">
        <Container>
          <MotionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#0b0b0b] md:text-6xl">Hakkımızda</h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">
                Fabrika Eğitim Akademi - Butik Dershane - Kişiye Özel Öğretim - Özel Ders Merkezi
              </p>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <MotionReveal>
              <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Butik Dershane</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b]">
                  Kişiye özel öğretim anlayışıyla Beşiktaş merkezde eğitim
                </h2>
                <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600">
                  {aboutParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ['2013', 'Beşiktaş’ta başlayan eğitim deneyimi'],
                  ['LGS • YKS', 'Grup ve bireysel hazırlık çalışmaları'],
                  ['Butik', 'Kalabalık olmayan sınıflar ve takip sistemi']
                ].map(([value, label]) => (
                  <div key={value} className="rounded-lg border border-[#ff611a]/15 bg-white p-5 shadow-[0_12px_34px_rgba(255,97,26,0.08)]">
                    <strong className="block text-3xl font-semibold text-[#ff611a]">{value}</strong>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ListPanel eyebrow="Vizyonumuz" title="Vizyonumuz" items={visionItems} icon={Eye} />
            <ListPanel eyebrow="Misyonumuz" title="Misyonumuz" items={missionItems} icon={Flag} delay={0.08} />
          </div>

          <MotionReveal delay={0.12}>
            <section className="mt-10 rounded-lg border border-gray-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] md:p-8">
              <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff611a]/10 text-[#ff611a]">
                  <Target className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Hedeflerimiz</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#0b0b0b]">Hedeflerimiz</h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-700">{goalsText}</p>
                </div>
                <Button href="/iletisim" className="w-full lg:w-auto">
                  Ücretsiz Seviye Analizi İçin Başvur
                </Button>
              </div>
            </section>
          </MotionReveal>
        </Container>
      </section>
    </main>
  );
}
