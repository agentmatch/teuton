'use client'

import { useEffect } from 'react'

export default function DevCacheHelper() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + R for hard refresh
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        
        // Clear localStorage and sessionStorage
        localStorage.clear()
        sessionStorage.clear()
        
        // Force reload with cache bypass
        window.location.reload()
      }

      // Ctrl/Cmd + Shift + D for dev info
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        console.log('🔧 Dev Cache Helper Active')
        console.log('🔄 Ctrl/Cmd + Shift + R: Hard refresh (clears all browser cache)')
        console.log('📦 Next.js caching disabled in development')
        console.log('⚡ Use npm run dev:fresh to clear server-side cache')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    // Show helper message once on load
    console.log('🔧 Dev Cache Helper loaded - Press Ctrl/Cmd + Shift + D for help')
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // Add timestamp to force component refresh
  useEffect(() => {
    const timestamp = Date.now()
    const meta = document.createElement('meta')
    meta.name = 'dev-timestamp'
    meta.content = timestamp.toString()
    document.head.appendChild(meta)

    return () => {
      const existingMeta = document.querySelector('meta[name="dev-timestamp"]')
      if (existingMeta) {
        existingMeta.remove()
      }
    }
  }, [])

  return null
}