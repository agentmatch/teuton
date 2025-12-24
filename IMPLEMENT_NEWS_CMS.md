# Task: Implement News CMS and Import Historical Releases

## CRITICAL: Full Implementation Checklist
□ Parse and import CSV news data  
□ Create news API endpoint  
□ Build simple CMS admin interface  
□ Update news page to display real data  
□ Add pagination and search  
□ Test all functionality  

## CSV Data Analysis
- **File**: `/svgnewsreleases.csv`
- **Records**: ~2,951 lines (multiple news releases)
- **Structure**: 
  - id: Unique identifier
  - Title: News headline
  - Content: Full news text (multi-line, includes formatting)
- **Date Format**: Embedded in content (e.g., "May 2, 2012", "Oct. 25, 2011")

## Solution Architecture

### 1. Data Storage Options
**Recommended: JSON File-Based CMS**
- Simple, no database needed
- Easy to edit and backup
- Version controlled with Git
- Fast for small datasets

### 2. File Structure
```
/data/
  news.json           # All news releases
  news-metadata.json  # Categories, tags, etc.
/app/api/
  news/
    route.ts         # GET all news
    [id]/
      route.ts       # GET/PUT/DELETE single news
    import/
      route.ts       # POST to import CSV
/app/admin/
  news/
    page.tsx         # Admin interface
    new/
      page.tsx       # Create new release
    [id]/
      page.tsx       # Edit release
```

## Required Changes (COMPLETE ALL IN ORDER)

### Step 1: Create News Data Parser
**CREATE `/lib/news-parser.ts`:**
```typescript
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface NewsRelease {
  id: string
  title: string
  content: string
  date: Date
  dateString: string
  category: 'Exploration Update' | 'Corporate News' | 'Financial Update' | 'Property News'
  tags: string[]
  slug: string
  excerpt: string
  readTime: string
}

// Extract date from content
function extractDate(content: string): { date: Date; dateString: string } {
  // Common patterns in the CSV
  const patterns = [
    /^([A-Z][a-z]+\.?\s+\d{1,2},\s+\d{4})/,  // "May 2, 2012" or "Oct. 25, 2011"
    /^([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/,     // "December 8, 2010"
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      const dateString = match[1]
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return { date, dateString }
      }
    }
  }
  
  // Fallback to current date if no date found
  return { 
    date: new Date(), 
    dateString: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
}

// Generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 200): string {
  // Remove date from beginning
  const withoutDate = content.replace(/^[^:]+:\s*/, '')
  // Clean up whitespace and truncate
  const cleaned = withoutDate.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.substring(0, maxLength).trim() + '...'
}

// Calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

// Categorize based on content
function categorizeContent(title: string, content: string): NewsRelease['category'] {
  const text = (title + ' ' + content).toLowerCase()
  
  if (text.includes('drill') || text.includes('sample') || text.includes('assay') || 
      text.includes('mineralization') || text.includes('discovery')) {
    return 'Exploration Update'
  }
  if (text.includes('financial') || text.includes('quarter') || text.includes('earnings')) {
    return 'Financial Update'
  }
  if (text.includes('option') || text.includes('agreement') || text.includes('appoint') || 
      text.includes('director') || text.includes('management')) {
    return 'Corporate News'
  }
  return 'Property News'
}

// Extract tags from content
function extractTags(title: string, content: string): string[] {
  const tags: string[] = []
  const text = (title + ' ' + content).toLowerCase()
  
  // Property names
  if (text.includes('clone')) tags.push('Clone')
  if (text.includes('tennyson')) tags.push('Tennyson')
  if (text.includes('fiji')) tags.push('Fiji')
  if (text.includes('tonga')) tags.push('Tonga')
  if (text.includes('ram')) tags.push('RAM')
  if (text.includes('konkin')) tags.push('Konkin Silver')
  if (text.includes('midas')) tags.push('Midas')
  if (text.includes('bay silver')) tags.push('Bay Silver')
  
  // Minerals
  if (text.includes('gold')) tags.push('Gold')
  if (text.includes('silver')) tags.push('Silver')
  if (text.includes('copper')) tags.push('Copper')
  
  // Activities
  if (text.includes('drilling')) tags.push('Drilling')
  if (text.includes('bulk sample')) tags.push('Bulk Sampling')
  if (text.includes('option')) tags.push('Options')
  
  return [...new Set(tags)] // Remove duplicates
}

export async function parseCSVNews(): Promise<NewsRelease[]> {
  const csvPath = path.join(process.cwd(), 'svgnewsreleases.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    skip_records_with_error: true
  })
  
  // Transform records
  const newsReleases: NewsRelease[] = records.map((record: any) => {
    const { date, dateString } = extractDate(record.Content || '')
    const title = record.Title || 'Untitled'
    const content = record.Content || ''
    
    return {
      id: record.id || Date.now().toString(),
      title,
      content,
      date,
      dateString,
      category: categorizeContent(title, content),
      tags: extractTags(title, content),
      slug: generateSlug(title),
      excerpt: generateExcerpt(content),
      readTime: calculateReadTime(content)
    }
  })
  
  // Sort by date (newest first)
  return newsReleases.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function saveNewsToJSON(news: NewsRelease[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
  }
  
  const jsonPath = path.join(dataDir, 'news.json')
  fs.writeFileSync(jsonPath, JSON.stringify(news, null, 2))
}
```

### Step 2: Create Import Script
**CREATE `/scripts/import-news.ts`:**
```typescript
import { parseCSVNews, saveNewsToJSON } from '../lib/news-parser'

async function importNews() {
  console.log('Starting news import...')
  
  try {
    // Parse CSV
    const news = await parseCSVNews()
    console.log(`Parsed ${news.length} news releases`)
    
    // Save to JSON
    await saveNewsToJSON(news)
    console.log('News saved to data/news.json')
    
    // Print summary
    const categories = news.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('\nSummary:')
    console.log('Categories:', categories)
    console.log('Date range:', news[news.length - 1].dateString, 'to', news[0].dateString)
    
  } catch (error) {
    console.error('Error importing news:', error)
    process.exit(1)
  }
}

importNews()
```

### Step 3: Create News API Routes
**CREATE `/app/api/news/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    
    // Read news data
    const jsonPath = path.join(process.cwd(), 'data', 'news.json')
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ 
        news: [], 
        total: 0, 
        page, 
        totalPages: 0 
      })
    }
    
    const news = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    
    // Filter news
    let filtered = news
    
    if (category) {
      filtered = filtered.filter((item: any) => item.category === category)
    }
    
    if (tag) {
      filtered = filtered.filter((item: any) => item.tags.includes(tag))
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((item: any) => 
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower)
      )
    }
    
    // Paginate
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedNews = filtered.slice(start, start + limit)
    
    return NextResponse.json({
      news: paginatedNews,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newsItem = await request.json()
    
    // Read existing news
    const jsonPath = path.join(process.cwd(), 'data', 'news.json')
    let news = []
    if (fs.existsSync(jsonPath)) {
      news = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    }
    
    // Add new item with generated fields
    const newItem = {
      ...newsItem,
      id: Date.now().toString(),
      date: new Date(),
      dateString: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      slug: newsItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      readTime: `${Math.ceil(newsItem.content.split(/\s+/).length / 200)} min read`
    }
    
    // Add to beginning (newest first)
    news.unshift(newItem)
    
    // Save
    fs.writeFileSync(jsonPath, JSON.stringify(news, null, 2))
    
    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 })
  }
}
```

### Step 4: Update News Page Component
**REPLACE `/app/news/page.tsx`:**
```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiCalendar, FiTag, FiArrowRight, FiClock, FiSearch, FiFilter } from 'react-icons/fi'

// Lazy load for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  dateString: string
  category: 'Exploration Update' | 'Corporate News' | 'Financial Update' | 'Property News'
  readTime: string
  tags: string[]
  slug: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

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
    'Exploration Update',
    'Corporate News', 
    'Financial Update',
    'Property News'
  ]

  const allTags = Array.from(new Set(news.flatMap(item => item.tags)))

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
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#E5E5E5] mb-4"
              style={{ fontFamily: "'Aeonik Extended', sans-serif" }}>
            News & Updates
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Stay informed with the latest developments from Silver Grail Resources
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#FFFF77]/50"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg transition-all ${
                !selectedCategory 
                  ? 'bg-[#FFFF77]/20 text-[#FFFF77] border border-[#FFFF77]/50' 
                  : 'bg-black/30 text-white/70 border border-white/20 hover:border-white/40'
              }`}
            >
              All News
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category 
                    ? 'bg-[#FFFF77]/20 text-[#FFFF77] border border-[#FFFF77]/50' 
                    : 'bg-black/30 text-white/70 border border-white/20 hover:border-white/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
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
            </div>
          )}
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-[#E5E5E5] mb-2">
                        {item.title}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <FiCalendar /> {item.dateString}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock /> {item.readTime}
                        </span>
                        <span className="px-2 py-0.5 bg-[#FFFF77]/10 text-[#FFFF77] rounded">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-white/70 mb-4">
                    {expandedItem === item.id ? (
                      <div className="whitespace-pre-wrap">{item.content}</div>
                    ) : (
                      <p>{item.excerpt}</p>
                    )}
                  </div>

                  {/* Tags and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="flex items-center gap-2 text-[#FFFF77] hover:text-[#FFFF77]/80 transition-colors"
                    >
                      {expandedItem === item.id ? 'Show Less' : 'Read More'}
                      <FiArrowRight className={`transform transition-transform ${
                        expandedItem === item.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-2 mt-12"
          >
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-black/30 text-white/70 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-black/30 text-white/70 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
```

### Step 5: Add Package Dependencies
**UPDATE `/package.json` - ADD to dependencies:**
```json
"csv-parse": "^5.5.6"
```

### Step 6: Create Import Command
**UPDATE `/package.json` - ADD to scripts:**
```json
"import-news": "tsx scripts/import-news.ts"
```

## Implementation Steps (IN ORDER)

1. **Install Dependencies**:
   ```bash
   npm install csv-parse
   ```

2. **Create all files above** in the specified locations

3. **Run the import script**:
   ```bash
   npm run import-news
   ```
   This will parse the CSV and create `/data/news.json`

4. **Test the API**:
   ```bash
   # Start dev server
   npm run dev
   
   # Test API endpoint
   curl http://localhost:3000/api/news
   ```

5. **Visit the news page**: 
   Navigate to `http://localhost:3000/news`

## Optional: Simple Admin Interface
**CREATE `/app/admin/news/page.tsx`:**
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewsAdmin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Corporate News' as any,
    tags: [] as string[],
    excerpt: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        router.push('/news')
      }
    } catch (error) {
      console.error('Error creating news:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create News Release</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 bg-gray-800 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              className="w-full p-3 bg-gray-800 rounded"
            >
              <option>Exploration Update</option>
              <option>Corporate News</option>
              <option>Financial Update</option>
              <option>Property News</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="w-full p-3 bg-gray-800 rounded h-24"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-3 bg-gray-800 rounded h-64"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-yellow-500 text-black rounded font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create News Release'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

## Testing Checklist
- [ ] CSV import works correctly
- [ ] All news releases display with proper formatting
- [ ] Dates are parsed correctly
- [ ] Categories are assigned appropriately
- [ ] Search functionality works
- [ ] Filter by category works
- [ ] Filter by tag works
- [ ] Pagination works
- [ ] Read more/less toggle works
- [ ] Mobile responsive
- [ ] Admin interface creates new posts

## Benefits of This Approach
1. **No Database Required**: Simple JSON file storage
2. **Version Controlled**: News data in Git
3. **Fast Performance**: JSON cached in memory
4. **Easy Backup**: Just copy the data folder
5. **Simple Deployment**: No database migrations
6. **Future Flexibility**: Easy to migrate to database later

## COPY THIS ENTIRE FILE TO THE OTHER CLAUDE INSTANCE

**Tell the other Claude:**
```
Implement the news CMS system from /IMPLEMENT_NEWS_CMS.md.
Start by creating all files, then run the import script.
Test that all historical news displays correctly.
```