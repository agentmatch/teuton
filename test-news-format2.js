// Test the news formatting logic with the actual HTML structure
const testContent = `<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Porphyry style copper-gold mineralization identified (2024) in surface zone 150m wide by 450m long</strong></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Gold grades up to 7.01 g/t and copper up to 8.24% in separate VMS system</strong></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>Victoria, British Columbia, Canada, August 26, 2025. &nbsp;Silver Grail Resources Ltd. &nbsp;("Silver Grail" or "the Company") ("SVG"-TSX-V) ) </strong>announces it is currently drilling targets at its Ram property in British Columbia's Golden Triangle, focusing on two newly discovered (2024) mineralized zones that exhibit characteristics of both porphyry copper-gold and VMS (volcanogenic massive sulfide) systems.&nbsp; The Ram is jointly owned with Teuton Resources Corp.&nbsp; Following the conclusion of the drill program at the Ram, an IP geophysical survey at the Clone property is tentatively scheduled for September, should weather and personnel conditions allow.&nbsp; [Refer to the end of the release for URLs for various maps].<strong></strong></p>
<!-- /wp:paragraph -->`;

function cleanContent(content) {
  // First, handle the malformed paragraph with strong tags inside
  let fixedContent = content
    // Match paragraphs that contain a strong tag with location/date info
    .replace(/<p><strong>([^<]*?(?:Victoria|Vancouver|Toronto)[^<]*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}[^<]*?)<\/strong>([^]*?)<\/p>/gi, 
      function(match, strongContent, afterStrong) {
        console.log('Found strong paragraph!');
        console.log('Strong content:', strongContent);
        console.log('After strong:', afterStrong);
        
        // Extract location (before the date)
        const locationMatch = strongContent.match(/^([^,]+,\s*[^,]+,\s*[^,]+)(?:,\s*)?(?:January|February|March|April|May|June|July|August|September|October|November|December)/i)
        if (locationMatch) {
          const location = locationMatch[1].trim()
          console.log('Extracted location:', location);
          
          // Get everything after the year and period
          const afterDateMatch = strongContent.match(/\d{4}\.\s*(?:&nbsp;)?(.*)$/s)
          const restOfContent = afterDateMatch ? afterDateMatch[1].trim() : ''
          console.log('Rest of content:', restOfContent);
          
          // Combine the content after strong tag with the rest
          const fullContent = (restOfContent + ' ' + afterStrong).replace(/&nbsp;/g, ' ').trim()
          console.log('Full content:', fullContent);
          
          // Return with our special marker
          return '<p>📅LOCATION:' + location + '|||' + fullContent + '</p>'
        }
        return match
      })
    
  // Remove WordPress comments
  .replace(/<!-- wp:[^>]*-->/g, '')
  .replace(/<!-- \/wp:[^>]*-->/g, '')
  
  return fixedContent;
}

// Test removing the initial list
function removeInitialList(content) {
  const initialListMatch = content.match(/^<!-- wp:list -->.*?<!-- \/wp:list -->/s)
  if (initialListMatch) {
    console.log('Found initial list to remove');
    return content.replace(initialListMatch[0], '').trim()
  }
  return content;
}

console.log('=== TESTING NEWS FORMATTING ===\n');

// Test removing initial list
const withoutList = removeInitialList(testContent);
console.log('After removing list:', withoutList.substring(0, 200));

// Test cleaning content
const cleaned = cleanContent(withoutList);
console.log('\n=== CLEANED CONTENT ===');
console.log(cleaned);