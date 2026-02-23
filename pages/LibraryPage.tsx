import React, { useState, useEffect, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import ItemDetailsModal from '../components/ItemDetailsModal';
import { MOCK_MOVIES } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { Search, Filter, X, Loader2, AlertCircle, Film, Tv, Globe, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchMedia, discoverMedia, fetchTrending, fetchPopularActors, fetchActorCredits } from '../services/tmdb';
import { Movie, Actor } from '../types';

interface HorizontalRowProps {
  title: string;
  items: Movie[];
  type: 'genre' | 'actor';
  id: number | string;
  onSelectItem: (item: Movie) => void;
  activeTab: string;
  filterOrigin: string;
  filterYear: string;
}

const HorizontalRow: React.FC<HorizontalRowProps> = ({ title, items: initialItems, type, id, onSelectItem, activeTab, filterOrigin, filterYear }) => {
  const [items, setItems] = useState<Movie[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasMore(true);
  }, [initialItems]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    try {
      let nextResults: Movie[] = [];
      if (type === 'genre') {
        let mediaType: 'movie' | 'series' = 'movie';
        if (activeTab === 'series' || activeTab === 'arabic_series') {
          mediaType = 'series';
        }

        const extraFilters: any = {
          with_genres: id,
          year: filterYear !== 'all' ? filterYear : undefined
        };

        if (filterOrigin === 'arabic' || activeTab === 'arabic_series') {
          extraFilters.with_original_language = 'ar';
        }

        nextResults = await discoverMedia(mediaType, nextPage, extraFilters);
      } else if (type === 'actor') {
        // For actors, we usually get all credits at once or TMDB doesn't support pagination well for person credits
        // But we can simulate it or just say no more if we already fetched all.
        // Actually fetchActorCredits returns all, so we can just slice it.
        if (items.length >= initialItems.length) {
           const allCredits = await fetchActorCredits(Number(id));
           const newItems = allCredits.filter(m => !items.find(existing => existing.id === m.id));
           nextResults = newItems;
           setHasMore(false);
        }
      }

      if (nextResults.length > 0) {
        setItems(prev => [...prev, ...nextResults]);
        setPage(nextPage);
        if (type === 'genre') setHasMore(nextResults.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 sticky top-[128px] sm:top-[160px] z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-4 border-b border-gray-200 dark:border-gray-800">
        <div className={`w-2 h-8 rounded-full ${activeTab === 'movie' ? 'bg-blue-500' : activeTab === 'series' ? 'bg-fuchsia-500' : type === 'actor' ? 'bg-emerald-500' : 'bg-gradient-to-b from-blue-500 to-fuchsia-500'}`}></div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
          {items.length}
        </span>
      </div>
      
      <div className="relative group/scroll">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 hidden sm:block"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div ref={scrollRef} className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 scrollbar-hide scroll-smooth snap-x">
          {items.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[160px] sm:w-[220px] snap-start">
              <MovieCard item={movie} onClick={() => onSelectItem(movie)} />
            </div>
          ))}
          {hasMore && (
            <div className="flex-shrink-0 w-[160px] sm:w-[220px] snap-start flex items-center justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full aspect-[2/3] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-fuchsia-500 hover:border-fuchsia-500 transition-all group"
              >
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-900/30 transition-colors">
                      <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-black text-sm">تحميل المزيد</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden sm:block"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const LibraryPage: React.FC = () => {
  const { t, contentFilter } = useSettings();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'series' | 'actors' | 'arabic_series'>('all');
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedItem, setSelectedItem] = useState<Movie | Actor | null>(null);
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  // Removed local filterOrigin state as it is now controlled globally
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterActor, setFilterActor] = useState('all');

  // Load initial data (Trending or Mock)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const t1 = await fetchTrending(1);
        const t2 = await fetchTrending(2);
        const trending = [...t1, ...t2];
        if (trending.length > 0) {
          setMovies(trending);
          setApiError(false);
        } else {
          setMovies(MOCK_MOVIES);
          setApiError(true);
        }
      } catch (e) {
        setMovies(MOCK_MOVIES);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Handle Search and Filters via API or Local
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (activeTab === 'actors') {
        try {
          const results = await fetchPopularActors(1);
          setActors(results);
        } catch (e) {
          console.error("Actors fetch error", e);
        } finally {
          setLoading(false);
        }
        return;
      }

      let results: Movie[] = [];

      if (apiError) {
        results = MOCK_MOVIES;
        if (activeTab !== 'all') {
          if (activeTab === 'arabic_series') {
            results = results.filter(item => item.type === 'series' && item.origin === 'arabic');
          } else {
            results = results.filter(item => item.type === activeTab);
          }
        }
        if (filterGenre !== 'all') results = results.filter(item => item.genre === filterGenre);
        if (filterYear !== 'all') results = results.filter(item => item.year === parseInt(filterYear));
        if (contentFilter !== 'all') results = results.filter(item => item.origin === contentFilter);
        if (filterCountry !== 'all') results = results.filter(item => item.country === filterCountry);
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

      try {
        if (searchTerm) {
          results = await searchMedia(searchTerm, 1);
          if (activeTab !== 'all') {
            if (activeTab === 'arabic_series') {
              results = results.filter(m => m.type === 'series' && m.origin === 'arabic');
            } else {
              results = results.filter(m => m.type === activeTab);
            }
          }
        } else {
          if (activeTab === 'all') {
             const m1 = await discoverMedia('movie', 1, { 
               with_original_language: contentFilter === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             const m2 = await discoverMedia('movie', 2, { 
               with_original_language: contentFilter === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             const s1 = await discoverMedia('series', 1, {
               with_original_language: contentFilter === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             const s2 = await discoverMedia('series', 2, {
               with_original_language: contentFilter === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             results = [...m1, ...m2, ...s1, ...s2].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (activeTab === 'arabic_series') {
             const s1 = await discoverMedia('series', 1, { with_original_language: 'ar', year: filterYear !== 'all' ? filterYear : undefined });
             const s2 = await discoverMedia('series', 2, { with_original_language: 'ar', year: filterYear !== 'all' ? filterYear : undefined });
             results = [...s1, ...s2];
          } else {
             const p1 = await discoverMedia(activeTab, 1, {
               with_original_language: contentFilter === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             const p2 = await discoverMedia(activeTab, 2, {
               with_original_language: contentFilter === 'arabic' ? 'ar' : undefined,
               year: filterYear !== 'all' ? filterYear : undefined
             });
             results = [...p1, ...p2];
          }
        }
        
        if (contentFilter === 'foreign') {
           results = results.filter(m => m.origin === 'foreign');
        }
        
        setMovies(results);
      } catch (e) {
        setMovies(MOCK_MOVIES);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, activeTab, contentFilter, filterYear, apiError]);

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

  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    MOCK_MOVIES.forEach(movie => {
      if (movie.country) countries.add(movie.country);
    });
    return ['all', ...Array.from(countries).sort()];
  }, []);

  const uniqueActors = useMemo(() => {
    const actors = new Set<string>();
    MOCK_MOVIES.forEach(movie => movie.actors.forEach(actor => actors.add(actor)));
    return ['all', ...Array.from(actors).sort()];
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  // Group movies by genre for categorized view
  const genreGroups = useMemo(() => {
    const groups: Record<string, Movie[]> = {};
    
    movies.forEach(movie => {
      const genre = movie.genre || 'أخرى';
      if (!groups[genre]) {
        groups[genre] = [];
      }
      groups[genre].push(movie);
    });
    
    return groups;
  }, [movies]);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setFilterGenre('all');
    setFilterYear('all');
    // contentFilter is global, so we might not want to clear it here, or we can reset it to 'all'
    // setContentFilter('all'); // Optional: decide if clear filters should reset global language preference
    setFilterCountry('all');
    setFilterActor('all');
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-grow max-w-6xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600 dark:from-fuchsia-400 dark:to-blue-400 mb-8 animate-fade-in-down">
        {activeTab === 'all' ? t('library.title') : activeTab === 'movie' ? 'مكتبة الأفلام' : activeTab === 'series' ? 'مكتبة المسلسلات' : activeTab === 'arabic_series' ? 'مسلسلات عربية' : 'أشهر الممثلين'}
      </h1>

      {apiError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-xl mb-6 flex items-center gap-3 text-yellow-700 dark:text-yellow-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs sm:text-sm">
            API Key missing or invalid. Showing local demo library.
          </p>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="sticky top-[56px] sm:top-[80px] z-40 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md pb-4 mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center ${
              showFilters 
                ? 'bg-fuchsia-600 border-fuchsia-600 text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher - Moved here */}
        <div className="flex overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm flex gap-1 border border-gray-100 dark:border-gray-700 min-w-max">
            {[
              { id: 'all', label: 'الكل', icon: Globe },
              { id: 'movie', label: 'أفلام', icon: Film },
              { id: 'series', label: 'مسلسلات', icon: Tv },
              { id: 'arabic_series', label: 'مسلسلات عربية', icon: Tv },
              { id: 'actors', label: 'الممثلين', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex flex-col gap-6">
              {/* Type Filter - Removed as we have tabs now */}
              
              {/* Origin Filter - Removed as it is now in Header */}
              
              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-1">{t('filter.all_genres')}</p>
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  >
                    {uniqueGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre === 'all' ? t('filter.all_genres') : genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-1">الدولة</p>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  >
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country}>
                        {country === 'all' ? 'كل الدول' : country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-1">{t('filter.all_years')}</p>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  >
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year === 'all' ? t('filter.all_years') : year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-1">{t('filter.all_actors')}</p>
                  <select
                    value={filterActor}
                    onChange={(e) => setFilterActor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  >
                    {uniqueActors.map((actor) => (
                      <option key={actor} value={actor}>
                        {actor === 'all' ? t('filter.all_actors') : actor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-600 font-bold"
                >
                  {t('filter.clear')}
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-xs text-blue-500 font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('no_results')}
          </p>
        </div>
      ) : activeTab === 'actors' ? (
        <div className="space-y-16">
          {actors.map((actor) => (
            <HorizontalRow
              key={actor.id}
              title={actor.name}
              items={actor.knownFor}
              type="actor"
              id={actor.id}
              onSelectItem={setSelectedItem}
              activeTab={activeTab}
              filterOrigin={contentFilter}
              filterYear={filterYear}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(genreGroups).map(([genre, items]) => {
            const movieItems = items as Movie[];
            const genreId = movieItems[0]?.genreId;
            return (
              <HorizontalRow
                key={genre}
                title={genre}
                items={movieItems}
                type="genre"
                id={genreId || 0}
                onSelectItem={setSelectedItem}
                activeTab={activeTab}
                filterOrigin={contentFilter}
                filterYear={filterYear}
              />
            );
          })}
        </div>
      )}

      <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {loading && movies.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
        </div>
      )}

      <style>
        {`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        `}
      </style>
    </div>
  );
};

export default LibraryPage;