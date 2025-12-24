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

async function uploadChunk(chunkPath, remotePath) {
  try {
    const fileContent = fs.readFileSync(chunkPath);
    const fileSizeMB = (fileContent.length / (1024 * 1024)).toFixed(2);
    
    console.log(`📤 Uploading ${path.basename(chunkPath)} (${fileSizeMB} MB)`);
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: remotePath,
      Body: fileContent,
      ContentType: 'application/octet-stream',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(uploadCommand);
    
    const publicUrl = `https://pub-${R2_ACCOUNT_ID}.r2.dev/${remotePath}`;
    console.log(`✅ Successfully uploaded: ${publicUrl}`);
    
    return { success: true, url: publicUrl };
    
  } catch (error) {
    console.error(`❌ Error uploading ${chunkPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function uploadAllChunks() {
  console.log('🚀 Starting chunk upload to Cloudflare R2...\n');
  
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
  console.log(`📋 Loaded manifest: ${manifest.numChunks} chunks to upload`);
  console.log(`📏 Original file: ${manifest.originalFile} (${(manifest.totalSize / (1024 * 1024)).toFixed(2)} MB)\n`);

  const results = [];
  let uploadedChunks = 0;

  // Upload each chunk
  for (const chunk of manifest.chunks) {
    const chunkPath = path.join(CHUNKS_DIR, chunk.filename);
    const remotePath = `videos/ramdrone1/${chunk.filename}`;
    
    if (!fs.existsSync(chunkPath)) {
      console.log(`⚠️  Chunk not found: ${chunkPath}`);
      continue;
    }
    
    const result = await uploadChunk(chunkPath, remotePath);
    results.push({
      chunk: chunk.filename,
      ...result
    });
    
    if (result.success) {
      uploadedChunks++;
    }
    
    // Progress
    const progress = ((uploadedChunks / manifest.numChunks) * 100).toFixed(1);
    console.log(`📊 Progress: ${progress}% (${uploadedChunks}/${manifest.numChunks} chunks)\n`);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Upload manifest to R2 as well
  console.log('📋 Uploading manifest...');
  const manifestResult = await uploadChunk(MANIFEST_PATH, 'videos/ramdrone1/manifest.json');
  
  // Summary
  console.log('📊 Upload Summary:');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful chunk uploads: ${successful.length}/${manifest.numChunks}`);
  console.log(`❌ Failed chunk uploads: ${failed.length}`);
  
  if (manifestResult.success) {
    console.log(`✅ Manifest uploaded successfully`);
  } else {
    console.log(`❌ Manifest upload failed`);
  }
  
  if (successful.length === manifest.numChunks && manifestResult.success) {
    console.log('\n🎉 All chunks uploaded successfully!');
    console.log(`🔗 Base URL: https://pub-${R2_ACCOUNT_ID}.r2.dev/videos/ramdrone1/`);
    console.log('📋 Manifest URL:', manifestResult.url);
    
    // Create a simple HTML page for testing chunked video playback
    createTestPage(manifest);
  } else {
    console.log('\n⚠️  Some chunks failed to upload. Check the errors above.');
  }
}

function createTestPage(manifest) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Chunked Video Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        video { width: 100%; max-width: 600px; height: auto; }
        .progress { width: 100%; background: #f0f0f0; border-radius: 5px; margin: 10px 0; }
        .progress-bar { height: 20px; background: #4CAF50; border-radius: 5px; width: 0%; }
    </style>
</head>
<body>
    <h1>Chunked Video Playback Test</h1>
    <video id="chunkVideo" controls>
        <source id="videoSource" type="video/webm">
        Your browser does not support the video tag.
    </video>
    
    <div>
        <button onclick="loadChunkedVideo()">Load Chunked Video</button>
        <div class="progress">
            <div id="progressBar" class="progress-bar"></div>
        </div>
        <p id="status">Ready to load video</p>
    </div>

    <script>
        const BASE_URL = 'https://pub-${R2_ACCOUNT_ID}.r2.dev/videos/ramdrone1/';
        const NUM_CHUNKS = ${manifest.numChunks};
        
        async function loadChunkedVideo() {
            const status = document.getElementById('status');
            const progressBar = document.getElementById('progressBar');
            const video = document.getElementById('chunkVideo');
            
            status.textContent = 'Loading chunks...';
            
            try {
                const chunks = [];
                
                for (let i = 0; i < NUM_CHUNKS; i++) {
                    const chunkName = 'ramdrone1-chunk-' + String(i).padStart(3, '0') + '.part';
                    status.textContent = \`Loading chunk \${i + 1}/\${NUM_CHUNKS}...\`;
                    progressBar.style.width = \`\${((i + 1) / NUM_CHUNKS) * 100}%\`;
                    
                    const response = await fetch(BASE_URL + chunkName);
                    const chunk = await response.arrayBuffer();
                    chunks.push(new Uint8Array(chunk));
                }
                
                // Combine all chunks
                const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
                const combined = new Uint8Array(totalLength);
                let offset = 0;
                
                for (const chunk of chunks) {
                    combined.set(chunk, offset);
                    offset += chunk.length;
                }
                
                // Create blob and object URL
                const blob = new Blob([combined], { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                
                video.src = videoUrl;
                status.textContent = 'Video loaded successfully! File size: ' + (totalLength / (1024 * 1024)).toFixed(2) + ' MB';
                progressBar.style.width = '100%';
                
            } catch (error) {
                status.textContent = 'Error loading video: ' + error.message;
                console.error('Error:', error);
            }
        }
    </script>
</body>
</html>`;

  const testPagePath = path.join(__dirname, '..', 'public', 'test-chunked-video.html');
  fs.writeFileSync(testPagePath, htmlContent);
  console.log(`🧪 Test page created: ${testPagePath}`);
  console.log('Open http://localhost:3000/test-chunked-video.html to test chunked video playback');
}

// Run the upload process
uploadAllChunks().catch(console.error);