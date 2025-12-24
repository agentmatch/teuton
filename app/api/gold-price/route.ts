import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use Kitco's widget data endpoint
    const response = await fetch('https://proxy.kitco.com/getPM?symbol=AU', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': 'https://www.kitco.com'
      },
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch gold price')
    }
    
    const text = await response.text()
    
    // Parse Kitco CSV format:
    // AU,USD,OUNCE,2025-06-13 16:14:21,3430.62,3431.62,3432.62,46.50,1.37,3378.32,3445.21
    // Format: symbol,currency,unit,datetime,bid,ask,price,change,changePercent,low,high
    
    const parts = text.trim().split(',')
    
    if (parts.length >= 9 && parts[0] === 'AU') {
      const bid = parseFloat(parts[4]) || null
      const ask = parseFloat(parts[5]) || null
      const price = bid || ask || null  // Use bid price (3430.62) as the main price
      const change = parseFloat(parts[7]) || 0
      const changePercent = parseFloat(parts[8]) || 0
      const low = parseFloat(parts[9]) || null
      const high = parseFloat(parts[10]) || null
      
      if (price) {
        return NextResponse.json({
          commodity: 'Gold',
          unit: 'USD/oz',
          price: price,
          change: change,
          changePercent: changePercent,
          bid: bid,
          ask: ask,
          high: high,
          low: low,
          timestamp: new Date().toISOString()
        })
      }
    }
    
    // If parsing fails, return null to hide the widget
    return NextResponse.json({
      commodity: 'Gold',
      unit: 'USD/oz',
      price: null,
      change: null,
      changePercent: null,
      bid: null,
      ask: null,
      high: null,
      low: null,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching Kitco gold price:', error)
    
    // Return null values on error - widget will hide
    return NextResponse.json({
      commodity: 'Gold',
      unit: 'USD/oz',
      price: null,
      change: null,
      changePercent: null,
      bid: null,
      ask: null,
      high: null,
      low: null,
      timestamp: new Date().toISOString()
    })
  }
}