import { Metadata } from 'next'
import { ResourcesHero } from '@/components/sections/ResourcesHero'
import { CommoditiesGrid } from '@/components/sections/CommoditiesGrid'
import { DepositTypes } from '@/components/sections/DepositTypes'
import { ExplorationApproach } from '@/components/sections/ExplorationApproach'

export const metadata: Metadata = {
  title: 'Resources & Commodities - Luxor Metals',
  description: 'Explore our diverse portfolio of mineral resources including gold, silver, copper, lead, zinc, and molybdenum across multiple deposit types.',
}

export default function ResourcesPage() {
  return (
    <>
      <ResourcesHero />
      <CommoditiesGrid />
      <DepositTypes />
      <ExplorationApproach />
    </>
  )
}