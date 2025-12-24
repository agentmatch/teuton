import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Luxor Metals',
  description: 'Learn about Luxor Metals, our history, leadership team, and values. Pioneering mineral exploration in British Columbia\'s Golden Triangle since 2019.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}