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
    const slug = searchParams.get('slug')
    
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
    
    // If fetching by slug, return single article
    if (slug) {
      const article = news.find((item: any) => item.slug === slug)
      return NextResponse.json({
        news: article ? [article] : [],
        total: article ? 1 : 0,
        page: 1,
        totalPages: 1
      })
    }
    
    // Sort news by date (newest first)
    const sortedNews = news.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    
    // Filter news
    let filtered = sortedNews
    
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
      // readTime removed
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