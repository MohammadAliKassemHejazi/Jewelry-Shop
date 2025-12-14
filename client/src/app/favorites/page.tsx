"use client";
import { useEffect } from 'react';
import Favorites from '@/page-components/Favorites';

export default function FavoritesPage() {
  useEffect(() => {
    // Force client-side rendering
  }, []);

  return <Favorites />;
}
