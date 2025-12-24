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

// Function to extract date from content with multiple patterns
function extractDateFromContent(content: string): { date: string; dateString: string } | null {
  const patterns = [
    // Pattern 1: <p><strong>June 14, 2023 Victoria</strong>
    /<p><strong>([^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*?<\/strong>/i,
    // Pattern 2: <p><strong><em>March 25, 2021--Vancouver, BC</em></strong>
    /<p><strong><em>([^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*?<\/em><\/strong>/i,
    // Pattern 3: <p><strong>October 2, 2023 Victoria</strong>
    /<strong>([^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*?<\/strong>/i,
    // Pattern 4: <em>March 25, 2021--Vancouver, BC</em>
    /<em>([^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*?<\/em>/i,
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      const dateText = match[1]
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
  }
  
  return null
}

// Manually provide dates for specific releases based on common patterns
const manualDates: Record<string, { date: string; dateString: string }> = {
  "Update on 2023 Surface Exploration of Silver Grail's Properties Located East of Stewart in the Golden Triangle": {
    date: new Date("October 2, 2023").toISOString(),
    dateString: "October 2, 2023"
  },
  "Silver Grail Resources ReportsNew Mineralized Zones on Ram Property": {
    date: new Date("November 22, 2023").toISOString(),
    dateString: "November 22, 2023"
  },
  "Geochemical Survey on Silver Grail's Pacifico Property Generates High Cobalt Values; Plans for 2021 Program on Midas-Konkin Silver Property,  Golden Triangle": {
    date: new Date("March 25, 2021").toISOString(),
    dateString: "March 25, 2021"
  },
  "Silver Grail Updates Pacifico, Tonga and Fiji Properties": {
    date: new Date("June 28, 2021").toISOString(),
    dateString: "June 28, 2021"
  }
}

async function comprehensiveDateFix() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'news.json')
    const newsData: NewsItem[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    
    console.log('Performing comprehensive date fix...')
    
    let updatedCount = 0
    
    const updatedNews = newsData.map((item) => {
      // First check manual dates
      const manualDate = manualDates[item.title]
      if (manualDate) {
        updatedCount++
        console.log(`Manual fix: "${item.title}" -> ${manualDate.dateString}`)
        return {
          ...item,
          date: manualDate.date,
          dateString: manualDate.dateString
        }
      }
      
      // Then try to extract from content
      const extractedDate = extractDateFromContent(item.content)
      if (extractedDate) {
        updatedCount++
        console.log(`Extracted: "${item.title}" -> ${extractedDate.dateString}`)
        return {
          ...item,
          date: extractedDate.date,
          dateString: extractedDate.dateString
        }
      } else {
        console.log(`No date found for: "${item.title.substring(0, 60)}..."`)
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
  comprehensiveDateFix()
}