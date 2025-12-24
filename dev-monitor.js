#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

let nextProcess = null;
let isRestarting = false;
let errorBuffer = [];
let lastErrorTime = 0;
const ERROR_THRESHOLD = 3000; // 3 seconds

function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors[color]}[dev-monitor ${timestamp}] ${message}${colors.reset}`);
}

function analyzeError(errorLine) {
  // Common Next.js error patterns
  const errorPatterns = {
    'Module not found': 'Missing module - check imports',
    'Cannot find module': 'Missing dependency - try npm install',
    'Syntax error': 'Syntax error in code',
    'TypeError': 'Type error - check TypeScript types',
    'EADDRINUSE': 'Port already in use',
    'Failed to compile': 'Compilation error',
    'Module build failed': 'Build error',
    'Invalid configuration': 'Check next.config.js',
    'out of memory': 'Memory issue - restart recommended'
  };

  for (const [pattern, suggestion] of Object.entries(errorPatterns)) {
    if (errorLine.includes(pattern)) {
      return { pattern, suggestion };
    }
  }
  return null;
}

async function killExistingProcesses() {
  return new Promise((resolve) => {
    // Kill any process on port 3000
    const killPort = spawn('lsof', ['-ti:3000']);
    let pids = '';

    killPort.stdout.on('data', (data) => {
      pids += data.toString();
    });

    killPort.on('close', () => {
      if (pids.trim()) {
        const pidList = pids.trim().split('\n');
        pidList.forEach(pid => {
          try {
            process.kill(pid, 'SIGKILL');
          } catch (e) {
            // Process might already be dead
          }
        });
        log('Killed existing processes on port 3000', 'yellow');
      }
      resolve();
    });

    killPort.on('error', () => {
      // lsof might not be available, continue anyway
      resolve();
    });
  });
}

async function startNextServer() {
  if (isRestarting) {
    return;
  }

  isRestarting = true;
  errorBuffer = [];
  
  // Kill any existing Next.js process
  if (nextProcess && !nextProcess.killed) {
    log('Stopping current Next.js server...', 'yellow');
    nextProcess.kill('SIGKILL');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Kill anything on port 3000
  await killExistingProcesses();
  
  log('Starting Next.js development server on port 3000...', 'cyan');
  
  nextProcess = spawn('next', ['dev', '-p', '3000'], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      FORCE_COLOR: '1'
    }
  });

  // Handle stdout
  const stdoutRL = readline.createInterface({
    input: nextProcess.stdout,
    crlfDelay: Infinity
  });

  stdoutRL.on('line', (line) => {
    console.log(line);
    
    // Detect successful start
    if (line.includes('Ready in') || line.includes('compiled successfully')) {
      log('Next.js is running successfully!', 'green');
      errorBuffer = [];
    }
  });

  // Handle stderr
  const stderrRL = readline.createInterface({
    input: nextProcess.stderr,
    crlfDelay: Infinity
  });

  stderrRL.on('line', (line) => {
    console.error(line);
    
    // Analyze errors
    const now = Date.now();
    errorBuffer.push({ line, time: now });
    
    const errorInfo = analyzeError(line);
    if (errorInfo) {
      log(`Error detected: ${errorInfo.pattern}`, 'red');
      log(`Suggestion: ${errorInfo.suggestion}`, 'yellow');
    }

    // Check if we're getting rapid errors
    if (now - lastErrorTime < ERROR_THRESHOLD) {
      const recentErrors = errorBuffer.filter(e => now - e.time < 5000).length;
      if (recentErrors > 10) {
        log('Rapid errors detected - will restart on next file save', 'red');
      }
    }
    lastErrorTime = now;
  });

  nextProcess.on('error', (error) => {
    log(`Failed to start Next.js: ${error.message}`, 'red');
    isRestarting = false;
  });

  nextProcess.on('exit', (code, signal) => {
    if (signal !== 'SIGKILL' && code !== 0) {
      log(`Next.js exited unexpectedly with code ${code}`, 'red');
      log('Waiting for file changes to restart...', 'yellow');
    }
    isRestarting = false;
  });

  // Give it time to start
  setTimeout(() => {
    isRestarting = false;
  }, 2000);
}

// Handle process termination
process.on('SIGINT', () => {
  log('Shutting down...', 'magenta');
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill('SIGKILL');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill('SIGKILL');
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`, 'red');
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill('SIGKILL');
  }
});

// Start the server
startNextServer();

// Export restart function for nodemon
module.exports = startNextServer;