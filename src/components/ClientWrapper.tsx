'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const ClientLayout = dynamic(() => import('@/app/client-layout'), {
  ssr: false,
});

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
} 