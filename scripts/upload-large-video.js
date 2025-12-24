#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'ramvideos';

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

async function uploadLargeFile(localPath, remotePath) {
  try {
    console.log(`📤 Uploading large file: ${localPath} -> ${remotePath}`);
    
    // Get file stats
    const stats = fs.statSync(localPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 File size: ${fileSizeMB} MB`);
    
    // Create a read stream instead of loading entire file into memory
    const fileStream = fs.createReadStream(localPath);
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: remotePath,
      Body: fileStream,
      ContentType: 'video/webm',
      ContentLength: stats.size,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    console.log('⏳ Starting upload... This may take several minutes for large files.');
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

async function main() {
  console.log('🚀 Uploading large video file to Cloudflare R2...\n');
  
  // Check if credentials are configured
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('❌ Missing Cloudflare R2 credentials!');
    process.exit(1);
  }

  const localPath = path.join(__dirname, '..', 'public/images/ramdrone1.webm');
  const remotePath = 'videos/ramdrone1.webm';
  
  // Check if file exists
  if (!fs.existsSync(localPath)) {
    console.log(`❌ File not found: ${localPath}`);
    process.exit(1);
  }
  
  const result = await uploadLargeFile(localPath, remotePath);
  
  if (result.success) {
    console.log('\n🎉 Large video upload completed successfully!');
    console.log(`\n🔗 All drone video URLs:`);
    console.log(`  ramdrone1.webm: https://pub-${R2_ACCOUNT_ID}.r2.dev/videos/ramdrone1.webm`);
    console.log(`  ramdrone2.webm: https://pub-${R2_ACCOUNT_ID}.r2.dev/videos/ramdrone2.webm`);
  } else {
    console.log('\n❌ Large video upload failed.');
    process.exit(1);
  }
}

// Run the upload process
main().catch(console.error);