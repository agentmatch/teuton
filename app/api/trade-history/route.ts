import { NextResponse } from 'next/server'

export async function GET() {
  let browser;
  try {
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Navigate to TMX trade history page
    await page.goto('https://money.tmx.com/en/quote/SVG/trade-history', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for trade table to load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract trade data from the page
    const trades = await page.evaluate(() => {
      // TMX trade history format: Date/Time, Price, Change, Change %, Volume, Exchange, Buyer, Seller
      const tables = document.querySelectorAll('table');
      let tradeData: any[] = [];
      
      for (const table of tables) {
        const rows = table.querySelectorAll('tbody tr');
        if (rows.length === 0) continue;
        
        rows.forEach((row, index) => {
          if (index > 50) return; // Get up to 50 trades
          
          const cells = row.querySelectorAll('td');
          
          // TMX has 8 columns: Date/Time, Price, Change, Change%, Volume, Exchange, Buyer, Seller
          if (cells.length >= 7) {
            const dateTimeText = cells[0]?.textContent?.trim() || '';
            const priceText = cells[1]?.textContent?.trim() || '';
            const changeText = cells[2]?.textContent?.trim() || '';
            const changePercentText = cells[3]?.textContent?.trim() || '';
            const volumeText = cells[4]?.textContent?.trim() || '';
            const exchangeText = cells[5]?.textContent?.trim() || '';
            const buyerText = cells[6]?.textContent?.trim() || '';
            const sellerText = cells[7]?.textContent?.trim() || '';
            
            // Clean and parse the data
            const price = parseFloat(priceText.replace(/[$,]/g, ''));
            const volume = parseInt(volumeText.replace(/,/g, ''));
            const change = changeText === '-' ? 0 : parseFloat(changeText.replace(/[$,]/g, ''));
            const changePercent = changePercentText === '-' ? 0 : parseFloat(changePercentText.replace(/[%,]/g, ''));
            
            if (dateTimeText && !isNaN(price) && !isNaN(volume)) {
              tradeData.push({
                time: dateTimeText,
                price: price,
                volume: volume,
                change: change,
                changePercent: changePercent,
                exchange: exchangeText || 'TSXV',
                buyer: buyerText || 'N/A',
                seller: sellerText || 'N/A',
                priceFormatted: priceText,
                volumeFormatted: volumeText.includes(',') ? volumeText : volume.toLocaleString()
              });
            }
          }
        });
        
        if (tradeData.length > 0) break; // Found trades, stop looking
      }
      
      return tradeData;
    });
    
    await browser.close();
    
    if (trades.length > 0) {
      return NextResponse.json({
        trades: trades,
        lastUpdate: new Date().toISOString(),
        success: true
      });
    } else {
      // No trades found
      return NextResponse.json({
        trades: [],
        lastUpdate: new Date().toISOString(),
        success: false,
        message: 'No trade data found - market may be closed or no recent trades'
      });
    }
    
  } catch (error) {
    console.error('Error fetching trade history:', error);
    
    if (browser) {
      await browser.close();
    }
    
    return NextResponse.json({
      trades: [],
      error: 'Failed to fetch trade history',
      success: false
    });
  }
}