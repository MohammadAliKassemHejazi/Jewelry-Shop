import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
// Removed QueryClient as we're using Redux for state management
import { ReduxProvider } from "@/store/ReduxProvider"
import { AuthProvider } from "@/contexts/AuthContext"
import { FavoritesProvider } from "@/contexts/FavoritesContext"
import { CartProvider } from "@/contexts/CartContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Samah Shop',
  description: 'E-commerce platform built with Next.js',
}

// Create a client component wrapper for providers that need client-side functionality
function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ReduxProvider>
  )
}

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Toaster />
          <Sonner />
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
