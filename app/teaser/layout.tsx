import TeaserHeader from '@/components/layout/TeaserHeader'

export default function TeaserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TeaserHeader />
      {children}
    </>
  )
}