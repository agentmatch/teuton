const fs = require('fs');
const path = require('path');

// Read the news data
const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'news.json'), 'utf-8'));

// Test the formatting on a few releases
const testReleases = newsData.slice(0, 5);

console.log('Testing news release formatting...\n');

testReleases.forEach((release, index) => {
  console.log(`\n========== Release ${index + 1}: ${release.title} ==========`);
  console.log(`Date: ${release.dateString}`);
  console.log(`Category: ${release.category}`);
  
  // Check for common issues
  const content = release.content;
  
  // Check if date appears in content
  const datePattern = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi;
  const datesInContent = content.match(datePattern);
  if (datesInContent) {
    console.log(`⚠️  Date found in content: ${datesInContent[0]}`);
  } else {
    console.log(`✅ Date removed from content`);
  }
  
  // Check for location pattern
  const locationPattern = /(?:Victoria|Vancouver|Toronto|Calgary|Montreal|Ottawa|Edmonton|Winnipeg|Halifax|Stewart)[^<]*?(?:British Columbia|BC|B\.C\.|Ontario|ON|Alberta|AB|Quebec|QC|Manitoba|MB|Nova Scotia|NS|Canada)/gi;
  const locationMatch = content.match(locationPattern);
  if (locationMatch) {
    console.log(`✅ Location found: ${locationMatch[0]}`);
  } else {
    console.log(`⚠️  No location found`);
  }
  
  // Check for WordPress artifacts
  const wpPattern = /<!-- wp:[^>]*-->/g;
  const wpArtifacts = content.match(wpPattern);
  if (wpArtifacts) {
    console.log(`⚠️  WordPress artifacts found: ${wpArtifacts.length} instances`);
  } else {
    console.log(`✅ No WordPress artifacts`);
  }
  
  // Check for HTML tags with inline styles
  const stylePattern = /style="[^"]*"/g;
  const styleInstances = content.match(stylePattern);
  if (styleInstances) {
    console.log(`ℹ️  Inline styles found: ${styleInstances.length} instances`);
  } else {
    console.log(`✅ No inline styles`);
  }
  
  // Check for bold/strong tags in first paragraph
  const firstParagraph = content.match(/<p>.*?<\/p>/s);
  if (firstParagraph) {
    const hasBold = firstParagraph[0].includes('<strong>') || firstParagraph[0].includes('<b>');
    if (hasBold) {
      console.log(`ℹ️  Bold text in first paragraph`);
    } else {
      console.log(`✅ No bold in first paragraph`);
    }
  }
  
  // Check for links
  const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>/g;
  const links = [...content.matchAll(linkPattern)];
  if (links.length > 0) {
    console.log(`ℹ️  Links found: ${links.length}`);
    const uniqueLinks = new Set(links.map(l => l[1]));
    console.log(`   Unique links: ${uniqueLinks.size}`);
  }
});

console.log('\n========== Summary ==========');
console.log(`Total releases tested: ${testReleases.length}`);
console.log('\nNote: The formatting will be applied when viewed in the browser.');
console.log('This test checks the raw data to identify issues to be fixed by the cleanContent function.');