#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const videoFiles = [
  'public/images/ramdrone1.webm',
  'public/images/ramdrone2.webm', 
  'public/images/ramdrone1thumb.webm',
  'public/images/ramdrone1thumb3.webm',
];

console.log('📊 Video File Sizes:');
console.log('===================');

let totalSize = 0;

videoFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    
    console.log(`✅ ${file}`);
    console.log(`   Size: ${sizeInMB} MB`);
    console.log('');
  } else {
    console.log(`❌ ${file} - File not found`);
    console.log('');
  }
});

const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
console.log(`📦 Total size: ${totalSizeInMB} MB`);

// Estimate upload time (assuming 10 Mbps upload speed)
const estimatedMinutes = Math.ceil(totalSizeInMB / 1.25 / 60); // Convert MB to minutes at 10Mbps
console.log(`⏱️  Estimated upload time: ${estimatedMinutes} minutes (at 10 Mbps)`);