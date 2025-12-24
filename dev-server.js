#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

let nextProcess = null;
let isRestarting = false;
let restartAttempts = 0;
const MAX_RESTART_ATTEMPTS = 5;
const RESTART_DELAY = 2000; // 2 seconds

function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function killProcess() {
  return new Promise((resolve) => {
    if (nextProcess && !nextProcess.killed) {
      log('Stopping Next.js server...', 'yellow');
      
      // Try graceful shutdown first
      nextProcess.kill('SIGTERM');
      
      // Force kill after timeout
      setTimeout(() => {
        if (nextProcess && !nextProcess.killed) {
          nextProcess.kill('SIGKILL');
        }
        resolve();
      }, 5000);
    } else {
      resolve();
    }
  });
}

async function startNextServer() {
  if (isRestarting) {
    log('Already restarting, please wait...', 'yellow');
    return;
  }

  isRestarting = true;
  
  // Kill existing process
  await killProcess();
  
  log('Starting Next.js development server...', 'blue');
  
  nextProcess = spawn('next', ['dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3000',
      NODE_ENV: 'development'
    }
  });

  nextProcess.on('error', (error) => {
    log(`Failed to start: ${error.message}`, 'red');
    handleCrash();
  });

  nextProcess.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      log(`Next.js exited with code ${code}`, 'red');
      handleCrash();
    } else if (signal) {
      log(`Next.js killed with signal ${signal}`, 'yellow');
    }
  });

  // Reset restart attempts on successful start
  setTimeout(() => {
    if (nextProcess && !nextProcess.killed) {
      restartAttempts = 0;
      log('Next.js server started successfully!', 'green');
    }
    isRestarting = false;
  }, 3000);
}

function handleCrash() {
  if (restartAttempts >= MAX_RESTART_ATTEMPTS) {
    log(`Max restart attempts (${MAX_RESTART_ATTEMPTS}) reached. Please fix the errors and restart manually.`, 'red');
    process.exit(1);
  }

  restartAttempts++;
  log(`Attempting restart ${restartAttempts}/${MAX_RESTART_ATTEMPTS} in ${RESTART_DELAY/1000} seconds...`, 'yellow');
  
  setTimeout(() => {
    isRestarting = false;
    startNextServer();
  }, RESTART_DELAY);
}

// Handle process termination
process.on('SIGINT', async () => {
  log('Received SIGINT, shutting down gracefully...', 'magenta');
  await killProcess();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log('Received SIGTERM, shutting down gracefully...', 'magenta');
  await killProcess();
  process.exit(0);
});

// Start the server
startNextServer();

// Export for nodemon
module.exports = { startNextServer };