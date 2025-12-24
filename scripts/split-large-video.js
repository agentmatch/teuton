#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '..', 'public/images/ramdrone1.webm');
const OUTPUT_DIR = path.join(__dirname, '..', 'public/temp-chunks');
const CHUNK_SIZE = 500 * 1024 * 1024; // 500MB chunks
const BASE_NAME = 'ramdrone1-chunk';

async function splitFile() {
  console.log('🔪 Starting file split process...\n');
  
  // Check if input file exists
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }
  
  // Get file size
  const stats = fs.statSync(INPUT_FILE);
  const totalSize = stats.size;
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log(`📊 Input file: ${INPUT_FILE}`);
  console.log(`📏 Total size: ${totalSizeMB} MB`);
  console.log(`✂️  Chunk size: ${CHUNK_SIZE / (1024 * 1024)} MB`);
  
  // Calculate number of chunks needed
  const numChunks = Math.ceil(totalSize / CHUNK_SIZE);
  console.log(`📦 Will create ${numChunks} chunks\n`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
  
  // Open input file for reading
  const inputFd = fs.openSync(INPUT_FILE, 'r');
  
  try {
    let bytesRead = 0;
    let chunkIndex = 0;
    
    while (bytesRead < totalSize) {
      const remainingBytes = totalSize - bytesRead;
      const currentChunkSize = Math.min(CHUNK_SIZE, remainingBytes);
      
      // Create chunk filename
      const chunkFilename = `${BASE_NAME}-${String(chunkIndex).padStart(3, '0')}.part`;
      const chunkPath = path.join(OUTPUT_DIR, chunkFilename);
      
      console.log(`📤 Creating chunk ${chunkIndex + 1}/${numChunks}: ${chunkFilename}`);
      console.log(`   Size: ${(currentChunkSize / (1024 * 1024)).toFixed(2)} MB`);
      
      // Read chunk from input file
      const buffer = Buffer.alloc(currentChunkSize);
      const actualBytesRead = fs.readSync(inputFd, buffer, 0, currentChunkSize, bytesRead);
      
      // Write chunk to output file
      fs.writeFileSync(chunkPath, buffer.slice(0, actualBytesRead));
      
      bytesRead += actualBytesRead;
      chunkIndex++;
      
      // Progress indicator
      const progress = ((bytesRead / totalSize) * 100).toFixed(1);
      console.log(`   Progress: ${progress}% (${(bytesRead / (1024 * 1024)).toFixed(2)} MB / ${totalSizeMB} MB)\n`);
    }
    
    console.log('✅ File split completed successfully!');
    console.log(`📁 Chunks saved to: ${OUTPUT_DIR}`);
    
    // List all chunk files
    console.log('\n📋 Generated chunks:');
    const chunkFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith(BASE_NAME));
    chunkFiles.sort().forEach((file, index) => {
      const filePath = path.join(OUTPUT_DIR, file);
      const fileSize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
      console.log(`  ${index + 1}. ${file} (${fileSize} MB)`);
    });
    
    // Generate manifest file
    const manifest = {
      originalFile: 'ramdrone1.webm',
      totalSize: totalSize,
      chunkSize: CHUNK_SIZE,
      numChunks: numChunks,
      chunks: chunkFiles.map((file, index) => ({
        index: index,
        filename: file,
        size: fs.statSync(path.join(OUTPUT_DIR, file)).size
      }))
    };
    
    const manifestPath = path.join(OUTPUT_DIR, 'ramdrone1-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n📋 Manifest created: ${manifestPath}`);
    
  } finally {
    fs.closeSync(inputFd);
  }
}

// Create a function to reassemble chunks (for verification)
function createReassembleScript() {
  const scriptContent = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load manifest
const manifestPath = path.join(__dirname, 'ramdrone1-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log('🔧 Reassembling chunks...');

const outputPath = path.join(__dirname, '..', 'public/images', manifest.originalFile);
const outputFd = fs.openSync(outputPath, 'w');

try {
  let totalBytesWritten = 0;
  
  for (const chunk of manifest.chunks) {
    const chunkPath = path.join(__dirname, chunk.filename);
    console.log(\`📥 Reading chunk: \${chunk.filename}\`);
    
    const chunkData = fs.readFileSync(chunkPath);
    fs.writeSync(outputFd, chunkData);
    totalBytesWritten += chunkData.length;
    
    const progress = ((totalBytesWritten / manifest.totalSize) * 100).toFixed(1);
    console.log(\`   Progress: \${progress}%\`);
  }
  
  console.log(\`✅ File reassembled: \${outputPath}\`);
  console.log(\`📏 Total size: \${(totalBytesWritten / (1024 * 1024)).toFixed(2)} MB\`);
  
} finally {
  fs.closeSync(outputFd);
}
`;

  const scriptPath = path.join(OUTPUT_DIR, 'reassemble-chunks.js');
  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, '755');
  console.log(`🔧 Reassemble script created: ${scriptPath}`);
}

// Run the split process
splitFile()
  .then(() => {
    createReassembleScript();
    console.log('\n🎉 Split process completed!');
    console.log('\nNext steps:');
    console.log('1. Upload chunks using: npm run upload-chunks');
    console.log('2. Update component to use chunked video loading');
  })
  .catch(console.error);