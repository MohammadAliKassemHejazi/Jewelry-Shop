"use client";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const NotFound = dynamic(() => import('@/page-components/NotFound'), { ssr: false });

export default function NotFoundPage() {
  useEffect(() => {
    // Force client-side rendering
  }, []);

  return <NotFound />
}
