import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/mobile-optimizations.css'
import '@/styles/mobile-nav-fix.css'
import '@/styles/force-mobile-nav.css'
import '@/styles/safari-mobile-nav-fix.css'
import '@/styles/mobile-navigation-fix.css'
import '@/styles/mobile-fixes.css'
import '@/styles/mobile-viewport-fix.css'
import { ConditionalHeader } from '@/components/layout/ConditionalHeader'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Teuton Resources - Mineral Exploration',
  description: 'Teuton Resources is a premier mineral exploration company focused on discovering and developing high-quality mineral resources in British Columbia.',
  keywords: 'mineral exploration, mining, gold, copper, silver, resources, commodities, TSX-V, TUO',
  authors: [{ name: 'Teuton Resources' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Teuton Resources - Mineral Exploration',
    description: 'Discover our innovative approach to mineral exploration and sustainable resource development.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Teuton Resources',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Teuton Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teuton Resources',
    description: 'Leading mineral exploration company',
    images: ['/og-image.png'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // For iPhone notch
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="grain-overlay" />
        
        <div className="flex min-h-screen flex-col">
          <ConditionalHeader />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}