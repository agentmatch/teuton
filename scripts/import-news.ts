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