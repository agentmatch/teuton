import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Teuton Resources',
  description: 'Get in touch with Teuton Resources. Contact our team for inquiries about exploration projects, investment opportunities, or partnerships.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}