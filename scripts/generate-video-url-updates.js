#!/usr/bin/env node

// This script generates the find/replace patterns needed to update video URLs
// in components after uploading to Cloudflare R2

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'silvergrail-videos';

console.log('🔄 Video URL Update Patterns');
console.log('============================');

if (!ACCOUNT_ID) {
  console.log('⚠️  CLOUDFLARE_ACCOUNT_ID not set in environment variables.');
  console.log('Using placeholder: your-account-id\n');
}

const baseUrl = ACCOUNT_ID 
  ? `https://pub-${ACCOUNT_ID}.r2.dev`
  : 'https://pub-your-account-id.r2.dev';

const videoUpdates = [
  {
    description: 'Main drone video #1',
    find: '/images/ramdrone1.webm',
    replace: `${baseUrl}/videos/ramdrone1.webm`
  },
  {
    description: 'Main drone video #2', 
    find: '/images/ramdrone2.webm',
    replace: `${baseUrl}/videos/ramdrone2.webm`
  },
  {
    description: 'Thumbnail video (legacy)',
    find: '/images/ramdrone1thumb.webm', 
    replace: `${baseUrl}/videos/ramdrone1thumb.webm`
  },
  {
    description: 'Alternative thumbnail video',
    find: '/images/ramdrone1thumb3.webm',
    replace: `${baseUrl}/videos/ramdrone1thumb3.webm`
  }
];

videoUpdates.forEach((update, index) => {
  console.log(`${index + 1}. ${update.description}`);
  console.log(`   Find: "${update.find}"`);
  console.log(`   Replace: "${update.replace}"`);
  console.log('');
});

console.log('📝 Files to update:');
console.log('   - components/landing/SatellitePropertyMap.tsx');
console.log('   - Any other components that reference these video files');
console.log('');

console.log('🔧 After uploading videos to R2:');
console.log('1. Use find/replace in your editor with the patterns above');
console.log('2. Test video loading in development');
console.log('3. Deploy and verify videos load from CDN');
console.log('4. Consider deleting local video files to save space');
console.log('');

console.log('💡 Pro tip: Videos will load faster from Cloudflare CDN!');

// If we have the account ID, also generate a ready-to-use sed command
if (ACCOUNT_ID) {
  console.log('\n🤖 Automated replacement command:');
  videoUpdates.forEach(update => {
    console.log(`sed -i '' 's|${update.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${update.replace}|g' components/landing/SatellitePropertyMap.tsx`);
  });
}