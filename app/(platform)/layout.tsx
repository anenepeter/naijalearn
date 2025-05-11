'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to login if not loading and no user is authenticated
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Optionally show a loading spinner or null while checking auth status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render children only if user is authenticated
  if (user) {
    return <div>{children}</div>;
  }

  // Return null or a loading indicator while redirecting
  return null;
}