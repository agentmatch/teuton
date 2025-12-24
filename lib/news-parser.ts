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