'use client';

import { useEffect } from 'react';

import { PanelErrorState } from '@/components/shared/panel-error-state';

export default function StudentPanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PanelErrorState title="Öğrenci paneli yüklenemedi" onRetry={reset} />;
}

