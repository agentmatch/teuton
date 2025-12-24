#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Cloudflare R2 Configuration
// You'll need to set these environment variables or update them directly
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'silvergrail-videos';

// Cloudflare R2 endpoint
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// Configure S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Video files to upload
const videoFiles = [
  { local: 'public/images/ramdrone1.webm', remote: 'videos/ramdrone1.webm' },
  { local: 'public/images/ramdrone2.webm', remote: 'videos/ramdrone2.webm' },
  { local: 'public/images/ramdrone1thumb.webm', remote: 'videos/ramdrone1thumb.webm' },
  { local: 'public/images/ramdrone1thumb3.webm', remote: 'videos/ramdrone1thumb3.webm' },
];

async function uploadFile(localPath, remotePath) {
  try {
    console.log(`📤 Uploading ${localPath} -> ${remotePath}`);
    
    const fileContent = fs.readFileSync(localPath);
    const fileSizeMB = (fileContent.length / (1024 * 1024)).toFixed(2);
    
    console.log(`📊 File size: ${fileSizeMB} MB`);
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: remotePath,
      Body: fileContent,
      ContentType: 'video/webm',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    const result = await r2Client.send(uploadCommand);
    console.log(`✅ Successfully uploaded ${remotePath}`);
    
    // Generate the public URL
    const publicUrl = `https://pub-${R2_ACCOUNT_ID}.r2.dev/${remotePath}`;
    console.log(`🔗 Public URL: ${publicUrl}`);
    
    return { success: true, url: publicUrl };
    
  } catch (error) {
    console.error(`❌ Error uploading ${localPath}:`, error);
    return { success: false, error: error.message };
  }
}

async function uploadAllVideos() {
  console.log('🚀 Starting video upload to Cloudflare R2...\n');
  
  // Check if credentials are configured
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('❌ Missing Cloudflare R2 credentials!');
    console.log('Please set the following environment variables:');
    console.log('  CLOUDFLARE_ACCOUNT_ID');
    console.log('  CLOUDFLARE_R2_ACCESS_KEY_ID'); 
    console.log('  CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    console.log('  CLOUDFLARE_R2_BUCKET_NAME (optional, defaults to "silvergrail-videos")');
    console.log('\nYou can add these to your .env.local file.');
    process.exit(1);
  }

  const results = [];
  
  for (const file of videoFiles) {
    const fullLocalPath = path.join(__dirname, '..', file.local);
    
    // Check if file exists
    if (!fs.existsSync(fullLocalPath)) {
      console.log(`⚠️  File not found: ${fullLocalPath}`);
      continue;
    }
    
    const result = await uploadFile(fullLocalPath, file.remote);
    results.push({
      local: file.local,
      remote: file.remote,
      ...result
    });
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📋 Upload Summary:');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful uploads: ${successful.length}`);
  console.log(`❌ Failed uploads: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n🔗 Public URLs:');
    successful.forEach(result => {
      console.log(`  ${result.local} -> ${result.url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed uploads:');
    failed.forEach(result => {
      console.log(`  ${result.local}: ${result.error}`);
    });
  }
  
  console.log('\n🎉 Upload process completed!');
}

// Run the upload process
uploadAllVideos().catch(console.error);