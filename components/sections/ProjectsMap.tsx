'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// You'll need to add your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN'

const projects = [
  {
    id: 1,
    name: 'Tennyson Area',
    coordinates: [-130.0, 56.0], // Stewart, BC area
    minerals: ['Copper', 'Gold', 'Molybdenum'],
    status: 'Advanced Exploration',
  },
  {
    id: 2,
    name: 'Big Gold Area',
    coordinates: [-130.05, 56.05], // Stewart, BC area (slightly offset)
    minerals: ['Gold', 'Silver', 'Copper', 'Lead', 'Zinc'],
    status: 'Discovery',
  },
  {
    id: 3,
    name: '4 J\'s/Catspaw Area',
    coordinates: [-129.95, 56.0], // Stewart, BC area (slightly offset)
    minerals: ['Copper', 'Gold', 'Silver'],
    status: 'Exploration',
  },
  {
    id: 4,
    name: 'Eskay Rift Area',
    coordinates: [-130.0, 55.95], // Stewart, BC area (slightly offset)
    minerals: ['Gold', 'Silver', 'Copper'],
    status: 'Exploration',
  },
]

export function ProjectsMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-130.0, 56.0],
      zoom: 9,
      projection: 'globe' as any,
    })

    map.current.on('load', () => {
      if (!map.current) return

      // Add markers for each project
      projects.forEach((project) => {
        const el = document.createElement('div')
        el.className = 'marker'
        el.style.backgroundColor = project.status === 'Discovery' ? '#facc15' : project.status === 'Advanced Exploration' ? '#10b981' : '#0ea5e9'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)'

        new mapboxgl.Marker(el)
          .setLngLat(project.coordinates as [number, number])
          .addTo(map.current!)

        el.addEventListener('click', () => {
          setSelectedProject(project)
          map.current!.flyTo({
            center: project.coordinates as [number, number],
            zoom: 11,
            duration: 2000,
          })
        })
      })

      // Add atmosphere
      map.current.setFog({
        color: 'rgb(10, 10, 10)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(0, 0, 0)',
        'star-intensity': 0.6,
      } as any)
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient from-primary-400 to-primary-600">
              Global
            </span>{' '}
            <span className="text-white">Presence</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Click on any marker to explore our target areas in the Luxor Project
          </p>
        </motion.div>

        <div className="relative">
          <div
            ref={mapContainer}
            className="h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          />
          
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 glass rounded-xl p-6 max-w-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedProject.name}
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                Status: <span className="text-primary-400">{selectedProject.status}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProject.minerals.map((mineral) => (
                  <span
                    key={mineral}
                    className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                  >
                    {mineral}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center glass rounded-lg p-4">
            <div className="text-3xl font-bold text-primary-400">20,481</div>
            <div className="text-gray-400">Hectares</div>
          </div>
          <div className="text-center glass rounded-lg p-4">
            <div className="text-3xl font-bold text-gold-400">59</div>
            <div className="text-gray-400">Mineral Claims</div>
          </div>
          <div className="text-center glass rounded-lg p-4">
            <div className="text-3xl font-bold text-primary-400">6</div>
            <div className="text-gray-400">Target Areas</div>
          </div>
          <div className="text-center glass rounded-lg p-4">
            <div className="text-3xl font-bold text-gold-400">5</div>
            <div className="text-gray-400">Mineral Types</div>
          </div>
        </div>
      </div>
    </section>
  )
}