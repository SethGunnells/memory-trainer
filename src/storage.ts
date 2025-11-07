import fs from 'fs';
import path from 'path';
import os from 'os';
import { AppData, Passage, ConfidenceRating } from './types';

const DATA_DIR = path.join(os.homedir(), '.memory-trainer');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load data from file
export function loadData(): AppData {
  ensureDataDir();
  
  if (!fs.existsSync(DATA_FILE)) {
    // Create default data with sample passages
    const defaultData: AppData = {
      passages: [
        {
          id: '1',
          title: 'Sample Passage',
          subtitle: 'A test passage to get started',
          body: 'This is a sample passage to help you learn how to use the memory trainer. Press spacebar to reveal each word.',
          nextReviewDate: new Date().toISOString(),
          reviewCount: 0
        }
      ]
    };
    saveData(defaultData);
    return defaultData;
  }
  
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save data to file
export function saveData(data: AppData): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Get next passage to review
export function getNextPassage(data: AppData): Passage | null {
  const now = new Date();
  
  // Find passages that are due for review
  const duePassages = data.passages.filter(p => {
    const reviewDate = new Date(p.nextReviewDate);
    return reviewDate <= now;
  });
  
  if (duePassages.length === 0) {
    return null;
  }
  
  // Sort by review date (oldest first)
  duePassages.sort((a, b) => {
    return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
  });
  
  return duePassages[0];
}

// Calculate next review date based on confidence rating
export function calculateNextReviewDate(confidence: ConfidenceRating): Date {
  const now = new Date();
  const daysToAdd = {
    1: 1,    // Tomorrow
    2: 3,    // 3 days
    3: 7,    // 1 week
    4: 14,   // 2 weeks
    5: 30    // 1 month
  };
  
  const days = daysToAdd[confidence];
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + days);
  
  return nextDate;
}

// Update passage after review
export function updatePassageAfterReview(
  data: AppData,
  passageId: string,
  confidence: ConfidenceRating
): AppData {
  const passages = data.passages.map(p => {
    if (p.id === passageId) {
      return {
        ...p,
        nextReviewDate: calculateNextReviewDate(confidence).toISOString(),
        reviewCount: p.reviewCount + 1
      };
    }
    return p;
  });
  
  return { passages };
}
