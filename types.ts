export interface Movie {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  year: number;
  genre: string;
  synopsisArabic: string;
  synopsisEnglish: string;
  imageUrl: string;
  type: 'movie' | 'series';
  origin: 'arabic' | 'foreign'; // Added origin property
  actors: string[]; // Added actor names
}

export interface Recommendation {
  titleArabic: string;
  titleEnglish: string;
  synopsisArabic: string;
}

export interface GeminiApiResponse {
  recommendations: Recommendation[];
}