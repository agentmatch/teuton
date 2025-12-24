'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCalendar, FiTag } from 'react-icons/fi'
import { useEffect } from 'react'

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

interface NewsModalProps {
  news: NewsItem | null
  onClose: () => void
}

const categoryColors = {
  'Exploration & Property Updates': '#4ADE80',
  'Corporate & Financial': '#60A5FA'
}

// Clean HTML content and format it for display
function cleanContent(content: string): string {
  return content
    // Remove WordPress comments and blocks
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '')
    
    // Handle the special tagline paragraph (first paragraph with date/company info)
    .replace(/^(<p><strong>[^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}[^<]*?<\/strong>[^<]*?<strong>[^<]*?<\/strong>)/i, 
      '\n\n📅 $1\n')
    .replace(/^(<p><strong><em>[^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}[^<]*?<\/em><\/strong>)/i, 
      '\n\n📅 $1\n')
    
    // Handle headers with proper spacing
    .replace(/<p><strong>([^<]*)<\/strong><\/p>/g, '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n**$1**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    .replace(/<p><strong><u>([^<]*)<\/u><\/strong><\/p>/g, '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n**$1**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    .replace(/<strong><u>([^<]*)<\/u><\/strong>/g, '\n\n**$1**\n')
    
    // Handle bold and italic text
    .replace(/<strong>([^<]*)<\/strong>/g, '**$1**')
    .replace(/<em>([^<]*)<\/em>/g, '*$1*')
    .replace(/<u>([^<]*)<\/u>/g, '$1')
    
    // Handle paragraphs with better spacing
    .replace(/<p>/g, '\n\n')
    .replace(/<\/p>/g, '')
    
    // Handle lists with better formatting
    .replace(/<!-- wp:list --><ul>/g, '\n')
    .replace(/<ul>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/<!-- wp:list-item --><li>/g, '\n  • ')
    .replace(/<li>/g, '\n  • ')
    .replace(/<\/li>/g, '')
    
    // Handle links with better formatting
    .replace(/<a[^>]*href="([^"]*)"[^>]*target="_blank"[^>]*>([^<]*)<\/a>/g, '🔗 $2\n   ↳ $1')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '🔗 $2 ($1)')
    
    // Handle special characters and formatting
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    
    // Clean up extra whitespace and format
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n\n\n+/g, '\n\n')
    .trim()
    
    // Add some visual separation for different sections
    .replace(/(\n\n\*\*[^*]+\*\*\n)/g, '$1\n')
}

export default function NewsModal({ news, onClose }: NewsModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (news) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [news])

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (news) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [news, onClose])

  if (!news) return null

  // Format content with proper line breaks and styling
  const formatContent = (content: string) => {
    const cleanedContent = cleanContent(content)
    return cleanedContent.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null
      
      // Handle taglines (date/company info)
      if (paragraph.includes('📅')) {
        const cleanedTagline = paragraph
          .replace('📅', '')
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '')
          .replace(/<em>/g, '')
          .replace(/<\/em>/g, '')
          .trim()
        
        return (
          <div key={index} className="mb-6 p-4 rounded-lg border border-white/10"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                 backdropFilter: 'blur(10px)'
               }}>
            <p className="text-white/70 text-sm leading-relaxed"
               style={{ fontFamily: "Aeonik, sans-serif" }}>
              {cleanedTagline}
            </p>
          </div>
        )
      }

      // Handle separators
      if (paragraph.includes('━━━━')) {
        const match = paragraph.match(/\*\*(.+?)\*\*/)
        if (match) {
          return (
            <div key={index} className="my-8 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-lg"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                     backdropFilter: 'blur(10px)',
                     border: '1px solid rgba(255, 255, 255, 0.1)'
                   }}>
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1"></div>
                <span className="text-white font-semibold text-sm tracking-wider uppercase"
                      style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                  {match[1]}
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1"></div>
              </div>
            </div>
          )
        }
        return <div key={index} className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      }
      
      // Handle bullet points
      if (paragraph.trim().startsWith('•')) {
        return (
          <li key={index} className="text-white/80 leading-relaxed mb-2 ml-4" style={{ fontFamily: "Aeonik, sans-serif" }}>
            {paragraph.replace(/^\s*•\s*/, '')}
          </li>
        )
      }
      
      // Handle bold headers
      if (paragraph.includes('**') && paragraph.trim().split('\n').length === 1) {
        const boldText = paragraph.replace(/\*\*(.*?)\*\*/g, '$1')
        return (
          <h3 key={index} className="text-white text-lg font-semibold mb-4 mt-6"
              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
            {boldText}
          </h3>
        )
      }
      
      // Handle links
      if (paragraph.includes('🔗')) {
        const parts = paragraph.split('\n')
        return (
          <div key={index} className="mb-4">
            {parts.map((part, partIndex) => {
              if (part.includes('🔗')) {
                const linkMatch = part.match(/🔗\s*(.+)/)
                if (linkMatch) {
                  return (
                    <div key={partIndex} className="text-blue-300 hover:text-blue-200 transition-colors">
                      {linkMatch[1]}
                    </div>
                  )
                }
              } else if (part.includes('↳')) {
                const urlMatch = part.match(/↳\s*(.+)/)
                if (urlMatch) {
                  return (
                    <div key={partIndex} className="text-white/50 text-sm ml-4 break-all">
                      {urlMatch[1]}
                    </div>
                  )
                }
              }
              return null
            })}
          </div>
        )
      }
      
      // Handle regular paragraphs with inline formatting
      const formattedParagraph = paragraph
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="text-white/90">$1</em>')
      
      return (
        <p key={index} 
           className="text-white/80 leading-relaxed mb-4" 
           style={{ fontFamily: "Aeonik, sans-serif" }}
           dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      )
    }).filter(Boolean)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-5xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(7, 52, 64, 0.9) 100%)',
            backdropFilter: 'blur(30px) saturate(150%)',
            WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
            maxHeight: 'calc(100vh - 120px)',
            marginTop: '80px',
            marginBottom: '40px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white/70 hover:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-8 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Header */}
            <div className="mb-8">
              {/* Category and Meta Info */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${categoryColors[news.category]}15`,
                    color: categoryColors[news.category],
                    border: `1px solid ${categoryColors[news.category]}30`
                  }}
                >
                  {news.category}
                </span>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <time dateTime={news.date}>{news.dateString}</time>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                {news.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {news.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 text-white/60 rounded-full text-sm"
                  >
                    <FiTag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {formatContent(news.content)}
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </AnimatePresence>
  )
}