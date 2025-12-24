// Test the news formatting logic
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
  let result = content
    // Remove WordPress comments and blocks
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '')
    
    // Handle the special tagline paragraph (first paragraph with date/company info)
    .replace(/<p><strong>([^<]+)<\/strong>([^<]*)<\/p>/g, function(match, strongContent, afterStrong) {
      console.log('Found strong paragraph:', strongContent);
      console.log('After strong:', afterStrong);
      
      // Check if this contains a date pattern (location + date paragraph)
      if (strongContent.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i)) {
        console.log('Found date pattern!');
        
        // Extract just the location (before the date)
        const locationMatch = strongContent.match(/^([^,]+,\s*[^,]+,\s*[^,]+)(?:,\s*)?(?:January|February|March|April|May|June|July|August|September|October|November|December)/i)
        if (locationMatch) {
          const location = locationMatch[1].trim()
          console.log('Extracted location:', location);
          
          // Get the content after the date pattern
          const afterDateMatch = strongContent.match(/\d{4}\.\s*(?:&nbsp;)?\s*(.+)$/i)
          const companyText = afterDateMatch ? afterDateMatch[1] : ''
          console.log('Company text:', companyText);
          
          // Combine location with em dash and the rest
          return '\n\n📅LOCATION:' + location + '|||' + companyText + ' ' + afterStrong + '\n'
        }
        // Fallback - mark the whole thing
        return '\n\n📅 ' + strongContent + ' ' + afterStrong + '\n'
      }
      // Otherwise return unchanged
      return match
    });
    
  return result;
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
console.log(cleaned.substring(0, 500));