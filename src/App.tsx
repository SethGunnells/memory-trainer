import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Passage, ConfidenceRating } from './types';
import { getNextPassage, updatePassageAfterReview, loadData, saveData } from './storage';

type AppState = 'loading' | 'practicing' | 'rating' | 'complete' | 'no-passages';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('loading');
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [revealedWords, setRevealedWords] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [words, setWords] = useState<string[]>([]);

  // Load the next passage on mount
  useEffect(() => {
    const data = loadData();
    const nextPassage = getNextPassage(data);
    
    if (nextPassage) {
      setCurrentPassage(nextPassage);
      const passageWords = nextPassage.body.split(/\s+/);
      setWords(passageWords);
      setTotalWords(passageWords.length);
      setRevealedWords(0);
      setState('practicing');
    } else {
      setState('no-passages');
    }
  }, []);

  useInput((input, key) => {
    if (state === 'practicing') {
      if (key.return || input === ' ') {
        if (revealedWords < totalWords) {
          setRevealedWords(revealedWords + 1);
        } else {
          setState('rating');
        }
      }
    } else if (state === 'rating') {
      const rating = parseInt(input, 10);
      if (rating >= 1 && rating <= 5) {
        const confidence = rating as ConfidenceRating;
        const data = loadData();
        const updatedData = updatePassageAfterReview(data, currentPassage!.id, confidence);
        saveData(updatedData);
        setState('complete');
      }
    } else if (state === 'complete' || state === 'no-passages') {
      if (input === 'q') {
        process.exit(0);
      }
    }
  });

  if (state === 'loading') {
    return (
      <Box padding={1}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (state === 'no-passages') {
    return (
      <Box padding={1} flexDirection="column">
        <Text color="yellow">No passages due for review!</Text>
        <Text dimColor>Press 'q' to quit</Text>
      </Box>
    );
  }

  if (state === 'complete') {
    return (
      <Box padding={1} flexDirection="column">
        <Text color="green">✓ Review complete!</Text>
        <Text dimColor>Press 'q' to quit</Text>
      </Box>
    );
  }

  if (!currentPassage) {
    return (
      <Box padding={1}>
        <Text color="red">Error loading passage</Text>
      </Box>
    );
  }

  if (state === 'practicing') {
    const displayedWords = words.slice(0, revealedWords).join(' ');
    
    return (
      <Box padding={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">{currentPassage.title}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text italic color="gray">{currentPassage.subtitle}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text>{displayedWords}</Text>
          {revealedWords < totalWords && <Text dimColor>_</Text>}
        </Box>
        <Box marginTop={1}>
          <Text dimColor>
            {revealedWords < totalWords 
              ? `Press SPACE to reveal next word (${revealedWords}/${totalWords})`
              : 'Press SPACE to rate your confidence'
            }
          </Text>
        </Box>
      </Box>
    );
  }

  if (state === 'rating') {
    return (
      <Box padding={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>Rate your confidence (1-5):</Text>
        </Box>
        <Box marginBottom={1} flexDirection="column">
          <Text>1 - Review tomorrow</Text>
          <Text>2 - Review in 3 days</Text>
          <Text>3 - Review in 1 week</Text>
          <Text>4 - Review in 2 weeks</Text>
          <Text>5 - Review in 1 month</Text>
        </Box>
        <Box>
          <Text dimColor>Press 1-5 to rate</Text>
        </Box>
      </Box>
    );
  }

  return null;
};

export default App;
