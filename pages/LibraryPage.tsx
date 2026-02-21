import React, { useState, useEffect, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import { MOCK_MOVIES } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { Search, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import { searchMedia, discoverMedia, fetchTrending } from '../services/tmdb';
import { Movie } from '../types';

const LibraryPage: React.FC = () => {
  const { t } = useSettings();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterOrigin, setFilterOrigin] = useState<'all' | 'arabic' | 'foreign'>('all');
  const [filterActor, setFilterActor] = useState('all');

  // Load initial data (Trending or Mock)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const trending = await fetchTrending();
      if (trending.length > 0) {
        setMovies(trending);
        setApiError(false);
      } else {
        setMovies(MOCK_MOVIES);
        setApiError(true);
      }
      setLoading(false);
    };
    loadInitialData();
  }, []);

  // Handle Search and Filters via API or Local
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let results: Movie[] = [];

      // If API Key is missing or failed previously, use local filtering
      if (apiError) {
        results = MOCK_MOVIES;
        // Apply local filters (same logic as before)
        if (filterType !== 'all') results = results.filter(item => item.type === filterType);
        if (filterGenre !== 'all') results = results.filter(item => item.genre === filterGenre);
        if (filterYear !== 'all') results = results.filter(item => item.year === parseInt(filterYear));
        if (filterOrigin !== 'all') results = results.filter(item => item.origin === filterOrigin);
        if (filterActor !== 'all') results = results.filter(item => item.actors.includes(filterActor));
        if (searchTerm) {
           const lower = searchTerm.toLowerCase();
           results = results.filter(item => 
             item.titleArabic.toLowerCase().includes(lower) || 
             item.titleEnglish.toLowerCase().includes(lower) ||
             item.actors.some(a => a.toLowerCase().includes(lower))
           );
        }
        setMovies(results);
        setLoading(false);
        return;
      }

      // API Logic
      try {
        if (searchTerm) {
          results = await searchMedia(searchTerm);
        } else {
          // If no search, use discover with filters
          if (filterType === 'all') {
             // Fetch both and combine? TMDB doesn't support mixed discover easily without multiple calls.
             // For simplicity, if 'all', we fetch trending or mix. 
             // Let's stick to fetching trending if no specific type is selected, or default to movies then series.
             const m = await discoverMedia('movie', 1, { 
               with_original_language: filterOrigin === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             const s = await discoverMedia('series', 1, {
               with_original_language: filterOrigin === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             results = [...m, ...s].sort(() => 0.5 - Math.random()); // Shuffle mixed
          } else {
             results = await discoverMedia(filterType, 1, {
               with_original_language: filterOrigin === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
          }
        }
        
        // Client-side filtering for things API might miss or for mixed results
        if (filterOrigin === 'foreign') {
           results = results.filter(m => m.origin === 'foreign');
        }
        
        setMovies(results);
      } catch (e) {
        console.error("Search error", e);
        setMovies(MOCK_MOVIES); // Fallback
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, filterType, filterOrigin, filterYear, apiError]);


  // Extract unique values from MOCK_MOVIES for dropdowns (as API doesn't give us a list easily without extra calls)
  // In a real app, we'd fetch genre lists from API. For now, we use static lists or mock data for dropdowns.
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    MOCK_MOVIES.forEach(movie => genres.add(movie.genre));
    return ['all', ...Array.from(genres).sort()];
  }, []);

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    MOCK_MOVIES.forEach(movie => years.add(movie.year));
    return ['all', ...Array.from(years).sort((a, b) => b - a).map(String)];
  }, []);

  const uniqueActors = useMemo(() => {
    const actors = new Set<string>();
    MOCK_MOVIES.forEach(movie => movie.actors.forEach(actor => actors.add(actor)));
    return ['all', ...Array.from(actors).sort()];
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterGenre('all');
    setFilterYear('all');
    setFilterOrigin('all');
    setFilterActor('all');
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600 dark:from-fuchsia-400 dark:to-blue-400 mb-8 animate-fade-in-down">
        {t('library.title')}
      </h1>

      {apiError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl mb-6 flex items-center gap-3 text-yellow-700 dark:text-yellow-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            API Key missing or invalid. Showing local demo library. To enable the full live library, add your TMDB API Key to .env.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setFilterType('all')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                filterType === 'all'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.all_types')}
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                filterType === 'movie'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.movies')}
            </button>
            <button
              onClick={() => setFilterType('series')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                filterType === 'series'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.series')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setFilterOrigin('all')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                filterOrigin === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.all_origins')}
            </button>
            <button
              onClick={() => setFilterOrigin('arabic')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                filterOrigin === 'arabic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.arabic')}
            </button>
            <button
              onClick={() => setFilterOrigin('foreign')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                filterOrigin === 'foreign'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.foreign')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full p-3 pr-10 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? t('filter.all_genres') : genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full p-3 pr-10 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year === 'all' ? t('filter.all_years') : year}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Actor filter only works well with local data for now */}
            <div className="relative">
              <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={filterActor}
                onChange={(e) => setFilterActor(e.target.value)}
                className="w-full p-3 pr-10 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                disabled={!apiError} // Disable actor filter in API mode for simplicity as we don't fetch actor lists
              >
                {uniqueActors.map((actor) => (
                  <option key={actor} value={actor}>
                    {actor === 'all' ? t('filter.all_actors') : actor}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || filterType !== 'all' || filterGenre !== 'all' || filterYear !== 'all' || filterOrigin !== 'all' || filterActor !== 'all') && (
            <div className="flex justify-end mt-2">
              <button 
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                مسح الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xl">
            {t('no_results')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
      )}

      <style>
        {`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        `}
      </style>
    </div>
  );
};

export default LibraryPage;