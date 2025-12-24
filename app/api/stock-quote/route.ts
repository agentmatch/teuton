import { NextResponse } from 'next/server'

// Try direct TMX data access first
async function fetchDirectTMX() {
  console.log('[TMX API] Starting direct TMX data fetch...');
  
  try {
    // Option 1: Try TMX GraphQL endpoint
    console.log('[TMX GraphQL] Attempting to fetch from GraphQL endpoint...');
    const graphqlResponse = await fetch('https://app-money.tmx.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://money.tmx.com/',
        'Origin': 'https://money.tmx.com'
      },
      body: JSON.stringify({
        query: `
          query getQuoteBySymbol($symbol: String!, $locale: String) {
            getQuoteBySymbol(symbol: $symbol, locale: $locale) {
              symbol
              name
              price
              priceChange
              percentChange
              exchangeName
              volume
              openPrice
              dayHigh
              dayLow
              MarketCap
              prevClose
              dividendFrequency
            }
          }
        `,
        variables: {
          symbol: "TUO",
          locale: "en"
        }
      })
    });

    console.log('[TMX GraphQL] Response status:', graphqlResponse.status);
    
    if (graphqlResponse.ok) {
      const data = await graphqlResponse.json();
      console.log('[TMX GraphQL] Raw response data:', JSON.stringify(data, null, 2));
      
      if (data.data && data.data.getQuoteBySymbol) {
        const quote = data.data.getQuoteBySymbol;
        console.log('[TMX GraphQL] Quote data received:', JSON.stringify(quote, null, 2));
        
        const response: any = {
          symbol: 'TSX-V: TUO',
          timestamp: new Date().toISOString()
        };
        
        // Only include actual data from the API
        if (quote.price !== null && quote.price !== undefined) {
          response.price = quote.price;
          console.log('[TMX GraphQL] Price found:', quote.price);
        }
        if (quote.priceChange !== null && quote.priceChange !== undefined) {
          response.change = quote.priceChange;
          console.log('[TMX GraphQL] Price change found:', quote.priceChange);
        }
        if (quote.percentChange !== null && quote.percentChange !== undefined) {
          response.changePercent = quote.percentChange;
          console.log('[TMX GraphQL] Percent change found:', quote.percentChange);
        }
        if (quote.volume !== null && quote.volume !== undefined) {
          response.volume = formatVolume(quote.volume);
          console.log('[TMX GraphQL] Volume found:', quote.volume, '-> formatted:', response.volume);
        }
        if (quote.dayHigh !== null && quote.dayHigh !== undefined) {
          response.high = quote.dayHigh;
          console.log('[TMX GraphQL] Day high found:', quote.dayHigh);
        }
        if (quote.dayLow !== null && quote.dayLow !== undefined) {
          response.low = quote.dayLow;
          console.log('[TMX GraphQL] Day low found:', quote.dayLow);
        }
        if (quote.openPrice !== null && quote.openPrice !== undefined) {
          response.open = quote.openPrice;
          console.log('[TMX GraphQL] Open price found:', quote.openPrice);
        }
        if (quote.prevClose !== null && quote.prevClose !== undefined) {
          response.previousClose = quote.prevClose;
          console.log('[TMX GraphQL] Previous close found:', quote.prevClose);
        }
        if (quote.MarketCap !== null && quote.MarketCap !== undefined) {
          response.marketCap = `$${(quote.MarketCap / 1000000).toFixed(1)}M`;
          console.log('[TMX GraphQL] Market cap found:', quote.MarketCap, '-> formatted:', response.marketCap);
        }
        
        console.log('[TMX GraphQL] Final response object:', JSON.stringify(response, null, 2));
        return response;
      } else {
        console.log('[TMX GraphQL] No quote data in response');
      }
    } else {
      console.log('[TMX GraphQL] Response not OK. Status:', graphqlResponse.status);
      const errorText = await graphqlResponse.text();
      console.log('[TMX GraphQL] Error response:', errorText);
    }
  } catch (error) {
    console.log('[TMX GraphQL] GraphQL fetch failed:', error);
  }

  // Option 2: Try Yahoo Finance as backup (often has Canadian stocks)
  console.log('[Yahoo Finance] Attempting Yahoo Finance as backup...');
  try {
    const yahooResponse = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/TUO.V', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log('[Yahoo Finance] Response status:', yahooResponse.status);
    
    if (yahooResponse.ok) {
      const data = await yahooResponse.json();
      console.log('[Yahoo Finance] Raw response data:', JSON.stringify(data, null, 2));
      
      if (data.chart && data.chart.result && data.chart.result[0]) {
        const result = data.chart.result[0];
        const quote = result.indicators.quote[0];
        const meta = result.meta;
        
        console.log('[Yahoo Finance] Meta data:', JSON.stringify(meta, null, 2));
        console.log('[Yahoo Finance] Quote indicators:', JSON.stringify(quote, null, 2));
        
        const response: any = {
          symbol: 'TSX-V: TUO',
          timestamp: new Date().toISOString()
        };
        
        // Only include actual data from Yahoo
        if (meta.regularMarketPrice) {
          response.price = meta.regularMarketPrice;
          console.log('[Yahoo Finance] Regular market price found:', meta.regularMarketPrice);
        } else if (quote.close && quote.close.length > 0) {
          const lastClose = quote.close[quote.close.length - 1];
          if (lastClose !== null) {
            response.price = lastClose;
            console.log('[Yahoo Finance] Using last close price:', lastClose);
          }
        }
        
        if (meta.previousClose && response.price) {
          response.previousClose = meta.previousClose;
          response.change = response.price - meta.previousClose;
          response.changePercent = (response.change / meta.previousClose) * 100;
          console.log('[Yahoo Finance] Previous close:', meta.previousClose, 'Change:', response.change, 'Change %:', response.changePercent);
        }
        
        if (quote.volume && quote.volume.length > 0) {
          const lastVolume = quote.volume[quote.volume.length - 1];
          if (lastVolume !== null) {
            response.volume = formatVolume(lastVolume);
            console.log('[Yahoo Finance] Volume found:', lastVolume, '-> formatted:', response.volume);
          }
        }
        
        if (quote.high && quote.high.length > 0) {
          const validHighs = quote.high.filter((h: number | null) => h !== null) as number[];
          if (validHighs.length > 0) {
            response.high = Math.max(...validHighs);
            console.log('[Yahoo Finance] High found:', response.high, 'from', validHighs.length, 'valid highs');
          }
        }
        
        if (quote.low && quote.low.length > 0) {
          const validLows = quote.low.filter((l: number | null) => l !== null) as number[];
          if (validLows.length > 0) {
            response.low = Math.min(...validLows);
            console.log('[Yahoo Finance] Low found:', response.low, 'from', validLows.length, 'valid lows');
          }
        }
        
        console.log('[Yahoo Finance] Final response object:', JSON.stringify(response, null, 2));
        return response;
      } else {
        console.log('[Yahoo Finance] No chart data in response');
      }
    } else {
      console.log('[Yahoo Finance] Response not OK');
      const errorText = await yahooResponse.text();
      console.log('[Yahoo Finance] Error response:', errorText);
    }
  } catch (error) {
    console.log('[Yahoo Finance] Yahoo Finance fetch failed:', error);
  }

  return null;
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
}

export async function GET() {
  console.log('[Stock Quote API] Starting stock quote fetch...');
  
  // First try direct API access
  const directData = await fetchDirectTMX();
  if (directData) {
    console.log('[Stock Quote API] Direct API data obtained, returning:', JSON.stringify(directData, null, 2));
    return NextResponse.json(directData);
  }

  console.log('[Stock Quote API] Direct API failed, falling back to Puppeteer scraping...');
  
  // If direct access fails, fall back to Puppeteer scraping
  let browser;
  try {
    const puppeteer = await import('puppeteer');
    console.log('[Puppeteer] Launching browser...');
    browser = await puppeteer.default.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    console.log('[Puppeteer] Navigating to TMX page: https://money.tmx.com/en/quote/TUO');
    await page.goto('https://money.tmx.com/en/quote/TUO', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for content to load
    console.log('[Puppeteer] Waiting 3 seconds for content to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract comprehensive stock data from the page
    const stockData = await page.evaluate(() => {
      const text = document.body.innerText;
      console.log('[Page] Full page text length:', text.length);
      
      // Create a debug object to track what we find
      const debug: any = {
        fullText: text.substring(0, 1000) + '...[truncated]',
        matches: {}
      };
      
      // Extract price (format: Price:$0.20)
      const priceMatch = text.match(/Price:\$([0-9.]+)/);
      debug.matches.priceMatch = priceMatch ? priceMatch[0] : 'No match';
      const price = priceMatch ? parseFloat(priceMatch[1]) : null;
      
      // Extract change and percentage (format: -0.02 ( -9.091% ))
      const changeMatch = text.match(/(-?\d+\.\d+)\s*\(\s*(-?\d+\.\d+)%\s*\)/);
      debug.matches.changeMatch = changeMatch ? changeMatch[0] : 'No match';
      const change = changeMatch ? parseFloat(changeMatch[1]) : null;
      const changePercent = changeMatch ? parseFloat(changeMatch[2]) : null;
      
      // Extract volume (format: Volume:47.16K)
      const volumeMatch = text.match(/Volume:([\d,]+|\d+\.?\d*[KMB]?)/);
      debug.matches.volumeMatch = volumeMatch ? volumeMatch[0] : 'No match';
      const volume = volumeMatch ? volumeMatch[1] : null;
      
      // Extract high/low (format: Day High/Low 0.22/0.115)
      const highLowMatch = text.match(/Day High\/Low\s*(\d+\.?\d*)\/(\d+\.?\d*)/);
      debug.matches.highLowMatch = highLowMatch ? highLowMatch[0] : 'No match';
      const high = highLowMatch ? parseFloat(highLowMatch[1]) : null;
      const low = highLowMatch ? parseFloat(highLowMatch[2]) : null;
      
      // Extract 52 week high/low
      const weekHighLowMatch = text.match(/52 Week High\/Low\s*(\d+\.?\d*)\/(\d+\.?\d*)/);
      debug.matches.weekHighLowMatch = weekHighLowMatch ? weekHighLowMatch[0] : 'No match';
      const weekHigh52 = weekHighLowMatch ? parseFloat(weekHighLowMatch[1]) : null;
      const weekLow52 = weekHighLowMatch ? parseFloat(weekHighLowMatch[2]) : null;
      
      // Extract open
      const openMatch = text.match(/Open\s*(\d+\.?\d*)/);
      debug.matches.openMatch = openMatch ? openMatch[0] : 'No match';
      const open = openMatch ? parseFloat(openMatch[1]) : null;
      
      // Extract close
      const closeMatch = text.match(/Close\s*(\d+\.?\d*)/);
      debug.matches.closeMatch = closeMatch ? closeMatch[0] : 'No match';
      const close = closeMatch ? parseFloat(closeMatch[1]) : null;
      
      // Extract previous close
      const prevCloseMatch = text.match(/Prev\.\s*Close\s*(\d+\.?\d*)/);
      debug.matches.prevCloseMatch = prevCloseMatch ? prevCloseMatch[0] : 'No match';
      const previousClose = prevCloseMatch ? parseFloat(prevCloseMatch[1]) : null;
      
      // Extract market cap (format: Market Cap 3,849,792)
      const marketCapMatch = text.match(/Market Cap\s*([\d,]+)/);
      debug.matches.marketCapMatch = marketCapMatch ? marketCapMatch[0] : 'No match';
      const marketCap = marketCapMatch ? marketCapMatch[1] : null;
      
      // Extract market cap all classes
      const marketCapAllMatch = text.match(/Market Cap \(All Classes\)\s*([\d,]+)/);
      debug.matches.marketCapAllMatch = marketCapAllMatch ? marketCapAllMatch[0] : 'No match';
      const marketCapAllClasses = marketCapAllMatch ? marketCapAllMatch[1] : null;
      
      // Extract consolidated volume
      const consolidatedVolMatch = text.match(/Consolidated Volume\s*([\d,]+|\d+\.?\d*[KMB]?)/);
      debug.matches.consolidatedVolMatch = consolidatedVolMatch ? consolidatedVolMatch[0] : 'No match';
      const consolidatedVolume = consolidatedVolMatch ? consolidatedVolMatch[1] : null;
      
      // Extract listed shares outstanding
      const listedSharesMatch = text.match(/Listed Shares Out\s*([\d,]+)/);
      debug.matches.listedSharesMatch = listedSharesMatch ? listedSharesMatch[0] : 'No match';
      const listedSharesOut = listedSharesMatch ? parseInt(listedSharesMatch[1].replace(/,/g, '')) : null;
      
      // Extract total shares all classes
      const totalSharesMatch = text.match(/Total Shares \(All Classes\)\s*([\d,]+)/);
      debug.matches.totalSharesMatch = totalSharesMatch ? totalSharesMatch[0] : 'No match';
      const totalSharesAllClasses = totalSharesMatch ? parseInt(totalSharesMatch[1].replace(/,/g, '')) : null;
      
      // Let's also try to find any text containing these keywords to debug
      debug.textSnippets = {
        priceArea: text.match(/.{0,50}Price.{0,50}/i)?.[0] || 'Not found',
        volumeArea: text.match(/.{0,50}Volume.{0,50}/i)?.[0] || 'Not found',
        openArea: text.match(/.{0,50}Open.{0,50}/i)?.[0] || 'Not found',
        closeArea: text.match(/.{0,50}Close.{0,50}/i)?.[0] || 'Not found',
        highLowArea: text.match(/.{0,50}High\/Low.{0,50}/i)?.[0] || 'Not found',
        marketCapArea: text.match(/.{0,50}Market Cap.{0,50}/i)?.[0] || 'Not found',
      };
      
      return {
        symbol: 'TSX-V: TUO',
        price,
        change,
        changePercent,
        volume,
        high,
        low,
        open,
        close,
        previousClose,
        weekHigh52,
        weekLow52,
        marketCap,
        marketCapAllClasses,
        consolidatedVolume,
        listedSharesOut,
        totalSharesAllClasses,
        timestamp: new Date().toISOString(),
        debug
      };
    });
    
    // Log the debug information
    console.log('[Puppeteer] Debug info from page evaluation:');
    console.log('[Puppeteer] Matches found:', JSON.stringify(stockData.debug.matches, null, 2));
    console.log('[Puppeteer] Text snippets around keywords:', JSON.stringify(stockData.debug.textSnippets, null, 2));
    console.log('[Puppeteer] First 1000 chars of page text:', stockData.debug.fullText);
    
    // Remove debug info before sending response
    const { debug, ...cleanStockData } = stockData;
    
    await browser.close();
    
    // Return only the data that was actually found on TMX
    const response: any = {
      symbol: cleanStockData.symbol,
      timestamp: cleanStockData.timestamp
    };
    
    // Only include fields that have actual values from TMX
    console.log('[Puppeteer] Building response with extracted data:');
    if (cleanStockData.price !== null) {
      response.price = cleanStockData.price;
      console.log('[Puppeteer] - Price:', cleanStockData.price);
    }
    if (cleanStockData.change !== null) {
      response.change = cleanStockData.change;
      console.log('[Puppeteer] - Change:', cleanStockData.change);
    }
    if (cleanStockData.changePercent !== null) {
      response.changePercent = cleanStockData.changePercent;
      console.log('[Puppeteer] - Change %:', cleanStockData.changePercent);
    }
    if (cleanStockData.volume !== null) {
      response.volume = cleanStockData.volume;
      console.log('[Puppeteer] - Volume:', cleanStockData.volume);
    }
    if (cleanStockData.high !== null) {
      response.high = cleanStockData.high;
      console.log('[Puppeteer] - High:', cleanStockData.high);
    }
    if (cleanStockData.low !== null) {
      response.low = cleanStockData.low;
      console.log('[Puppeteer] - Low:', cleanStockData.low);
    }
    if (cleanStockData.open !== null) {
      response.open = cleanStockData.open;
      console.log('[Puppeteer] - Open:', cleanStockData.open);
    }
    if (cleanStockData.close !== null) {
      response.close = cleanStockData.close;
      console.log('[Puppeteer] - Close:', cleanStockData.close);
    }
    if (cleanStockData.previousClose !== null) {
      response.previousClose = cleanStockData.previousClose;
      console.log('[Puppeteer] - Previous Close:', cleanStockData.previousClose);
    }
    if (cleanStockData.weekHigh52 !== null) {
      response.weekHigh52 = cleanStockData.weekHigh52;
      console.log('[Puppeteer] - 52 Week High:', cleanStockData.weekHigh52);
    }
    if (cleanStockData.weekLow52 !== null) {
      response.weekLow52 = cleanStockData.weekLow52;
      console.log('[Puppeteer] - 52 Week Low:', cleanStockData.weekLow52);
    }
    if (cleanStockData.marketCap !== null) {
      response.marketCap = cleanStockData.marketCap;
      console.log('[Puppeteer] - Market Cap:', cleanStockData.marketCap);
    }
    if (cleanStockData.marketCapAllClasses !== null) {
      response.marketCapAllClasses = cleanStockData.marketCapAllClasses;
      console.log('[Puppeteer] - Market Cap All Classes:', cleanStockData.marketCapAllClasses);
    }
    if (cleanStockData.consolidatedVolume !== null) {
      response.consolidatedVolume = cleanStockData.consolidatedVolume;
      console.log('[Puppeteer] - Consolidated Volume:', cleanStockData.consolidatedVolume);
    }
    if (cleanStockData.listedSharesOut !== null) {
      response.listedSharesOut = cleanStockData.listedSharesOut;
      console.log('[Puppeteer] - Listed Shares Out:', cleanStockData.listedSharesOut);
    }
    if (cleanStockData.totalSharesAllClasses !== null) {
      response.totalSharesAllClasses = cleanStockData.totalSharesAllClasses;
      console.log('[Puppeteer] - Total Shares All Classes:', cleanStockData.totalSharesAllClasses);
    }
    
    console.log('[Puppeteer] Final response object:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('[Puppeteer] Error fetching TMX data:', error);
    console.error('[Puppeteer] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return error response with no fake data
    return NextResponse.json({
      symbol: 'TSX-V: TUO',
      timestamp: new Date().toISOString(),
      error: 'Unable to fetch stock data'
    });
  } finally {
    if (browser) {
      console.log('[Puppeteer] Closing browser...');
      await browser.close();
    }
  }
}