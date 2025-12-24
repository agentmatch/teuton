import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use Kitco's widget data endpoint for silver
    const response = await fetch('https://proxy.kitco.com/getPM?symbol=AG', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': 'https://www.kitco.com'
      },
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch silver price')
    }
    
    const text = await response.text()
    
    // Parse Kitco CSV format:
    // AG,USD,OUNCE,2025-06-13 16:14:21,30.62,30.72,30.67,0.50,1.67,30.12,31.21
    // Format: symbol,currency,unit,datetime,bid,ask,price,change,changePercent,low,high
    
    const parts = text.trim().split(',')
    
    if (parts.length >= 9 && parts[0] === 'AG') {
      const bid = parseFloat(parts[4]) || null
      const ask = parseFloat(parts[5]) || null
      const price = bid || ask || null  // Use bid price as the main price
      const change = parseFloat(parts[7]) || 0
      const changePercent = parseFloat(parts[8]) || 0
      const low = parseFloat(parts[9]) || null
      const high = parseFloat(parts[10]) || null
      
      if (price) {
        return NextResponse.json({
          commodity: 'Silver',
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
      commodity: 'Silver',
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
    console.error('Error fetching Kitco silver price:', error)
    
    // Return null values on error - widget will hide
    return NextResponse.json({
      commodity: 'Silver',
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