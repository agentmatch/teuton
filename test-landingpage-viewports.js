#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Luxor Metals Viewport Testing for landingpagekappa');
console.log('='.repeat(60));

// Start the dev server
console.log('\n📦 Starting development server...');
const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

let serverReady = false;

devServer.stdout.on('data', (data) => {
  const output = data.toString();
  if (!serverReady && output.includes('ready') || output.includes('started on')) {
    serverReady = true;
    console.log('✅ Development server is ready!');
    
    // Wait a bit more to ensure everything is loaded
    setTimeout(() => {
      runViewportTests();
    }, 3000);
  }
});

devServer.stderr.on('data', (data) => {
  console.error(`Dev server error: ${data}`);
});

function runViewportTests() {
  console.log('\n📱 Running viewport tests on landingpagekappa...');
  
  const testProcess = spawn('node', [
    path.join(__dirname, 'scripts', 'capture-iphone-viewports.js'),
    '--url=http://localhost:3000/landingpagekappa',
    '--all'
  ], {
    stdio: 'inherit',
    shell: true
  });
  
  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✨ Testing complete! Check the output folder for results.');
      console.log('\n📊 Reports available at:');
      console.log('  - HTML Report: output/reports/summary/responsive-analysis.html');
      console.log('  - Markdown Summary: output/reports/summary/issues-summary.md');
      console.log('  - JSON Reports: output/reports/');
    } else {
      console.error(`\n❌ Testing failed with code ${code}`);
    }
    
    // Kill the dev server
    console.log('\n🛑 Stopping development server...');
    devServer.kill();
    process.exit(code);
  });
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n🛑 Interrupted! Cleaning up...');
  devServer.kill();
  process.exit(0);
});

// Timeout fallback
setTimeout(() => {
  if (!serverReady) {
    console.error('\n❌ Timeout: Development server did not start in time');
    devServer.kill();
    process.exit(1);
  }
}, 30000);