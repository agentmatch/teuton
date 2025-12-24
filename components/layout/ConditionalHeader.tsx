'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { HeaderLanding } from './HeaderLanding'
import { HeaderLight } from './HeaderLight'

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // No header for teaser page (it has its own TeaserHeader in layout)
  if (pathname === '/teaser' || pathname === '/') {
    return null
  }
  
  // Use landing header for landing page
  if (pathname === '/landingpagekappa') {
    return <HeaderLanding />
  }
  
  // Use universal dark header for all other pages (about, projects, investors, news, contact, properties)
  return <Header />
}