'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TopPage() {
  const router = useRouter();
  useEffect(() => {
    const _redirect = async function () {
      let isLoggedIn = false;
      router.push(
        isLoggedIn ? '/parts' : '/login'
      );
    };
    _redirect();
  }, [router]);

  return <></>;
}
