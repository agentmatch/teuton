#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface NewsItem {
  id: string
  title: string
  content: string
  date: string
  dateString: string
  category: string
  tags: string[]
  slug: string
  excerpt: string
  readTime: string
}

// Comprehensive date mapping based on the releases
const dateMapping: Record<string, { date: Date; category: 'Exploration & Property Updates' | 'Corporate & Financial' }> = {
  "Teuton and Silver Grail Prepare for Summer Work on Their Properties Located East and Southeast of Stewart, BC in the Golden Triangle": {
    date: new Date("June 14, 2023"),
    category: 'Exploration & Property Updates'
  },
  "Update on 2023 Surface Exploration of Silver Grail's Properties Located East of Stewart in the Golden Triangle ": {
    date: new Date("October 2, 2023"),
    category: 'Exploration & Property Updates'
  },
  "Private Placement": {
    date: new Date("October 4, 2023"),
    category: 'Corporate & Financial'
  },
  "Silver Grail Resources ReportsNew Mineralized Zones on Ram Property": {
    date: new Date("November 22, 2023"),
    category: 'Exploration & Property Updates'
  },
  "Silver Grail Drills Ram Property in BC's Active Golden Triangle": {
    date: new Date("August 26, 2025"),
    category: 'Exploration & Property Updates'
  },
  "Geochemical Survey on Silver Grail's Pacifico Property Generates High Cobalt Values; Plans for 2021 Program on Midas-Konkin Silver Property,  Golden Triangle": {
    date: new Date("March 25, 2021"),
    category: 'Exploration & Property Updates'
  },
  "Silver Grail Updates Pacifico, Tonga and Fiji Properties": {
    date: new Date("June 28, 2021"),
    category: 'Exploration & Property Updates'
  },
  "Stock Options Granted": {
    date: new Date("July 13, 2021"),
    category: 'Corporate & Financial'
  },
  "Drilling Begins at Midas Property -- Konkin Silver to Be Drilled Next": {
    date: new Date("June 30, 2021"),
    category: 'Exploration & Property Updates'
  },
  "Drilling intersects graphitic mudstones, dacite and sulphides on Konkin Silver property": {
    date: new Date("July 28, 2021"),
    category: 'Exploration & Property Updates'
  },
  "Drill Results from Midas and Konkin Silver Properties": {
    date: new Date("October 12, 2021"),
    category: 'Exploration & Property Updates'
  },
  "Bay Silver Property Optioned to Auramex Resources": {
    date: new Date("November 9, 2021"),
    category: 'Corporate & Financial'
  },
  "2018 Exploration Results": {
    date: new Date("February 6, 2019"),
    category: 'Exploration & Property Updates'
  },
  "Silver Crown Property Optioned to Auramex Resources": {
    date: new Date("March 26, 2019"),
    category: 'Corporate & Financial'
  },
  "New Mineralized Structure Found on Fiji Property": {
    date: new Date("November 5, 2019"),
    category: 'Exploration & Property Updates'
  },
  "High Cobalt Values in Stream Sediments on Pacifico Property; Fiji Property Gold Samples;  Clone Property Returned": {
    date: new Date("January 6, 2020"),
    category: 'Exploration & Property Updates'
  },
  "Private Placement—Eric Sprott to Take 2,500,000 Units": {
    date: new Date("June 1, 2020"),
    category: 'Corporate & Financial'
  },
  "Five Cobalt Properties Acquired in British Columbia": {
    date: new Date("April 5, 2018"),
    category: 'Exploration & Property Updates'
  },
  "Drill Hole Intersects 6.43 Metres Grading  17.83 G/T Gold at Clone Gold Property": {
    date: new Date("September 24, 2012"),
    category: 'Exploration & Property Updates'
  },
  "Drill Hole Intersects 7.01 Metres Grading 10.38 G/T Gold at Clone Gold Property": {
    date: new Date("September 12, 2012"),
    category: 'Exploration & Property Updates'
  },
  "Clone Gold Property Optioned to Sunvest Ventures": {
    date: new Date("June 20, 2012"),
    category: 'Corporate & Financial'
  },
  "2014 Recon Work Begins on Silver Grail-Teuton Properties Next to the Red Mountain Gold Property": {
    date: new Date("June 4, 2014"),
    category: 'Exploration & Property Updates'
  },
  "High Gold Stream Geochem Anomalies Discovered On Silver Crown 6 Property": {
    date: new Date("August 14, 2013"),
    category: 'Exploration & Property Updates'
  },
  "Options Extended": {
    date: new Date("January 15, 2013"),
    category: 'Corporate & Financial'
  },
  "Clone Bulk Sample Averages 4.0 Oz/Ton Gold": {
    date: new Date("December 5, 2011"),
    category: 'Exploration & Property Updates'
  },
  "IP Survey Begins at Roman-Andy Properties": {
    date: new Date("September 30, 2011"),
    category: 'Exploration & Property Updates'
  },
  "102 Tons Bulk Sampled at Clone": {
    date: new Date("September 7, 2011"),
    category: 'Exploration & Property Updates'
  },
  "Silver Grail's Bay Silver Property Farmed out to Decade": {
    date: new Date("June 15, 2011"),
    category: 'Corporate & Financial'
  },
  "Clone Bulk Sample Results Average 68.65 G/T Gold": {
    date: new Date("May 16, 2011"),
    category: 'Exploration & Property Updates'
  },
  "Hole #7 Cuts 2.50 Metres of 66.58 g/t Gold at Clone Property": {
    date: new Date("April 14, 2011"),
    category: 'Exploration & Property Updates'
  },
  "Silver Grail Purchases Rare Earth Major Hart Property": {
    date: new Date("March 31, 2011"),
    category: 'Exploration & Property Updates'
  },
  "Hole #1 Cuts 11.58 Metres of 5.98 g/t Gold at Clone Property": {
    date: new Date("March 17, 2011"),
    category: 'Exploration & Property Updates'
  },
  "Progress Report on Drilling at Clone Gold Property": {
    date: new Date("March 9, 2011"),
    category: 'Exploration & Property Updates'
  },
  "Hole #28 Cuts 12.80 Metres of 44.75 G/T Gold (42 Feet of 1.305 oz/t Gold)": {
    date: new Date("December 13, 2010"),
    category: 'Exploration & Property Updates'
  },
  "Hole #21 Cuts 7.93 Metres of 30.37 G/T at Clone": {
    date: new Date("November 23, 2010"),
    category: 'Exploration & Property Updates'
  },
  "Second Phase of Drilling Complete at Clone Property": {
    date: new Date("November 15, 2010"),
    category: 'Exploration & Property Updates'
  },
  "Second Phase of Drilling Commences at Clone Property": {
    date: new Date("October 18, 2010"),
    category: 'Exploration & Property Updates'
  },
  "Visible Gold Intersected at Clone Property": {
    date: new Date("September 15, 2010"),
    category: 'Exploration & Property Updates'
  }
}

async function fixDatesAndCategories() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'news.json')
    const newsData: NewsItem[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    
    console.log('Fixing dates and categories...')
    
    let updatedCount = 0
    let notFoundCount = 0
    
    const updatedNews = newsData.map((item) => {
      const mapping = dateMapping[item.title.trim()]
      
      if (mapping) {
        updatedCount++
        const dateString = mapping.date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
        
        console.log(`✓ "${item.title.substring(0, 50)}..." -> ${dateString} (${mapping.category})`)
        
        return {
          ...item,
          date: mapping.date.toISOString(),
          dateString: dateString,
          category: mapping.category
        }
      } else {
        notFoundCount++
        console.log(`✗ No mapping for: "${item.title.substring(0, 50)}..."`)
        
        // Default to Corporate & Financial for unmapped items
        return {
          ...item,
          category: 'Corporate & Financial'
        }
      }
    })
    
    // Sort by date (newest first)
    updatedNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(updatedNews, null, 2))
    
    console.log(`\n✅ Fixed ${updatedCount} news items`)
    console.log(`⚠️  ${notFoundCount} items without date mapping (kept existing dates)`)
    console.log('✅ Updated categories to simplified structure')
    console.log('✅ news.json updated successfully!')
    
  } catch (error) {
    console.error('Error fixing dates and categories:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  fixDatesAndCategories()
}