export interface Movie {
  id: string | number;
  titleArabic: string;
  titleEnglish: string;
  year: number;
  genre: string;
  genreId?: number;
  synopsisArabic: string;
  synopsisEnglish?: string;
  imageUrl: string;
  type: 'movie' | 'series';
  origin: 'arabic' | 'foreign';
  country?: string;
  actors: string[];
  rating?: number;
}

export interface Actor {
  id: number;
  name: string;
  profilePath: string;
  knownFor: Movie[];
  origin: 'arabic' | 'foreign';
}

export interface Recommendation {
  titleArabic: string;
  titleEnglish: string;
  synopsisArabic: string;
}

export interface GeminiApiResponse {
  recommendations: Recommendation[];
}