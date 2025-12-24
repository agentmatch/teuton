#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'ramvideos';

// Paths
const CHUNKS_DIR = path.join(__dirname, '..', 'public/temp-chunks');
const MANIFEST_PATH = path.join(CHUNKS_DIR, 'ramdrone1-manifest.json');

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

async function checkExistingChunks() {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: 'videos/ramdrone1/',
    });
    
    const response = await r2Client.send(listCommand);
    const existingFiles = response.Contents?.map(obj => obj.Key) || [];
    
    console.log('🔍 Checking existing uploads...');
    console.log(`📋 Found ${existingFiles.length} existing files:`);
    existingFiles.forEach(file => console.log(`  ✅ ${file}`));
    
    return existingFiles;
  } catch (error) {
    console.log('⚠️  Could not check existing files:', error.message);
    return [];
  }
}

async function uploadSingleChunk(chunkIndex) {
  console.log(`🚀 Starting upload for chunk ${chunkIndex}...\n`);
  
  // Check if credentials are configured
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('❌ Missing Cloudflare R2 credentials!');
    process.exit(1);
  }

  // Check if manifest exists
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifest file not found: ${MANIFEST_PATH}`);
    console.log('Run "npm run split-video" first to create chunks.');
    process.exit(1);
  }

  // Load manifest
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  console.log(`📋 Loaded manifest: ${manifest.numChunks} total chunks`);
  
  if (chunkIndex >= manifest.numChunks) {
    console.error(`❌ Chunk index ${chunkIndex} out of range (0-${manifest.numChunks - 1})`);
    process.exit(1);
  }

  // Check existing uploads
  const existingFiles = await checkExistingChunks();
  
  const chunk = manifest.chunks[chunkIndex];
  const chunkPath = path.join(CHUNKS_DIR, chunk.filename);
  const remotePath = `videos/ramdrone1/${chunk.filename}`;
  
  // Check if already uploaded
  if (existingFiles.includes(remotePath)) {
    console.log(`✅ Chunk ${chunkIndex} already uploaded: ${chunk.filename}`);
    console.log(`🔗 URL: https://pub-${R2_ACCOUNT_ID}.r2.dev/${remotePath}`);
    return;
  }
  
  if (!fs.existsSync(chunkPath)) {
    console.error(`❌ Chunk file not found: ${chunkPath}`);
    process.exit(1);
  }
  
  try {
    const fileContent = fs.readFileSync(chunkPath);
    const fileSizeMB = (fileContent.length / (1024 * 1024)).toFixed(2);
    
    console.log(`📤 Uploading ${chunk.filename} (${fileSizeMB} MB)`);
    console.log(`⏳ This may take several minutes...`);
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: remotePath,
      Body: fileContent,
      ContentType: 'application/octet-stream',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    const startTime = Date.now();
    await r2Client.send(uploadCommand);
    const uploadTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    const publicUrl = `https://pub-${R2_ACCOUNT_ID}.r2.dev/${remotePath}`;
    console.log(`✅ Successfully uploaded in ${uploadTime}s: ${publicUrl}`);
    
    // Show progress
    const uploadedCount = existingFiles.filter(f => f.startsWith('videos/ramdrone1/ramdrone1-chunk-')).length + 1;
    const progress = ((uploadedCount / manifest.numChunks) * 100).toFixed(1);
    console.log(`📊 Overall Progress: ${progress}% (${uploadedCount}/${manifest.numChunks} chunks)`);
    
  } catch (error) {
    console.error(`❌ Error uploading chunk ${chunkIndex}:`, error.message);
    process.exit(1);
  }
}

// Get chunk index from command line argument
const chunkIndex = process.argv[2] ? parseInt(process.argv[2]) : 0;

if (isNaN(chunkIndex) || chunkIndex < 0) {
  console.error('❌ Please provide a valid chunk index (0-4)');
  console.log('Usage: node upload-single-chunk.js <chunk-index>');
  console.log('Example: node upload-single-chunk.js 0');
  process.exit(1);
}

// Run the upload process
uploadSingleChunk(chunkIndex).catch(console.error);