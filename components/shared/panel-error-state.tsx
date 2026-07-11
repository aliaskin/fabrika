'use client';

import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

type PanelErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function PanelErrorState({
  title = 'Panel verileri yüklenemedi',
  description = 'Veritabanı bağlantısı geçici olarak kesilmiş olabilir. Neon bağlantısı normale döndüğünde tekrar deneyin.',
  onRetry
}: PanelErrorStateProps) {
  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
        <h1 className="mt-3 text-3xl font-semibold text-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white"
            >
              <RefreshCcw className="h-4 w-4" />
              Tekrar Dene
            </button>
          ) : null}
          <Link href="/admin" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">
            Panele Dön
          </Link>
        </div>
      </div>
    </main>
  );
}

