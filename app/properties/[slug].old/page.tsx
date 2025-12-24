import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PropertyHero } from '@/components/sections/PropertyHero'
import { PropertyOverview } from '@/components/sections/PropertyOverview'
import { PropertyGeology } from '@/components/sections/PropertyGeology'
import { PropertyHighlights } from '@/components/sections/PropertyHighlights'
import { PropertyGallery } from '@/components/sections/PropertyGallery'
import { properties } from '@/lib/properties-data'

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = properties.find((p) => p.slug === slug)
  
  if (!property) {
    return {
      title: 'Property Not Found - Luxor Metals',
    }
  }
  
  return {
    title: `${property.name} - Luxor Metals`,
    description: property.description,
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = properties.find((p) => p.slug === slug)
  
  if (!property) {
    notFound()
  }
  
  return (
    <>
      <PropertyHero property={property} />
      <PropertyOverview property={property} />
      <PropertyGeology property={property} />
      <PropertyHighlights property={property} />
      <PropertyGallery property={property} />
    </>
  )
}