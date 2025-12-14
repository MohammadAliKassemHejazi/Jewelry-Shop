"use client";
import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminDashboard from '@/page-components/admin/Dashboard'

export default function AdminDashboardPage() {
  useEffect(() => {
    // Force client-side rendering
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
