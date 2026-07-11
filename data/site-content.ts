import { BookOpen, ClipboardCheck, GraduationCap, School, Target, UserRound } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export type ServiceItem = {
  title: string;
  description: string;
  outcomes: string[];
  icon: typeof GraduationCap;
  badge: string;
};

export type OutcomeItem = {
  title: string;
  description: string;
};

export type ProgramItem = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  result: string;
};

export const brandInfo = {
  name: 'Fabrika Eğitim Akademi',
  slogan: 'Eğitimin Fabrikası',
  location: 'Beşiktaş / İstanbul',
  shortNote: 'Beşiktaş Merkez • Butik eğitim • Sınırlı kontenjan'
};

export const contactInfo = {
  institution: 'Fabrika Eğitim Akademi',
  phone: '+90 535 689 98 76',
  phoneHref: 'tel:+905356899876',
  whatsappHref: 'https://wa.me/905356899876',
  website: 'https://fabrikaegitim.com',
  email: 'bilgi@fabrikaegitim.com',
  address: 'Sinanpaşa Mah. Ihlamurdere Cad. No:26/A 34357 Beşiktaş / İstanbul',
 mapEmbed:
  'https://maps.google.com/maps?hl=tr&q=41.0429,29.0054&z=18&t=m&output=embed',
mapHref:
  'https://www.google.com/maps/search/?api=1&query=Fabrika%20E%C4%9Fitim%20Akademi%20Ihlamurdere%20Cad.%2026%2FA%20Be%C5%9Fikta%C5%9F',
  hoursNote: 'Çalışma saatleri ve kayıt görüşmesi için lütfen telefon veya WhatsApp üzerinden bilgi alınız.'
};

export const navigation: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Programlar', href: '/programlar' },
  { label: 'Kazananlarımız', href: '/kazananlarimiz' },
  { label: 'Yayınlarımız', href: '/yayinlar' },
  { label: 'İletişim', href: '/iletisim' }
];

export const heroContent = {
  title: brandInfo.name,
  slogan: brandInfo.slogan,
  description:
    'Beşiktaş’ta LGS ve YKS hazırlık sürecini; ders, deneme, koçluk ve birebir takip sistemiyle planlı hale getiren butik eğitim akademisi.',
  primaryCta: { label: 'Ücretsiz Seviye Analizi İçin Başvur', href: '/iletisim' },
  secondaryCta: { label: 'Programları İncele', href: '/programlar' },
  infoLine: brandInfo.shortNote
};

export const services: ServiceItem[] = [
  {
    title: 'Kütüphane',
    description: 'Düzenli çalışma alışkanlığı kazandıran sessiz ve takip edilen çalışma alanı.',
    outcomes: ['Sessiz alan', 'Takip edilen çalışma', 'Düzenli rutin'],
    icon: BookOpen,
    badge: 'Çalışma'
  },
  {
    title: 'Deneme Kulübü',
    description: 'Haftalık denemeler, sonuç analizi ve eksik konu takibiyle ölçülebilir ilerleme.',
    outcomes: ['Haftalık deneme', 'Sonuç analizi', 'Eksik konu takibi'],
    icon: ClipboardCheck,
    badge: 'Ölçme'
  },
  {
    title: 'Özel Ders',
    description: 'Öğrencinin seviyesine ve ihtiyacına göre planlanan birebir ders desteği.',
    outcomes: ['Birebir destek', 'Seviye odaklı plan', 'Konu eksiklerine yoğunlaşma'],
    icon: UserRound,
    badge: 'Birebir'
  },
  {
    title: 'Koçluk',
    description: 'Haftalık hedef, program ve motivasyon takibiyle sürecin kontrol altında tutulması.',
    outcomes: ['Haftalık hedef', 'Program takibi', 'Süreç kontrolü'],
    icon: Target,
    badge: 'Takip'
  },
  {
    title: 'LGS Hazırlık',
    description: '7. ve 8. sınıf öğrencileri için okul başarısı ve sınav odaklı hazırlık modeli.',
    outcomes: ['Kazanım takibi', 'Yeni nesil soru pratiği', 'Veli bilgilendirme'],
    icon: School,
    badge: 'LGS'
  },
  {
    title: 'YKS Hazırlık',
    description: '11, 12 ve mezun öğrenciler için TYT-AYT odaklı planlı hazırlık süreci.',
    outcomes: ['TYT-AYT planı', 'Branş denemeleri', 'Sınav stratejisi'],
    icon: GraduationCap,
    badge: 'YKS'
  }
];

export const outcomeItems: OutcomeItem[] = [
  {
    title: 'Planlı çalışma alışkanlığı',
    description: 'Öğrenci neyi, ne zaman ve nasıl çalışacağını bilir.'
  },
  {
    title: 'Deneme çözme disiplini',
    description: 'Düzenli denemelerle sınav pratiği sürekli hale gelir.'
  },
  {
    title: 'Eksik konu farkındalığı',
    description: 'Deneme ve ödev sonuçlarına göre eksikler görünür hale getirilir.'
  },
  {
    title: 'Birebir takip sistemi',
    description: 'Öğrencinin gelişimi düzenli görüşmelerle takip edilir.'
  },
  {
    title: 'Veli bilgilendirme düzeni',
    description: 'Veli, öğrencinin süreci hakkında düzenli ve anlaşılır şekilde bilgilendirilir.'
  },
  {
    title: 'Sınav stratejisi',
    description: 'Ders bilgisi kadar doğru soru sıralaması ve süre yönetimi de çalışılır.'
  },
  {
    title: 'Zaman yönetimi',
    description: 'Haftalık programlarla öğrencinin zamanı daha verimli kullanması hedeflenir.'
  },
  {
    title: 'Akademik özgüven',
    description: 'Öğrenci gelişimini gördükçe sınava daha kontrollü ve güçlü hazırlanır.'
  }
];

export const programs: ProgramItem[] = [
  {
    id: '7-sinif-programi',
    title: '7. Sınıf Programı',
    shortDescription: 'Okul derslerinde güçlü temel ve LGS yılına düzenli başlangıç.',
    description:
      '7. sınıf programı, öğrencinin okul derslerinde güçlü temel oluşturmasını ve 8. sınıf LGS sürecine hazır başlamasını hedefler.',
    bullets: [
      'Türkçe, matematik, fen bilimleri ve sosyal bilgiler temel kazanım takibi',
      'Okul sınavlarına destek',
      'Düzenli ödevlendirme',
      'Temel soru çözme alışkanlığı',
      'Haftalık çalışma planı',
      'Öğrenciye uygun takip sistemi'
    ],
    result: 'Bu programda amaç, öğrencinin 8. sınıfa eksiksiz ve düzenli çalışma alışkanlığı kazanmış şekilde geçmesidir.'
  },
  {
    id: '8-sinif-lgs-programi',
    title: '8. Sınıf LGS Programı',
    shortDescription: 'LGS kazanımları, deneme analizi ve sınav stratejisi birlikte yürütülür.',
    description:
      '8. sınıf programı, LGS kazanımlarını sistemli şekilde işleyen, düzenli denemelerle ölçen ve eksiklere göre güncellenen yoğun hazırlık sürecidir.',
    bullets: [
      'LGS kazanım odaklı ders programı',
      'Haftalık/periodik deneme uygulamaları',
      'Deneme analizi ve eksik konu takibi',
      'Paragraf, problem ve yeni nesil soru pratiği',
      'Koçluk görüşmeleri',
      'Veli bilgilendirme',
      'Sınav stratejisi ve süre yönetimi'
    ],
    result: 'Öğrencinin sadece konu öğrenmesi değil, LGS formatında doğru stratejiyle ilerlemesi hedeflenir.'
  },
  {
    id: '11-sinif-programi',
    title: '11. Sınıf Programı',
    shortDescription: 'Okul dersleri korunurken TYT temeli erkenden güçlendirilir.',
    description:
      '11. sınıf programı, okul derslerini güçlü tutarken TYT temelini erkenden oturtmayı hedefleyen dengeli bir hazırlık sürecidir.',
    bullets: [
      '11. sınıf okul derslerine destek',
      'TYT temel kazanım çalışmaları',
      'Haftalık çalışma planı',
      'Ders ve ödev takibi',
      'Deneme başlangıç programı',
      'Alan seçimine uygun yönlendirme',
      '12. sınıfa hazırlık altyapısı'
    ],
    result: 'Bu program, öğrencinin YKS yılına geç kalmadan ve güçlü bir temel ile başlamasını sağlar.'
  },
  {
    id: '12-sinif-yks-programi',
    title: '12. Sınıf YKS Programı',
    shortDescription: 'TYT-AYT hazırlığı sınav takvimine uygun planlanır.',
    description:
      '12. sınıf programı, TYT ve AYT hazırlığını sınav takvimine uygun şekilde planlayan, deneme ve analiz odaklı yoğun bir YKS sürecidir.',
    bullets: [
      'TYT-AYT konu planlaması',
      'Düzenli deneme sınavları',
      'Branş denemeleri',
      'Eksik konu analizleri',
      'Haftalık koçluk ve hedef takibi',
      'Soru çözüm saatleri',
      'Sınav stratejisi',
      'Veli bilgilendirme'
    ],
    result: 'Öğrencinin hedef bölümüne göre çalışma planı netleştirilir ve süreç düzenli takip edilir.'
  },
  {
    id: 'mezun-programi',
    title: 'Mezun Programı',
    shortDescription: 'Eksik analizi, yoğun deneme ve kontrollü süreç takibi.',
    description:
      'Mezun programı, YKS’ye yeniden hazırlanan öğrenciler için zamanı verimli kullandıran, eksiklere odaklanan ve disiplinli takip sağlayan özel bir hazırlık modelidir.',
    bullets: [
      'TYT-AYT eksik analizi',
      'Kişiye özel ders ve deneme planı',
      'Yoğun deneme takvimi',
      'Branş bazlı eksik kapatma',
      'Haftalık koçluk görüşmeleri',
      'Motivasyon ve süreç takibi',
      'Tercih hedeflerine göre planlama',
      'Düzenli veli/öğrenci bilgilendirme'
    ],
    result:
      'Mezun öğrencinin önceki yıldan kalan eksiklerini kapatması, deneme performansını artırması ve sınav sürecini kontrollü yönetmesi hedeflenir.'
  }
];

export const aboutContent = {
  intro:
    'Fabrika Eğitim Akademi, Beşiktaş’ta LGS ve YKS hazırlık sürecinde öğrencilere planlı, takip edilen ve kişiye göre şekillendirilen bir eğitim modeli sunar.',
  body:
    'Her öğrencinin öğrenme hızı, hedefi ve eksikleri farklıdır. Bu nedenle Fabrika Eğitim Akademi’de süreç; ders anlatımı, deneme analizi, ödev takibi, koçluk görüşmeleri ve veli bilgilendirmesiyle birlikte yürütülür.',
  approach:
    'Öğrencinin yalnızca derse girmesi değil, sürecinin düzenli takip edilmesi önemlidir. Haftalık planlama, deneme sonuçları ve birebir görüşmelerle öğrencinin gelişimi görünür hale getirilir.',
  reasons: [
    'Butik ve takip edilebilir eğitim modeli',
    'LGS ve YKS odaklı programlar',
    'Deneme analizi ve eksik konu takibi',
    'Koçluk ve birebir yönlendirme',
    'Beşiktaş merkezde kolay ulaşım',
    'Veliyle düzenli iletişim'
  ],
  audience:
    '7. ve 8. sınıfta LGS sürecine hazırlanan öğrenciler; 11, 12 ve mezun gruplarında TYT-AYT hedefi olan öğrenciler; düzenli ders, deneme ve koçluk desteği arayan aileler için uygundur.'
};
