'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signinCallback } from '@/modules/auth/authService';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const Callback = () => {
  const router = useRouter();

  const callback = async (router: AppRouterInstance) => {
    try {
      const user = await signinCallback();
      console.log('Redirect callback value:', user);
    } catch (e) {
      console.error('Error signing in', e);
    }
    setTimeout(() => {
      router.push('/interview')
    }, 1000)
  }

  useEffect(() => {
    callback(router);
  }, [router]);

  return (
    <p>Loading...</p>
  )
};

export default Callback;