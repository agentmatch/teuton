'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface RedLineModalPortalProps {
  children: React.ReactNode
}

export default function RedLineModalPortal({ children }: RedLineModalPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    children,
    document.body
  )
}