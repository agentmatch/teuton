'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiCalendar, FiTag, FiArrowRight, FiClock, FiSearch, FiFilter } from 'react-icons/fi'

// Import components directly since this is a client component
import GoldDustParticles from '@/components/effects/GoldDustParticles'

// RAM Design Color Palette
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach
  yellow: '#fed992'     // Soft yellow
}

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  dateString: string
  category: 'Exploration & Property Updates' | 'Corporate & Financial'
  readTime?: string
  tags: string[]
  slug: string
}

const categoryColors = {
  'Exploration & Property Updates': '#4ADE80',
  'Corporate & Financial': '#60A5FA'
}

// Function to strip HTML tags and clean content
function stripHtml(html: string): string {
  // First, remove the "paragraph -->" and "list -->" prefixes that appear in the data
  let text = html
    .replace(/^(paragraph|list|wp)\s*-->\s*/i, '')
    .replace(/^(<!--\s*)?paragraph\s*-->\s*/i, '')
    .replace(/^(<!--\s*)?list\s*-->\s*/i, '')
  
  // Remove all WordPress block comments and their content markers
  text = text
    .replace(/<!--\s*wp:paragraph\s*-->/gi, '')
    .replace(/<!--\s*\/wp:paragraph\s*-->/gi, '')
    .replace(/<!--\s*wp:list\s*-->/gi, '')
    .replace(/<!--\s*\/wp:list\s*-->/gi, '')
    .replace(/<!--\s*wp:list-item\s*-->/gi, '')
    .replace(/<!--\s*\/wp:list-item\s*-->/gi, '')
    .replace(/<!--\s*wp:[^>]*\s*-->/gi, '')
    .replace(/<!--\s*\/wp:[^>]*\s*-->/gi, '')
    .replace(/<!--[^>]*-->/g, '') // Remove any remaining HTML comments
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities (more comprehensive list)
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&trade;/g, '™')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&deg;/g, '°')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#160;/g, ' ')
  
  // Clean up extra whitespace and trim
  text = text.replace(/\s+/g, ' ').trim()
  
  // Remove any leading special characters or weird formatting including arrows
  text = text.replace(/^[\s\-–—>]+/, '')
  
  // Remove any remaining "-->", "<!--" patterns
  text = text.replace(/-->/g, '').replace(/<!--/g, '')
  
  return text
}

// Function to extract clean content from news releases
function extractCleanContent(content: string): string {
  // Remove WordPress comments and artifacts
  let cleanContent = content
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/<!-- wp:[\s\S]*? -->/g, '') // Remove WordPress block comments
    .replace(/<!-- \/wp:[\s\S]*? -->/g, '') // Remove WordPress closing block comments
  
  // Convert to text and remove HTML
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null
  if (tempDiv) {
    tempDiv.innerHTML = cleanContent
    cleanContent = tempDiv.textContent || tempDiv.innerText || ''
  } else {
    // Fallback for SSR
    cleanContent = cleanContent.replace(/<[^>]*>/g, '')
  }
  
  // Remove date/location patterns from the beginning
  cleanContent = cleanContent
    .replace(/^[A-Z][a-z]+\s+\d{1,2},?\s+\d{4}.*?[-–—]\s*/i, '') // Remove "October 2, 2023 - "
    .replace(/^[A-Z][a-z]+,?\s+[A-Z][a-z]+.*?[-–—]\s*/i, '') // Remove "Victoria, Canada - "
    .replace(/^[A-Z][a-z]+,?\s+[A-Z]\.?[A-Z]\.?.*?[-–—]\s*/i, '') // Remove "Vancouver, B.C. - "
    .replace(/^\*\*[^*]+\*\*\s*/g, '') // Remove bold markers
    .replace(/^(Silver Grail Resources Ltd\.?.*?announces?|Silver Grail.*?is pleased to announce)\s+/i, '') // Skip boilerplate intros
  
  // Clean up whitespace and entities
  cleanContent = cleanContent
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  
  // Get the actual meaningful content (skip company boilerplate)
  const sentences = cleanContent.split(/(?<=[.!?])\s+/)
  const meaningfulSentences = sentences.filter(sentence => {
    // Filter out common boilerplate patterns
    return !sentence.match(/^(Silver Grail Resources|SVG-TSX|TSX-V:|the Company)/i) &&
           !sentence.match(/^(For further information|Contact:|Email:|Tel\.?:|Phone:)/i) &&
           sentence.length > 30 // Skip very short sentences
  })
  
  // Return first 2-3 meaningful sentences
  return meaningfulSentences.slice(0, 3).join(' ')
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [hoveredNews, setHoveredNews] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchNews()
  }, [page, selectedCategory, searchTerm, selectedTag])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)
      if (selectedTag) params.append('tag', selectedTag)
      
      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()
      
      setNews(data.news || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Exploration & Property Updates',
    'Corporate & Financial'
  ]

  const allTags = Array.from(new Set(news.flatMap(item => item.tags)))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div 
      className="min-h-screen pt-20 md:pt-32 pb-8 relative" 
      style={{ 
        backgroundColor: palette.dark,
        isolation: 'isolate' 
      }} 
      data-theme="dark"
    >
      {/* Mountain Background Image */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/rambackground.png"
          alt="Mountain landscape"
          fill
          priority
          quality={90}
          className="object-cover"
          style={{ 
            filter: 'brightness(0.4) contrast(1.1)',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Animated aurora gradient overlay - 2024/2025 trend */}
      <div className="fixed inset-0 z-[1] overflow-hidden" aria-hidden="true"
           style={{ 
             willChange: 'transform',
             transform: 'translateZ(0)'
           }}>
        {/* Layer 1: Base gradient - balanced for star visibility */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(180deg, 
            rgba(3, 23, 48, 0.9) 0%, 
            rgba(3, 23, 48, 0.8) 15%,
            rgba(0, 106, 148, 0.3) 50%, 
            rgba(3, 23, 48, 0.7) 100%)`,
          willChange: 'transform',
          transform: 'translateZ(0)'
        }} />
        
        {/* Layer 2: Static gradient mesh */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            background: `radial-gradient(circle at 20% 50%, rgba(0, 106, 148, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, rgba(3, 23, 48, 0.6) 0%, transparent 50%),
                        radial-gradient(circle at 50% 30%, rgba(0, 106, 148, 0.3) 0%, transparent 40%)`,
            filter: 'blur(40px)',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} 
        />
        
        {/* Layer 3: Static glow */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{ 
            background: `radial-gradient(ellipse at top, rgba(0, 106, 148, 0.3) 0%, transparent 60%)`,
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} 
        />
      </div>
      
      {/* Subtle gold dust particles effect */}
      <GoldDustParticles />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Page Header with Kinetic Typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="animated-gradient-text mb-4 md:mb-6 block"
              style={{ 
                fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif", 
                fontWeight: 500,
                fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : 'clamp(3rem, 4vw, 4rem)',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 8s ease infinite'
              }}>
              News & Updates
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto overflow-hidden px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 400 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 8s ease infinite',
                opacity: 0.9
              }}
            >
              Stay informed with the latest developments from Silver Grail Resources
            </motion.p>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(12, 14, 29, 0.6)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className={`${isMobile ? 'space-y-4' : 'flex items-center justify-between gap-6'}`}>
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#E5E5E5]/50 focus:outline-none focus:ring-2 focus:ring-[#E5E5E5]/20 transition-all"
                  style={{ fontFamily: "Aeonik, sans-serif" }}
                />
              </div>
              
              {/* Filters */}
              <div className={`flex items-center gap-2 ${isMobile ? 'overflow-x-auto pb-2' : 'flex-wrap'}`}>
                <FiFilter className="text-white/60 w-5 h-5 flex-shrink-0" />
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap`}
                  style={{
                    fontFamily: "Aeonik Extended, sans-serif",
                    background: !selectedCategory 
                      ? `linear-gradient(135deg, ${palette.peach}CC 0%, ${palette.yellow}CC 100%)`
                      : 'rgba(12, 14, 29, 0.5)',
                    color: !selectedCategory ? palette.dark : 'rgba(255, 255, 255, 0.7)',
                    border: !selectedCategory ? `1px solid ${palette.peach}66` : '1px solid rgba(12, 14, 29, 0.3)'
                  }}
                >
                  All News
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap`}
                    style={{
                      fontFamily: "Aeonik Extended, sans-serif",
                      background: selectedCategory === category 
                        ? `linear-gradient(135deg, ${palette.peach}CC 0%, ${palette.yellow}CC 100%)`
                        : 'rgba(12, 14, 29, 0.5)',
                      color: selectedCategory === category ? palette.dark : 'rgba(255, 255, 255, 0.7)',
                      border: selectedCategory === category ? `1px solid ${palette.peach}66` : '1px solid rgba(12, 14, 29, 0.3)'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tags Section */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-8 flex flex-wrap gap-2 justify-center"
          >
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  selectedTag === tag
                    ? 'bg-[#E5E5E5]/20 text-[#E5E5E5]'
                    : 'bg-black/20 text-white/60 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* News Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 rounded-2xl p-5 md:p-6 border"
                       style={{
                         background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                         backdropFilter: 'blur(20px) saturate(150%)',
                         WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                         borderColor: 'rgba(12, 14, 29, 0.6)',
                         boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                       }}></div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 rounded-2xl p-5 md:p-6 border"
                 style={{
                   background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                   backdropFilter: 'blur(20px) saturate(150%)',
                   WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                   borderColor: 'rgba(12, 14, 29, 0.6)',
                   boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                 }}>
              <p className="text-white/60 text-lg">No news items found matching your search.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {news.map((item, index) => (
                  <motion.article
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredNews(item.id)}
                    onMouseLeave={() => setHoveredNews(null)}
                    className="group"
                    style={{ 
                      willChange: 'opacity, transform',
                      transform: 'translateZ(0)'
                    }}
                  >
                    <Link href={`/news/${item.slug}`}>
                      <div className="relative h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col"
                           style={{
                             background: `linear-gradient(135deg, 
                               rgba(255, 190, 152, 0.9) 0%, 
                               rgba(255, 190, 152, 0.8) 30%,
                               rgba(254, 217, 146, 0.7) 70%,
                               rgba(255, 190, 152, 0.85) 100%)`,
                             backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                             WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                             border: '1px solid rgba(255, 255, 255, 0.3)',
                             boxShadow: `
                               0 12px 48px 0 rgba(31, 38, 135, 0.2),
                               0 8px 24px 0 rgba(255, 190, 152, 0.4),
                               inset 0 3px 6px 0 rgba(255, 255, 255, 0.4),
                               inset 0 -2px 4px 0 rgba(0, 0, 0, 0.15)
                             `,
                             borderRadius: '16px',
                             minHeight: '480px',
                             position: 'relative',
                             overflow: 'hidden'
                           }}>
                        
                        {/* Glass reflection overlay */}
                        <div 
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            background: `linear-gradient(105deg, 
                              transparent 40%, 
                              rgba(255, 255, 255, 0.2) 45%, 
                              rgba(255, 255, 255, 0.1) 50%, 
                              transparent 55%)`,
                            transform: hoveredNews === item.id ? 'translateX(100%)' : 'translateX(-100%)',
                            transition: 'transform 0.8s ease-out'
                          }}
                        />
                        
                        <div className="relative w-full px-6 pt-8 pb-6 text-center">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full" 
                               style={{ background: `linear-gradient(135deg, ${palette.peach}60, ${palette.yellow}40)` }} />
                          
                          {/* Category Badge */}
                          <div className="mb-4">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium inline-block"
                              style={{ 
                                backgroundColor: `${palette.dark}15`,
                                color: palette.dark,
                                border: `1px solid ${palette.dark}30`
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                          
                          <motion.h3 
                              className="mb-4 transform transition-all duration-300 relative line-clamp-2"
                              whileHover={{ 
                                scale: 1.02,
                                textShadow: "0 5px 15px rgba(0,0,0,0.3)"
                              }}
                              style={{ 
                                fontFamily: "'Aeonik Extended', sans-serif", 
                                fontWeight: 600,
                                fontSize: isMobile ? 'clamp(1.1rem, 3vw, 1.3rem)' : '1.35rem',
                                letterSpacing: '0.02em',
                                lineHeight: '1.3',
                                color: palette.dark,
                                minHeight: '3.5rem',
                                fontVariationSettings: hoveredNews === item.id ? '"wght" 700' : '"wght" 600',
                                transition: 'font-variation-settings 0.3s ease',
                              }}>
                            {item.title}
                          </motion.h3>
                          
                          {/* Date */}
                          <div className="flex items-center justify-center gap-2 text-sm mb-4" style={{ color: `${palette.dark}80` }}>
                            <FiCalendar className="w-4 h-4" />
                            <time dateTime={item.date} style={{ fontFamily: "Aeonik, sans-serif" }}>{item.dateString}</time>
                          </div>
                          
                          <div className="mt-4 mb-4 h-[1px] w-full" style={{ background: `linear-gradient(to right, transparent, ${palette.dark}30, transparent)` }} />
                        </div>

                        <div className="flex-grow px-6 pb-6 flex flex-col">
                          <div className="flex-grow flex items-start">
                            <motion.div 
                              className="relative overflow-hidden w-full"
                              initial={{ opacity: 0.85 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              style={{ 
                                color: palette.dark, 
                                fontFamily: "Aeonik, sans-serif", 
                                lineHeight: '1.5',
                                fontSize: '0.95rem',
                              }}>
                              <p className="line-clamp-4">{extractCleanContent(item.content)}</p>
                            </motion.div>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-4 min-h-[32px]">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                style={{
                                  backgroundColor: `${palette.dark}10`,
                                  color: `${palette.dark}80`
                                }}
                              >
                                <FiTag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-xs" style={{ color: `${palette.dark}60` }}>+{item.tags.length - 3}</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto" style={{ borderTop: `1px solid ${palette.dark}20` }}>
                          <button className="w-full py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300" 
                                  style={{ 
                                    color: palette.yellow,
                                    background: palette.dark
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.textShadow = '0 0 20px rgba(254, 217, 146, 0.8), 0 0 40px rgba(254, 217, 146, 0.4)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.textShadow = 'none'
                                  }}>
                            <span style={{ 
                              fontFamily: "Aeonik Extended, sans-serif", 
                              fontWeight: 400,
                              fontSize: '0.875rem',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase'
                            }}>
                              Read Release
                            </span>
                            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" 
                                 fill="none" 
                                 stroke="currentColor" 
                                 viewBox="0 0 24 24">
                              <path strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-4 mt-12"
          >
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-6 py-3 rounded-lg disabled:opacity-50 transition-all"
              style={{
                fontFamily: "Aeonik Extended, sans-serif",
                background: `linear-gradient(135deg, ${palette.peach}CC 0%, ${palette.yellow}CC 100%)`,
                color: palette.dark,
                border: `1px solid ${palette.peach}66`
              }}
            >
              Previous
            </button>
            <span className="px-4 py-3 text-white flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-lg disabled:opacity-50 transition-all"
              style={{
                fontFamily: "Aeonik Extended, sans-serif",
                background: `linear-gradient(135deg, ${palette.peach}CC 0%, ${palette.yellow}CC 100%)`,
                color: palette.dark,
                border: `1px solid ${palette.peach}66`
              }}
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
    </div>
  )
}