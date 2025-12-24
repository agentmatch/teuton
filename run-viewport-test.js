const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting viewport testing process...\n');

// Start the Next.js dev server
console.log('📦 Starting Next.js development server...');
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'pipe'
});

let serverReady = false;

// Monitor server output
devServer.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // Check if server is ready
  if (output.includes('Ready') || output.includes('started server on') || output.includes('Local:')) {
    serverReady = true;
  }
});

devServer.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Wait for server to be ready
const checkServer = setInterval(() => {
  if (serverReady) {
    clearInterval(checkServer);
    runTests();
  }
}, 1000);

// Set a timeout
setTimeout(() => {
  if (!serverReady) {
    clearInterval(checkServer);
    console.log('\n⏱️  Server didn\'t start in time, attempting to run tests anyway...');
    runTests();
  }
}, 15000);

function runTests() {
  console.log('\n🔍 Running iPhone viewport testing...\n');
  
  const testProcess = spawn('node', [
    'scripts/capture-iphone-viewports.js',
    '--url=http://localhost:3000/landingpagekappa',
    '--all'
  ], {
    cwd: path.join(__dirname),
    stdio: 'inherit'
  });
  
  testProcess.on('close', (code) => {
    console.log(`\n✨ Viewport testing completed with code ${code}`);
    console.log('🛑 Stopping development server...');
    
    // Kill the dev server
    devServer.kill('SIGTERM');
    
    // Force kill after a timeout
    setTimeout(() => {
      devServer.kill('SIGKILL');
      process.exit(0);
    }, 3000);
  });
  
  testProcess.on('error', (err) => {
    console.error('❌ Error running viewport tests:', err);
    devServer.kill('SIGTERM');
    process.exit(1);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Interrupted, cleaning up...');
  devServer.kill('SIGTERM');
  process.exit(0);
});