"use client";
import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminProducts from '@/page-components/admin/Products'

export default function AdminProductsPage() {
  useEffect(() => {
    // Force client-side rendering
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminProducts />
    </ProtectedRoute>
  )
}