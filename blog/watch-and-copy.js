#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const sourceFile = path.join(__dirname, 'posts.json');
const targetFile = path.join(__dirname, '..', 'public', 'blog', 'posts.json');

function copyFile() {
  try {
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✅ Copied posts.json to public directory at ${new Date().toLocaleTimeString()}`);
    } else {
      console.log('❌ Source file posts.json not found');
    }
  } catch (error) {
    console.error('❌ Error copying file:', error.message);
  }
}

// Initial copy
copyFile();

// Watch for changes
const watcher = chokidar.watch(sourceFile, {
  persistent: true,
  ignoreInitial: true
});

watcher.on('change', copyFile);

console.log('👀 Watching for changes to posts.json...');
console.log('Press Ctrl+C to stop watching');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping file watcher...');
  watcher.close();
  process.exit(0);
});
