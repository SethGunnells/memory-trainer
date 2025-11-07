#!/usr/bin/env node
/**
 * Manual Test Instructions for Memory Trainer
 * 
 * This document outlines how to manually test the application
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Memory Trainer - Manual Test Instructions');
console.log('=========================================\n');

console.log('1. INITIAL SETUP');
console.log('   - Run: npm start');
console.log('   - Expected: App displays title and subtitle of first passage');
console.log('   - Expected: Shows "Press SPACE to reveal next word (0/N)"\n');

console.log('2. WORD REVEAL TEST');
console.log('   - Action: Press SPACE repeatedly');
console.log('   - Expected: Each press reveals one more word');
console.log('   - Expected: Counter updates (1/N, 2/N, etc.)');
console.log('   - Expected: After all words shown, message changes to "Press SPACE to rate your confidence"\n');

console.log('3. RATING TEST');
console.log('   - Action: Press SPACE after all words revealed');
console.log('   - Expected: Rating screen appears with options 1-5');
console.log('   - Expected: Shows review intervals for each rating');
console.log('   - Action: Press a number key (1-5)');
console.log('   - Expected: Shows "Review complete!" message\n');

console.log('4. DATA PERSISTENCE TEST');
console.log('   - Action: Press q to quit');
console.log('   - Action: Check ~/.memory-trainer/data.json');
console.log('   - Expected: File exists with updated nextReviewDate and reviewCount\n');

console.log('5. NO PASSAGES DUE TEST');
console.log('   - Action: Run app again immediately');
console.log('   - Expected: Shows "No passages due for review!" (if rated 2-5)');
console.log('   - Expected: Shows next passage (if rated 1 and it\'s tomorrow)\n');

console.log('6. MULTIPLE PASSAGES TEST');
console.log('   - Action: Modify data.json to have multiple passages with past dates');
console.log('   - Action: Run app');
console.log('   - Expected: Shows oldest due passage first\n');

console.log('\nNOTE: The app requires a real terminal with TTY support.');
console.log('It will not work properly when piping input or in CI environments.');
console.log('\nTo test manually, run: npm start\n');

// Verify the build works
const distPath = path.join(__dirname, 'dist');
const requiredFiles = ['cli.js', 'App.js', 'storage.js', 'types.js'];

console.log('VERIFYING BUILD:');
let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(distPath, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
  if (!exists) allFilesExist = false;
}

if (allFilesExist) {
  console.log('\n✓ All required files built successfully');
} else {
  console.log('\n✗ Some files are missing. Run: npm run build');
  process.exit(1);
}

// Verify data file structure
console.log('\nVERIFYING DATA FILE:');
const dataPath = path.join(os.homedir(), '.memory-trainer', 'data.json');
if (fs.existsSync(dataPath)) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`  ✓ Data file exists at ${dataPath}`);
  console.log(`  ✓ Contains ${data.passages.length} passage(s)`);
  
  // Show first passage
  if (data.passages.length > 0) {
    const p = data.passages[0];
    console.log(`\n  First passage:`);
    console.log(`    Title: ${p.title}`);
    console.log(`    Subtitle: ${p.subtitle}`);
    console.log(`    Word count: ${p.body.split(/\s+/).length}`);
    console.log(`    Next review: ${new Date(p.nextReviewDate).toLocaleString()}`);
  }
} else {
  console.log(`  ℹ Data file will be created on first run`);
}

console.log('\n✓ Verification complete\n');
