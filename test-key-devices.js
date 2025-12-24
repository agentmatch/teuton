#!/usr/bin/env node

// Test script for key iPhone devices only
const { spawn } = require('child_process');

console.log('📱 Testing landingpagekappa on key iPhone devices');
console.log('='.repeat(50));
console.log('Testing: iPhone SE, iPhone 14, iPhone 15 Pro Max');
console.log('');

// Check if localhost:3000 is accessible
const http = require('http');

http.get('http://localhost:3000/landingpagekappa', (res) => {
  if (res.statusCode === 200 || res.statusCode === 304) {
    console.log('✅ Development server is running');
    runTests();
  } else {
    console.error('❌ Unexpected status code:', res.statusCode);
    console.log('Please ensure the dev server is running: npm run dev');
    process.exit(1);
  }
}).on('error', (err) => {
  console.error('❌ Development server is not running!');
  console.log('Please run: npm run dev');
  console.log('Then run this script again.');
  process.exit(1);
});

function runTests() {
  const devices = ['iPhone SE', 'iPhone 14', 'iPhone 15 Pro Max'];
  
  console.log('\nRunning viewport tests...\n');
  
  const test = spawn('node', [
    'scripts/capture-iphone-viewports.js',
    '--url=http://localhost:3000/landingpagekappa',
    `--compare=${devices.join(',')}`
  ], {
    stdio: 'inherit'
  });
  
  test.on('close', (code) => {
    if (code === 0) {
      console.log('\n✨ Testing complete!');
      console.log('\nView results:');
      console.log('  open output/reports/summary/responsive-analysis.html');
      console.log('  cat output/reports/summary/issues-summary.md');
    }
  });
}