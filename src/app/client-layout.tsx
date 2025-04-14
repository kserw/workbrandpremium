'use client';

import { AuthProvider } from '@/utils/auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
