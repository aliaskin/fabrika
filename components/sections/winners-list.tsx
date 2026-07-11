'use client';

import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, School, Search, Trophy, type LucideIcon } from 'lucide-react';

import { MotionReveal } from '@/components/shared/motion-reveal';
import { staticWinners, type WinnerCategory } from '@/data/winners';
import { cn } from '@/lib/utils';

type ApiWinner = {
  id: string;
  fullName: string;
  university: string;
  department: string;
  year: number;
  rank?: string | null;
  note?: string | null;
  photoUrl?: string | null;
};

type DisplayWinner = {
  id: string;
  fullName: string;
  institution: string;
  department: string;
  category: WinnerCategory;
  year?: number;
  rank?: string | null;
  note?: string | null;
  photoUrl?: string | null;
  source: 'uploaded' | 'static';
};

type WinnersListProps = {
  limit?: number;
  showControls?: boolean;
  compact?: boolean;
};

function normalizeText(value: string) {
  return value.toLocaleLowerCase('tr-TR').trim();
}

function toUploadedWinner(winner: ApiWinner): DisplayWinner {
  return {
    id: `uploaded-${winner.id}`,
    fullName: winner.fullName,
    institution: winner.university,
    department: winner.department,
    category: 'university',
    year: winner.year,
    rank: winner.rank,
    note: winner.note,
    photoUrl: winner.photoUrl,
    source: 'uploaded'
  };
}

function winnerKey(winner: DisplayWinner) {
  return [winner.fullName, winner.institution, winner.department].map(normalizeText).join('|');
}

function splitColumns<T>(items: T[]) {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

function getPreviewWinners(winners: DisplayWinner[], limit: number) {
  const uploaded = winners.filter((winner) => winner.source === 'uploaded');
  const universities = winners.filter((winner) => winner.source === 'static' && winner.category === 'university');
  const highSchools = winners.filter((winner) => winner.source === 'static' && winner.category === 'highSchool');

  const uploadedPart = uploaded.slice(0, Math.min(uploaded.length, Math.max(2, Math.floor(limit * 0.25))));
  const remainingSlots = Math.max(limit - uploadedPart.length, 0);
  const highSchoolSlots = remainingSlots > 4 ? Math.max(2, Math.floor(remainingSlots * 0.25)) : 0;
  const universitySlots = Math.max(remainingSlots - highSchoolSlots, 0);

  const picked = [
    ...uploadedPart,
    ...universities.slice(0, universitySlots),
    ...highSchools.slice(0, highSchoolSlots)
  ];
  const seen = new Set(picked.map((winner) => winner.id));
  const fill = winners.filter((winner) => !seen.has(winner.id));

  return [...picked, ...fill].slice(0, limit);
}

function WinnerRow({
  winner,
  itemNumber,
  compact = false
}: {
  winner: DisplayWinner;
  itemNumber: number;
  compact?: boolean;
}) {
  const isHighSchool = winner.category === 'highSchool';
  const placementLabel = isHighSchool ? 'LGS' : 'YKS';

  return (
    <div className="flex gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0 transition hover:bg-[#fff7f3]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff611a]/10 text-xs font-bold text-[#ff611a]">
        {itemNumber}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="break-words text-sm font-semibold leading-snug text-gray-950 md:text-base">{winner.fullName}</h3>
          <span className="w-fit rounded-full border border-[#ff611a]/20 bg-[#ff611a]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff611a]">
            {placementLabel}
            {winner.year ? ` ${winner.year}` : ''}
          </span>
        </div>
        <p className="mt-2 break-words text-sm font-medium leading-relaxed text-gray-700">{winner.institution}</p>
        {!isHighSchool ? (
          <p className="mt-1 break-words text-xs font-medium uppercase tracking-[0.08em] text-gray-500">{winner.department}</p>
        ) : null}
        {winner.rank || winner.note ? (
          <div className={cn('mt-3 grid gap-2 text-xs leading-relaxed text-gray-600', compact ? '' : 'sm:grid-cols-2')}>
            {winner.rank ? <span className="rounded-lg bg-gray-50 px-3 py-2">Derece: {winner.rank}</span> : null}
            {winner.note ? <span className="rounded-lg bg-gray-50 px-3 py-2">{winner.note}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function WinnerListPanel({
  eyebrow,
  title,
  description,
  winners,
  icon: Icon,
  compact = false,
  delay = 0
}: {
  eyebrow: string;
  title: string;
  description: string;
  winners: DisplayWinner[];
  icon: LucideIcon;
  compact?: boolean;
  delay?: number;
}) {
  const columns = compact ? [winners] : splitColumns(winners);

  return (
    <MotionReveal delay={delay}>
      <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="border-b border-gray-100 bg-gradient-to-r from-black to-[#2b2b2b] p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#ffb18a]">{eyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{description}</p>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff611a] text-white shadow-lg shadow-[#ff611a]/30">
              <Icon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className={cn('grid gap-0', compact ? '' : 'md:grid-cols-2')}>
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={cn(!compact && columnIndex === 0 ? 'border-b border-gray-100 md:border-b-0 md:border-r' : '')}>
              {column.map((winner, index) => {
                const itemNumber = columnIndex === 0 ? index + 1 : index + columns[0].length + 1;
                return <WinnerRow key={winner.id} winner={winner} itemNumber={itemNumber} compact={compact} />;
              })}
            </div>
          ))}
        </div>
      </section>
    </MotionReveal>
  );
}

export function WinnersList({ limit, showControls = true, compact = false }: WinnersListProps) {
  const [uploadedWinners, setUploadedWinners] = useState<DisplayWinner[]>([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | WinnerCategory>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/winners', { cache: 'no-store' });
        const data = (await res.json()) as { winners?: ApiWinner[] };
        if (mounted) setUploadedWinners((data.winners ?? []).map(toUploadedWinner));
      } catch {
        if (mounted) setUploadedWinners([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const allWinners = useMemo(() => {
    const mappedStaticWinners: DisplayWinner[] = staticWinners.map((winner) => ({
      ...winner,
      id: `static-${winner.id}`,
      source: 'static'
    }));
    const seen = new Set(uploadedWinners.map(winnerKey));
    const uniqueStaticWinners = mappedStaticWinners.filter((winner) => !seen.has(winnerKey(winner)));

    return [...uploadedWinners, ...uniqueStaticWinners];
  }, [uploadedWinners]);

  const filteredWinners = useMemo(() => {
    const term = normalizeText(query);
    const filteredByCategory =
      activeCategory === 'all'
        ? allWinners
        : allWinners.filter((winner) => winner.category === activeCategory);

    if (!term) return filteredByCategory;

    return filteredByCategory.filter((winner) =>
      [
        winner.fullName,
        winner.institution,
        winner.department,
        winner.rank ?? '',
        winner.note ?? '',
        winner.year ? String(winner.year) : ''
      ]
        .map(normalizeText)
        .some((value) => value.includes(term))
    );
  }, [activeCategory, allWinners, query]);

  const displayWinners = useMemo(() => {
    if (!limit) return filteredWinners;
    if (!showControls && compact && activeCategory === 'all' && !query.trim()) {
      return getPreviewWinners(filteredWinners, limit);
    }
    return filteredWinners.slice(0, limit);
  }, [activeCategory, compact, filteredWinners, limit, query, showControls]);

  const uploadedSection = displayWinners.filter((winner) => winner.source === 'uploaded');
  const universitySection = displayWinners.filter((winner) => winner.source === 'static' && winner.category === 'university');
  const highSchoolSection = displayWinners.filter((winner) => winner.source === 'static' && winner.category === 'highSchool');
  const previewMode = !showControls && compact;

  if (previewMode) {
    return (
      <WinnerListPanel
        eyebrow="Kazananlarımız"
        title="Kazananlarımızdan Seçmeler"
        description="Önceki başarı listemizden ve panelden eklenen güncel kayıtlardan öne çıkan yerleşimler."
        winners={displayWinners}
        icon={Trophy}
        compact
      />
    );
  }

  return (
    <div className="space-y-8">
      {showControls ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Kazanan Öğrenci Listesi</p>
              <p className="mt-1 text-sm text-gray-600">
                Admin panelinden yüklenen kayıtlar ve önceki başarı listesi birlikte gösterilir.
              </p>
            </div>
            <label className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="İsim, okul veya bölüm ara"
                className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#ff611a] focus:ring-2 focus:ring-[#ff611a]/20"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: 'Tümü', value: 'all' as const },
              { label: 'Üniversite', value: 'university' as const },
              { label: 'Lise', value: 'highSchool' as const }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveCategory(item.value)}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-semibold transition',
                  activeCategory === item.value
                    ? 'border-[#ff611a]/40 bg-[#ff611a]/10 text-[#ff611a]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#ff611a]/40 hover:text-[#ff611a]'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {loading && showControls ? <p className="text-sm text-gray-500">Admin panelinden gelen güncel kayıtlar kontrol ediliyor...</p> : null}

      {!loading && displayWinners.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
          <Trophy className="mx-auto h-8 w-8 text-[#ff611a]" />
          <h2 className="mt-4 text-xl font-semibold text-[#0b0b0b]">Kayıt bulunamadı</h2>
          <p className="mt-2 text-sm text-gray-600">Aramanıza uygun öğrenci kaydı bulunamadı.</p>
        </div>
      ) : null}

      {uploadedSection.length ? (
        <WinnerListPanel
          eyebrow="Güncel Kayıtlar"
          title="Yüklenen Öğrenci Listesi"
          description="Admin panelinden eklenen aktif öğrenci kayıtları bu bölümde korunur."
          winners={uploadedSection}
          icon={Trophy}
        />
      ) : null}

      {universitySection.length ? (
        <WinnerListPanel
          eyebrow="YKS Yerleşimleri"
          title="Üniversite Kazananlarımız"
          description="Üniversiteye yerleşen öğrencilerimizin isim, üniversite ve bölüm listesi."
          winners={universitySection}
          icon={GraduationCap}
          delay={uploadedSection.length ? 0.06 : 0}
        />
      ) : null}

      {highSchoolSection.length ? (
        <WinnerListPanel
          eyebrow="LGS Yerleşimleri"
          title="Lise Kazananlarımız"
          description="LGS hazırlık sürecinden sonra nitelikli liselere yerleşen öğrencilerimiz."
          winners={highSchoolSection}
          icon={School}
          delay={uploadedSection.length || universitySection.length ? 0.08 : 0}
        />
      ) : null}
    </div>
  );
}
