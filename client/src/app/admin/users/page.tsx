"use client";
import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminUsers from '@/page-components/admin/Users'

export default function AdminUsersPage() {
  useEffect(() => {
    // Force client-side rendering
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminUsers />
    </ProtectedRoute>
  )
}
