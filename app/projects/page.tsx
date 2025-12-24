'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ProjectsHero } from '@/components/sections/ProjectsHero'
import { ProjectsMap } from '@/components/sections/ProjectsMap'
import { ProjectsList } from '@/components/sections/ProjectsList'

// Lazy load for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

export default function ProjectsPage() {
  return (
    <div 
      className="min-h-screen pt-24 md:pt-40 pb-8 relative" 
      style={{ 
        backgroundColor: '#073440',
        isolation: 'isolate' 
      }} 
      data-theme="dark"
    >
      {/* Immediate background color layer */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ backgroundColor: '#073440' }}
        aria-hidden="true"
      />
      
      {/* Background map with subtle ocean effect */}
      <BackgroundMap />
      
      {/* Subtle gold dust particles effect */}
      <GoldDustParticles />
      
      <div className="relative z-10">
        <ProjectsHero />
        <ProjectsMap />
        <ProjectsList />
      </div>
    </div>
  )
}