"use client";
import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminOrders from '@/page-components/admin/Orders'

export default function AdminOrdersPage() {
  useEffect(() => {
    // Force client-side rendering
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminOrders />
    </ProtectedRoute>
  )
}