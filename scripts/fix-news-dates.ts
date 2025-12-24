#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface NewsItem {
  id: string
  title: string
  content: string
  date: string
  dateString: string
  category: 'Exploration Update' | 'Corporate News' | 'Financial Update' | 'Property News'
  tags: string[]
  slug: string
  excerpt: string
  readTime: string
}

// Function to extract date from content
function extractDateFromContent(content: string): { date: string; dateString: string } | null {
  // Look for patterns like "June 14, 2023" or "October 2, 2023"
  const dateMatches = content.match(/<p><strong>([^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*?<\/strong>/i)
  
  if (dateMatches) {
    const dateText = dateMatches[1]
    // Extract just the date part
    const dateOnly = dateText.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i)
    
    if (dateOnly) {
      const dateStr = dateOnly[0].trim()
      const parsedDate = new Date(dateStr)
      
      if (!isNaN(parsedDate.getTime())) {
        return {
          date: parsedDate.toISOString(),
          dateString: dateStr
        }
      }
    }
  }
  
  return null
}

async function fixNewsDates() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'news.json')
    const newsData: NewsItem[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    
    console.log('Fixing news dates...')
    
    let updatedCount = 0
    
    const updatedNews = newsData.map((item) => {
      const extractedDate = extractDateFromContent(item.content)
      
      if (extractedDate) {
        updatedCount++
        console.log(`Updated: "${item.title}" -> ${extractedDate.dateString}`)
        return {
          ...item,
          date: extractedDate.date,
          dateString: extractedDate.dateString
        }
      } else {
        console.log(`No date found for: "${item.title}"`)
        return item
      }
    })
    
    // Sort by date (newest first)
    updatedNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(updatedNews, null, 2))
    
    console.log(`\nFixed ${updatedCount} news items with correct dates`)
    console.log('Updated news.json successfully!')
    
  } catch (error) {
    console.error('Error fixing news dates:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  fixNewsDates()
}