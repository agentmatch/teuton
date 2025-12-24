import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Updates - Luxor Metals',
  description: 'Stay informed with the latest exploration updates, corporate announcements, and industry news from Luxor Metals.',
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}