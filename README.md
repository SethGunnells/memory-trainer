# memory-trainer
A terminal application for working on memorizing things

## Features

- **Spaced Repetition**: Uses a proven spaced repetition system to optimize memory retention
- **Word-by-word Reveal**: Practice passages by revealing one word at a time using the spacebar
- **Confidence Ratings**: Rate your confidence (1-5) to determine when you'll see the passage again
- **Terminal UI**: Clean, distraction-free interface built with React Ink

## Installation

```bash
npm install
npm run build
```

## Usage

Start the application:

```bash
npm start
```

Or run directly after building:

```bash
node dist/cli.js
```

### How it works

1. The application shows you the title and subtitle of a passage that's due for review
2. Press **SPACE** to reveal each word of the passage one at a time
3. After revealing all words, rate your confidence from 1-5:
   - **1** - Review tomorrow
   - **2** - Review in 3 days
   - **3** - Review in 1 week
   - **4** - Review in 2 weeks
   - **5** - Review in 1 month

## Data Storage

Passages are stored in `~/.memory-trainer/data.json`. You can edit this file to add your own passages to memorize.

### Passage Format

```json
{
  "passages": [
    {
      "id": "1",
      "title": "Passage Title",
      "subtitle": "Passage Subtitle",
      "body": "The text you want to memorize",
      "nextReviewDate": "2025-11-07T00:00:00.000Z",
      "reviewCount": 0
    }
  ]
}
```

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

Build the TypeScript code:

```bash
npm run build
```

