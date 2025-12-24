const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting Next.js development server...');

// Start the Next.js server
const nextServer = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

let serverReady = false;

// Monitor server output
nextServer.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[Next.js] ${output}`);
  
  if (output.includes('ready') || output.includes('started on') || output.includes('localhost:3000')) {
    serverReady = true;
  }
});

nextServer.stderr.on('data', (data) => {
  console.error(`[Next.js Error] ${data.toString()}`);
});

// Wait for server to be ready
function waitForServer() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      http.get('http://localhost:3000', (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          clearInterval(checkInterval);
          console.log('✅ Server is ready!');
          resolve();
        }
      }).on('error', () => {
        // Server not ready yet
      });
    }, 2000);
  });
}

// Run viewport tests
async function runViewportTests() {
  console.log('📱 Running viewport testing script...');
  
  const viewportTest = spawn('node', [
    'scripts/capture-iphone-viewports.js',
    '--url=http://localhost:3000/landingpagekappa',
    '--all'
  ], {
    stdio: 'inherit',
    shell: true
  });

  return new Promise((resolve, reject) => {
    viewportTest.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Viewport tests completed successfully!');
        resolve();
      } else {
        reject(new Error(`Viewport tests failed with code ${code}`));
      }
    });
  });
}

// Main execution
async function main() {
  try {
    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Wait for server to be fully ready
    await waitForServer();
    
    // Run viewport tests
    await runViewportTests();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Kill the Next.js server
    console.log('🛑 Stopping the server...');
    nextServer.kill();
    process.exit(0);
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Interrupted, cleaning up...');
  nextServer.kill();
  process.exit(0);
});

main();