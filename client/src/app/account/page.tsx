"use client";
import ProtectedRoute from '@/components/ProtectedRoute'
import Account from '@/page-components/Account'

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  )
}
