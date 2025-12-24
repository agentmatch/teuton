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

// Comprehensive manual date mapping based on content analysis
const dateMapping: Record<string, { date: string; dateString: string }> = {
  "Update on 2023 Surface Exploration of Silver Grail's Properties Located East of Stewart in the Golden Triangle ": {
    date: new Date("October 2, 2023").toISOString(),
    dateString: "October 2, 2023"
  },
  "Teuton and Silver Grail Prepare for Summer Work on Their Properties Located East and Southeast of Stewart, BC in the Golden Triangle": {
    date: new Date("June 14, 2023").toISOString(),
    dateString: "June 14, 2023"
  },
  "Private Placement": {
    date: new Date("October 4, 2023").toISOString(),
    dateString: "October 4, 2023"
  },
  "Silver Grail Resources ReportsNew Mineralized Zones on Ram Property": {
    date: new Date("November 22, 2023").toISOString(),
    dateString: "November 22, 2023"
  },
  "Silver Grail Drills Ram Property in BC's Active Golden Triangle": {
    date: new Date("August 26, 2025").toISOString(),
    dateString: "August 26, 2025"
  },
  "Geochemical Survey on Silver Grail's Pacifico Property Generates High Cobalt Values; Plans for 2021 Program on Midas-Konkin Silver Property,  Golden Triangle": {
    date: new Date("March 25, 2021").toISOString(),
    dateString: "March 25, 2021"
  },
  "Silver Grail Updates Pacifico, Tonga and Fiji Properties": {
    date: new Date("June 28, 2021").toISOString(),
    dateString: "June 28, 2021"
  },
  "Stock Options Granted": {
    date: new Date("July 13, 2021").toISOString(),
    dateString: "July 13, 2021"
  },
  "Drilling Begins at Midas Property -- Konkin Silver to Be Drilled Next": {
    date: new Date("June 30, 2021").toISOString(),
    dateString: "June 30, 2021"
  },
  "Drilling intersects graphitic mudstones, dacite and sulphides on Konkin Silver property": {
    date: new Date("July 28, 2021").toISOString(),
    dateString: "July 28, 2021"
  },
  "Drill Results from Midas and Konkin Silver Properties": {
    date: new Date("October 12, 2021").toISOString(),
    dateString: "October 12, 2021"
  },
  "Bay Silver Property Optioned to Auramex Resources": {
    date: new Date("November 9, 2021").toISOString(),
    dateString: "November 9, 2021"
  },
  "2018 Exploration Results": {
    date: new Date("February 6, 2019").toISOString(),
    dateString: "February 6, 2019"
  },
  "Silver Crown Property Optioned to Auramex Resources": {
    date: new Date("March 26, 2019").toISOString(),
    dateString: "March 26, 2019"
  },
  "New Mineralized Structure Found on Fiji Property": {
    date: new Date("November 5, 2019").toISOString(),
    dateString: "November 5, 2019"
  },
  "High Cobalt Values in Stream Sediments on Pacifico Property; Fiji Property Gold Samples;  Clone Property Returned": {
    date: new Date("January 6, 2020").toISOString(),
    dateString: "January 6, 2020"
  },
  "Private Placement—Eric Sprott to Take 2,500,000 Units": {
    date: new Date("June 1, 2020").toISOString(),
    dateString: "June 1, 2020"
  },
  "Five Cobalt Properties Acquired in British Columbia": {
    date: new Date("April 5, 2018").toISOString(),
    dateString: "April 5, 2018"
  }
}

// Function to extract date from content as fallback
function extractDateFromContent(content: string): { date: string; dateString: string } | null {
  const patterns = [
    /<p><strong>([^<]*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*<\/strong>/i,
    /<p><strong><em>([^<]*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*<\/em><\/strong>/i,
    /<em>([^<]*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})[^<]*<\/em>/i
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      const dateText = match[1]
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

async function finalDateFix() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'news.json')
    const newsData: NewsItem[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    
    console.log('Performing final comprehensive date fix...')
    
    let updatedCount = 0
    
    const updatedNews = newsData.map((item) => {
      // First check manual mapping
      const manualDate = dateMapping[item.title]
      if (manualDate) {
        updatedCount++
        console.log(`Manual: "${item.title}" -> ${manualDate.dateString}`)
        return {
          ...item,
          date: manualDate.date,
          dateString: manualDate.dateString
        }
      }
      
      // Then try content extraction
      const extractedDate = extractDateFromContent(item.content)
      if (extractedDate) {
        updatedCount++
        console.log(`Extracted: "${item.title}" -> ${extractedDate.dateString}`)
        return {
          ...item,
          date: extractedDate.date,
          dateString: extractedDate.dateString
        }
      }
      
      // Default to current date for items without dates
      console.log(`No date found for: "${item.title.substring(0, 60)}..." - using current date`)
      return {
        ...item,
        date: new Date().toISOString(),
        dateString: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
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
  finalDateFix()
}