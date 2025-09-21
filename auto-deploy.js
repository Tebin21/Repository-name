#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Auto-Deploy System Started!');
console.log('📁 Watching for file changes...');
console.log('🌐 Any change will automatically update: https://tebin21.github.io/Repository-name');
console.log('⏹️  Press Ctrl+C to stop\n');

let isDeploying = false;
let deployQueue = false;

// Directories and files to watch
const watchPaths = [
  './app',
  './public',
  './lib',
  './data',
  './next.config.js',
  './package.json'
];

// Files to ignore
const ignorePaths = [
  'node_modules',
  '.git',
  '.next',
  'auto-deploy.js',
  '.DS_Store'
];

function shouldIgnore(filePath) {
  return ignorePaths.some(ignore => filePath.includes(ignore));
}

function deployToGitHub() {
  if (isDeploying) {
    deployQueue = true;
    return;
  }

  isDeploying = true;
  console.log('🔄 Deploying changes to GitHub...');

  const commands = [
    'git add .',
    'git commit -m "Auto-deploy: Update from local changes"',
    'git push --force origin main'
  ];

  function runCommand(index) {
    if (index >= commands.length) {
      console.log('✅ Successfully deployed to GitHub Pages!');
      console.log('🌐 Live site: https://tebin21.github.io/Repository-name');
      console.log('⏰ Changes will be live in 1-2 minutes\n');
      
      isDeploying = false;
      
      if (deployQueue) {
        deployQueue = false;
        setTimeout(() => deployToGitHub(), 2000);
      }
      return;
    }

    exec(commands[index], (error, stdout, stderr) => {
      if (error && !error.message.includes('nothing to commit')) {
        console.log(`⚠️  Command failed: ${commands[index]}`);
        console.log(`Error: ${error.message}\n`);
        isDeploying = false;
        return;
      }

      if (stdout) console.log(stdout);
      runCommand(index + 1);
    });
  }

  runCommand(0);
}

function watchDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
    if (!filename || shouldIgnore(filename)) return;

    const fullPath = path.join(dirPath, filename);
    console.log(`📝 File changed: ${filename}`);
    
    // Debounce deployments (wait 2 seconds for multiple changes)
    clearTimeout(watchDirectory.deployTimeout);
    watchDirectory.deployTimeout = setTimeout(() => {
      deployToGitHub();
    }, 2000);
  });
}

// Watch all specified paths
watchPaths.forEach(watchPath => {
  if (fs.existsSync(watchPath)) {
    watchDirectory(watchPath);
    console.log(`👀 Watching: ${watchPath}`);
  }
});

console.log('\n🎯 Ready! Make any changes to your files and they will auto-deploy!\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Auto-Deploy System Stopped');
  process.exit(0);
});