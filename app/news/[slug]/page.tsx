'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FiCalendar, FiClock, FiArrowLeft, FiTag, FiShare2, FiTwitter, FiLinkedin, FiMail, FiLink } from 'react-icons/fi'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

// Color palette
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
  date: string
  slug: string
  category: string
  excerpt: string
  content: string
  tags?: string[]
}

interface ParamsType {
  slug: string
}

const categoryColors = {
  'Exploration & Property Updates': '#4ADE80',
  'Corporate & Financial': '#60A5FA'
}

// Comprehensive clean content function with all formatting fixes
function cleanContent(content: string): string {
  let fixedContent = content
  
  // Step 1: Remove the initial bullet point list that appears at the top (these become subheadings)
  const initialListMatch = fixedContent.match(/^<!-- wp:list -->[\s\S]*?<!-- \/wp:list -->/)
  if (initialListMatch) {
    fixedContent = fixedContent.replace(initialListMatch[0], '').trim()
  }
  
  // Step 2: Remove all WordPress comments and blocks
  fixedContent = fixedContent
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '')
  
  // Step 3: Handle various date/location formats
  // Format 1: <b><i>Date--Location</i></b>
  fixedContent = fixedContent.replace(
    /<b><i>([^<]*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})[^<]*--([^<]+)<\/i><\/b>/gi,
    function(match, dateStr, location) {
      // Return with location marker, removing the date
      return '<p>📍LOCATION:' + location.trim() + '|||</p>'
    }
  )
  
  // Format 2: Standard paragraph with location and date
  fixedContent = fixedContent.replace(
    /<p>(?:<strong>)?([^<]*?)(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}[^<]*?(?:<\/strong>)?([^<]*?)<\/p>/gi,
    function(match, beforeDate, afterParagraph) {
      // Extract location part (before the month)
      const locationMatch = beforeDate.match(/([^,]+(?:,\s*[^,]+)?)[,\s]*$/i)
      if (locationMatch) {
        let location = locationMatch[1].trim()
        // Clean up the location
        location = location.replace(/<\/?[^>]+>/g, '').replace(/[,:\s]+$/, '').trim()
        
        // Get content after the date
        const fullText = match
        const afterDateMatch = fullText.match(/\d{4}[^<]*?(?:–+|—|:)?\s*([^<]+(?:<\/[^>]+>)?)/)
        let restOfContent = afterDateMatch ? afterDateMatch[1] : afterParagraph
        
        // Clean up the rest of content
        restOfContent = restOfContent
          .replace(/<\/?[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/^[\s.,:–—]+/, '')
          .trim()
        
        // Return with location marker
        if (location && location.length > 2) {
          return '<p>📍LOCATION:' + location + '|||' + restOfContent + '</p>'
        }
      }
      // If no location found, just remove the date part
      return '<p>' + match.replace(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}[^<]*?(?:–+|—|:)?\s*/gi, '').replace(/<\/?strong>/g, '') + '</p>'
    }
  )
  
  // Format 3: Plain text date at beginning (from CSV)
  fixedContent = fixedContent.replace(
    /^([^<]*)(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}[;:\s]*/gim,
    function(match, beforeDate) {
      const locationMatch = beforeDate.match(/([^,]+(?:,\s*[^,]+)?)[,\s]*$/i)
      if (locationMatch) {
        let location = locationMatch[1].trim()
        if (location && location.length > 2) {
          return '📍LOCATION:' + location + '|||'
        }
      }
      return ''
    }
  )
  
  // Step 4: Handle links - remove duplicates and make them functional
  const linkMap = new Map<string, string>()
  
  // Process links and remove duplicates
  fixedContent = fixedContent.replace(
    /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi,
    function(match, href, text) {
      // Clean up the href
      let cleanHref = href.trim()
      
      // Skip empty or malformed links
      if (!cleanHref || cleanHref === '#') {
        return text
      }
      
      // Handle mailto links
      if (cleanHref.startsWith('mailto:')) {
        const email = cleanHref.replace('mailto:', '')
        if (!linkMap.has(email)) {
          linkMap.set(email, text)
          return `[LINK:EMAIL:${email}|||${text}]`
        }
        return text // Keep text for duplicate
      }
      
      // Handle regular URLs
      if (!cleanHref.startsWith('http')) {
        cleanHref = 'https://' + cleanHref.replace(/^\/\//, '')
      }
      if (!linkMap.has(cleanHref)) {
        linkMap.set(cleanHref, text)
        return `[LINK:URL:${cleanHref}|||${text}]`
      }
      return text // Keep text for duplicate
    }
  )
  
  // Step 5: Clean up HTML tags and entities
  fixedContent = fixedContent
    // Handle section headers
    .replace(/<p>\s*<strong>\s*(Key Highlights|Highlights|Discovery Details|Market Context|Exploration Timeline|Strategic Approach|Next Steps|Comment|About Silver Grail|About Teuton|About Luxor|QA\/QC|Qualified Person|URLs For Maps|Forward[- ]Looking Statements?|Respectfully)\s*<\/strong>\s*<\/p>/gi, '\n\n[SECTION:$1]\n')
    
    // Handle cautionary statements specially (italicized and smaller)
    .replace(/<p>\s*<strong>\s*(Cautionary Statements?[^<]*)\s*<\/strong>\s*<\/p>/gi, '\n\n[CAUTIONARY:$1]\n')
    .replace(/<p>\s*<strong>\s*<em>\s*([^<]+)\s*<\/em>\s*<\/strong>\s*<\/p>/gi, '\n\n[SUBSECTION:$1]\n')
    
    // Remove inline styles and spans
    .replace(/<span[^>]*>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/style="[^"]*"/g, '')
    
    // Remove all formatting tags
    .replace(/<\/?b>/g, '')
    .replace(/<\/?i>/g, '')
    .replace(/<\/?strong>/g, '')
    .replace(/<\/?em>/g, '')
    .replace(/<\/?u>/g, '')
    
    // Handle paragraphs
    .replace(/<p>/g, '\n\n')
    .replace(/<\/p>/g, '')
    
    // Handle lists
    .replace(/<ul[^>]*>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/<li>/g, '\n• ')
    .replace(/<\/li>/g, '')
    
    // Handle line breaks
    .replace(/<br\s*\/?>/g, '\n')
    
    // Clean HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    
    // Clean up extra whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .trim()
  
  return fixedContent
}

// Extract subheadings from the beginning of content (bullet points at top)
function extractSubheadings(content: string): string[] {
  const subheadings: string[] = []
  
  // Look for the initial list items that appear before the main content
  const initialListMatch = content.match(/^<!-- wp:list -->[\s\S]*?<!-- \/wp:list -->/)
  if (initialListMatch) {
    const listContent = initialListMatch[0]
    const items = listContent.match(/<li>(?:<strong>)?([^<]+)(?:<\/strong>)?<\/li>/g)
    if (items) {
      items.forEach(item => {
        const text = item.replace(/<\/?li>/g, '').replace(/<\/?strong>/g, '').trim()
        if (text.length > 10 && text.length < 200) {
          subheadings.push(text)
        }
      })
    }
  }
  
  return subheadings.slice(0, 3) // Return max 3 subheadings
}

// Format content with proper React components
function formatContentComponents(content: string) {
  const cleanedContent = cleanContent(content)
  const components: React.ReactElement[] = []
  let key = 0
  let inCautionarySection = false
  
  // Split by paragraphs and process each
  const paragraphs = cleanedContent.split('\n\n')
  
  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim()
    if (!trimmed) return
    
    // Handle location paragraph
    if (trimmed.includes('📍LOCATION:')) {
      const parts = trimmed.replace('📍LOCATION:', '').split('|||')
      const location = parts[0].trim()
      const restOfContent = parts[1] ? parts[1].trim() : ''
      
      components.push(
        <p key={key++} 
           className="leading-relaxed mb-4" 
           style={{ 
             fontFamily: "Aeonik, sans-serif", 
             color: `${palette.dark}CC`,
             fontSize: '1rem' // Ensure normal font size
           }}>
          <strong style={{ color: palette.dark }}>{location}</strong> — {restOfContent}
        </p>
      )
      return
    }
    
    // Handle section headers
    if (trimmed.startsWith('[SECTION:')) {
      inCautionarySection = false // Reset cautionary flag for regular sections
      const sectionTitle = trimmed.replace('[SECTION:', '').replace(']', '').trim()
      components.push(
        <h3 key={key++} 
            className="text-xl font-semibold mb-4 mt-8 pb-2 border-b"
            style={{ 
              fontFamily: "Aeonik Extended, sans-serif", 
              color: palette.dark,
              borderColor: `${palette.dark}20`
            }}>
          {sectionTitle}
        </h3>
      )
      return
    }
    
    // Handle cautionary statements (italicized and smaller)
    if (trimmed.startsWith('[CAUTIONARY:')) {
      inCautionarySection = true // Set flag for subsequent paragraphs
      const cautionaryTitle = trimmed.replace('[CAUTIONARY:', '').replace(']', '').trim()
      components.push(
        <h4 key={key++} 
            className="text-sm font-normal mb-3 mt-8 italic"
            style={{ 
              fontFamily: "Aeonik, sans-serif", 
              color: `${palette.dark}80`,
              fontSize: '0.9rem'
            }}>
          {cautionaryTitle}
        </h4>
      )
      return
    }
    
    // Handle subsection headers
    if (trimmed.startsWith('[SUBSECTION:')) {
      const subsectionTitle = trimmed.replace('[SUBSECTION:', '').replace(']', '').trim()
      components.push(
        <h4 key={key++} 
            className="text-lg font-semibold mb-3 mt-6"
            style={{ 
              fontFamily: "Aeonik Extended, sans-serif", 
              color: palette.dark
            }}>
          {subsectionTitle}
        </h4>
      )
      return
    }
    
    // Handle bullet points
    if (trimmed.startsWith('•')) {
      const listItems = trimmed.split('\n').filter(item => item.trim().startsWith('•'))
      components.push(
        <ul key={key++} className="mb-4 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} 
                className="leading-relaxed ml-4" 
                style={{ 
                  fontFamily: "Aeonik, sans-serif", 
                  color: `${palette.dark}CC`,
                  fontSize: '1rem'
                }}>
              {item.replace(/^•\s*/, '')}
            </li>
          ))}
        </ul>
      )
      return
    }
    
    // Handle links in paragraphs
    let processedParagraph = trimmed
    const linkElements: React.ReactElement[] = []
    
    // Process email links
    processedParagraph = processedParagraph.replace(
      /\[LINK:EMAIL:([^|]+)\|\|\|([^\]]+)\]/g,
      (match, email, text) => {
        const placeholder = `__LINK_${linkElements.length}__`
        linkElements.push(
          <a key={`link-${key}-${linkElements.length}`}
             href={`mailto:${email}`}
             className="text-blue-600 hover:text-blue-800 underline"
             style={{ color: palette.blue }}>
            {text}
          </a>
        )
        return placeholder
      }
    )
    
    // Process URL links
    processedParagraph = processedParagraph.replace(
      /\[LINK:URL:([^|]+)\|\|\|([^\]]+)\]/g,
      (match, url, text) => {
        const placeholder = `__LINK_${linkElements.length}__`
        linkElements.push(
          <a key={`link-${key}-${linkElements.length}`}
             href={url}
             target="_blank"
             rel="noopener noreferrer"
             className="text-blue-600 hover:text-blue-800 underline"
             style={{ color: palette.blue }}>
            {text}
          </a>
        )
        return placeholder
      }
    )
    
    // If paragraph contains links, render with them
    if (linkElements.length > 0) {
      const parts = processedParagraph.split(/__LINK_\d+__/)
      const elements: (string | React.ReactElement)[] = []
      
      parts.forEach((part, idx) => {
        if (part) elements.push(part)
        if (idx < linkElements.length) {
          elements.push(linkElements[idx])
        }
      })
      
      components.push(
        <p key={key++} 
           className={`leading-relaxed mb-4 ${inCautionarySection ? 'italic' : ''}`}
           style={{ 
             fontFamily: "Aeonik, sans-serif", 
             color: inCautionarySection ? `${palette.dark}70` : `${palette.dark}CC`,
             fontSize: inCautionarySection ? '0.85rem' : '1rem'
           }}>
          {elements}
        </p>
      )
    } else {
      // Regular paragraph
      components.push(
        <p key={key++} 
           className={`leading-relaxed mb-4 ${inCautionarySection ? 'italic' : ''}`}
           style={{ 
             fontFamily: "Aeonik, sans-serif", 
             color: inCautionarySection ? `${palette.dark}70` : `${palette.dark}CC`,
             fontSize: inCautionarySection ? '0.85rem' : '1rem'
           }}>
          {processedParagraph}
        </p>
      )
    }
  })
  
  return components
}

// Simple function for read time estimation
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
}

export default function NewsArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (slug) {
      fetchArticle(slug)
    }
  }, [slug])

  const fetchArticle = async (articleSlug: string) => {
    try {
      const response = await fetch(`/api/news?slug=${articleSlug}`)
      const data = await response.json()
      
      if (data.news && data.news.length > 0) {
        setArticle(data.news[0])
      } else {
        setError('Article not found')
      }
    } catch (err) {
      console.error('Error fetching article:', err)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (platform: string) => {
    if (!article) return
    
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `${article.title} - Silver Grail Resources`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        // Could add a toast notification here
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">{error || 'Article not found'}</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-800">
            ← Back to News
          </Link>
        </div>
      </div>
    )
  }

  const readTime = Math.ceil(stripHtml(article.content).split(' ').length / 200)
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Extract subheadings for display
  const subheadings = extractSubheadings(article.content)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background with Aurora Effect */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/rambackground.png"
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        
        {/* Aurora gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(180deg, 
              rgba(3, 23, 48, 0.9) 0%, 
              rgba(3, 23, 48, 0.75) 15%,
              rgba(0, 106, 148, 0.4) 50%, 
              rgba(3, 23, 48, 0.8) 100%)`
          }} />
        </div>
      </div>
      
      <GoldDustParticles />
      
      <div className="container mx-auto px-4 py-24 md:py-32 max-w-4xl relative z-10">
        {/* Back to News Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            style={{ fontFamily: "Aeonik Extended, sans-serif" }}
          >
            <FiArrowLeft />
            Back to News
          </Link>
        </motion.div>

        {/* Article Content Card - Peachy gradient background */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 190, 152, 0.95) 0%, 
              rgba(255, 190, 152, 0.9) 30%,
              rgba(254, 217, 146, 0.85) 70%,
              rgba(255, 190, 152, 0.92) 100%)`,
            backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            padding: isMobile ? '1.5rem' : '2.5rem'
          }}
        >
          {/* Article Header */}
          <header className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl md:text-4xl font-bold mb-4"
              style={{ 
                fontFamily: "Aeonik Extended, sans-serif",
                fontWeight: 600,
                color: palette.dark,
                lineHeight: '1.2'
              }}
            >
              {article.title}
            </motion.h1>
            
            {/* Subheadings */}
            {subheadings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 pl-4 border-l-4"
                style={{ borderColor: palette.dark + '30' }}
              >
                {subheadings.map((subheading, index) => (
                  <p key={index} 
                     className="mb-2 last:mb-0"
                     style={{ 
                       fontFamily: "Aeonik, sans-serif",
                       color: `${palette.dark}B0`,
                       fontSize: '0.95rem',
                       fontStyle: 'italic'
                     }}>
                    {subheading}
                  </p>
                ))}
              </motion.div>
            )}
            
            {/* Meta Information */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 text-sm"
              style={{ color: `${palette.dark}99` }}
            >
              <div className="flex items-center gap-2">
                <FiCalendar />
                <time>{formattedDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <FiClock />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTag />
                <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: categoryColors[article.category as keyof typeof categoryColors] + '20',
                        color: palette.dark
                      }}>
                  {article.category}
                </span>
              </div>
            </motion.div>
          </header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none"
            style={{ fontFamily: "Aeonik, sans-serif" }}
          >
            {formatContentComponents(article.content)}
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 pt-8 border-t"
            style={{ borderColor: `${palette.dark}20` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm font-medium"
                 style={{ color: palette.dark }}>
                Share this article:
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: `${palette.dark}10`,
                    color: palette.dark
                  }}
                  aria-label="Share on Twitter"
                >
                  <FiTwitter size={18} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 rounded-full transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: `${palette.dark}10`,
                    color: palette.dark
                  }}
                  aria-label="Share on LinkedIn"
                >
                  <FiLinkedin size={18} />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="p-2 rounded-full transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: `${palette.dark}10`,
                    color: palette.dark
                  }}
                  aria-label="Share via Email"
                >
                  <FiMail size={18} />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded-full transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: `${palette.dark}10`,
                    color: palette.dark
                  }}
                  aria-label="Copy Link"
                >
                  <FiLink size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.article>

        {/* Back to News Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255, 190, 152, 0.9) 0%, 
                rgba(255, 190, 152, 0.8) 30%,
                rgba(254, 217, 146, 0.7) 70%,
                rgba(255, 190, 152, 0.85) 100%)`,
              backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: palette.dark,
              fontFamily: "Aeonik Extended, sans-serif",
              fontWeight: 500,
              boxShadow: '0 0 20px rgba(13, 15, 30, 0.3)'
            }}
          >
            <FiArrowLeft />
            Back to All News
          </Link>
        </motion.div>
      </div>
    </div>
  )
}