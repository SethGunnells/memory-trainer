export interface Passage {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  nextReviewDate: string; // ISO date string
  reviewCount: number;
}

export interface AppData {
  passages: Passage[];
}

export type ConfidenceRating = 1 | 2 | 3 | 4 | 5;
