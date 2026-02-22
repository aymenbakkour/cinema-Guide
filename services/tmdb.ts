import { Movie, Actor } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Map TMDB genres to Arabic strings (simplified)
const genreMap: Record<number, string> = {
  28: 'أكشن',
  12: 'مغامرة',
  16: 'رسوم متحركة',
  35: 'كوميديا',
  80: 'جريمة',
  99: 'وثائقي',
  18: 'دراما',
  10751: 'عائلي',
  14: 'فانتازيا',
  36: 'تاريخ',
  27: 'رعب',
  10402: 'موسيقى',
  9648: 'غموض',
  10749: 'رومانسية',
  878: 'خيال علمي',
  10770: 'فيلم تلفزيوني',
  53: 'إثارة',
  10752: 'حرب',
  37: 'ويسترن',
  10759: 'أكشن ومغامرة',
  10762: 'أطفال',
  10763: 'أخبار',
  10764: 'واقعي',
  10765: 'خيال علمي وفانتازيا',
  10766: 'مسلسلات طويلة',
  10767: 'حواري',
  10768: 'سياسة وحرب',
};

const mapTmdbToMovie = (item: any, type: 'movie' | 'series'): Movie => {
  const isArabic = item.original_language === 'ar';
  const title = item.title || item.name;
  const originalTitle = item.original_title || item.original_name;
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 0;
  const genreId = item.genre_ids ? item.genre_ids[0] : null;
  const genre = genreId ? genreMap[genreId] || 'غير محدد' : 'غير محدد';

  return {
    id: item.id,
    titleArabic: isArabic ? originalTitle : title, // TMDB returns translated title if language=ar is passed
    titleEnglish: originalTitle,
    year,
    genre,
    genreId: genreId || undefined,
    synopsisArabic: item.overview || 'لا يوجد وصف متاح.',
    imageUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
    type,
    origin: isArabic ? 'arabic' : 'foreign',
    actors: [], // TMDB lists require a separate call for credits, we'll skip for list view performance or fetch separately if needed
    rating: item.vote_average,
  };
};

export const fetchTrending = async (page = 1): Promise<Movie[]> => {
  if (!API_KEY) return [];
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA&page=${page}`);
    const data = await response.json();
    return data.results.map((item: any) => mapTmdbToMovie(item, item.media_type === 'tv' ? 'series' : 'movie'));
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

export const searchMedia = async (query: string, page = 1): Promise<Movie[]> => {
  if (!API_KEY) return [];
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();
    return data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => mapTmdbToMovie(item, item.media_type === 'tv' ? 'series' : 'movie'));
  } catch (error) {
    console.error('Error searching media:', error);
    return [];
  }
};

export const discoverMedia = async (type: 'movie' | 'series', page = 1, filters?: any): Promise<Movie[]> => {
  if (!API_KEY) return [];
  const endpoint = type === 'movie' ? 'discover/movie' : 'discover/tv';
  let url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&language=ar-SA&sort_by=popularity.desc&page=${page}`;

  if (filters?.with_original_language) {
    url += `&with_original_language=${filters.with_original_language}`;
  }
  
  if (filters?.year) {
      if (type === 'movie') url += `&primary_release_year=${filters.year}`;
      else url += `&first_air_date_year=${filters.year}`;
  }

  if (filters?.with_genres) {
    url += `&with_genres=${filters.with_genres}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((item: any) => mapTmdbToMovie(item, type));
  } catch (error) {
    console.error(`Error discovering ${type}:`, error);
    return [];
  }
};

export const fetchPopularActors = async (page = 1): Promise<Actor[]> => {
  if (!API_KEY) return [];
  try {
    const url = `${BASE_URL}/person/popular?api_key=${API_KEY}&language=ar-SA&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      profilePath: item.profile_path ? `${IMAGE_BASE_URL}${item.profile_path}` : '',
      knownFor: item.known_for.map((m: any) => mapTmdbToMovie(m, m.media_type === 'tv' ? 'series' : 'movie')),
      // Heuristic: if any known_for is Arabic, mark as Arabic
      origin: item.known_for.some((m: any) => m.original_language === 'ar') ? 'arabic' : 'foreign'
    }));
  } catch (error) {
    console.error('Error fetching actors:', error);
    return [];
  }
};

export const fetchActorCredits = async (personId: number): Promise<Movie[]> => {
  if (!API_KEY) return [];
  try {
    const response = await fetch(`${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}&language=ar-SA`);
    const data = await response.json();
    return data.cast
      .filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv')
      .sort((a: any, b: any) => (b.vote_count || 0) - (a.vote_count || 0))
      .map((m: any) => mapTmdbToMovie(m, m.media_type === 'tv' ? 'series' : 'movie'));
  } catch (error) {
    console.error('Error fetching actor credits:', error);
    return [];
  }
};
