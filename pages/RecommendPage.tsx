import React, { useState, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import ItemDetailsModal from '../components/ItemDetailsModal';
import { Movie } from '../types';
import { MOCK_MOVIES } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Dices, Loader2 } from 'lucide-react';

const RecommendPage: React.FC = () => {
  const { t } = useSettings();
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [luckyDipOrigin, setLuckyDipOrigin] = useState<'all' | 'arabic' | 'foreign'>('all');
  const [luckyDipType, setLuckyDipType] = useState<'all' | 'movie' | 'series'>('all');
  const [luckyDipRecommendation, setLuckyDipRecommendation] = useState<Movie | null>(null);
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!prompt.trim()) {
      setError(t('recommend.error.empty'));
      setRecommendations([]);
      setLuckyDipRecommendation(null);
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations([]);
    setLuckyDipRecommendation(null);

    try {
      const lowerCasePrompt = prompt.toLowerCase();
      const filteredRecommendations: Movie[] = MOCK_MOVIES
        .filter(movie => 
          movie.titleArabic.toLowerCase().includes(lowerCasePrompt) ||
          movie.titleEnglish.toLowerCase().includes(lowerCasePrompt) ||
          movie.genre.toLowerCase().includes(lowerCasePrompt) ||
          movie.synopsisArabic.toLowerCase().includes(lowerCasePrompt) ||
          (movie.synopsisEnglish && movie.synopsisEnglish.toLowerCase().includes(lowerCasePrompt)) ||
          movie.actors.some(actor => actor.toLowerCase().includes(lowerCasePrompt))
        )
        .slice(0, 5);

      if (filteredRecommendations.length > 0) {
        setRecommendations(filteredRecommendations);
      } else {
        setError(t('recommend.error.no_results'));
      }
    } catch (err) {
      console.error('Failed to generate local recommendations:', err);
      setError('Error generating recommendations');
    } finally {
      setLoading(false);
    }
  }, [prompt, t]);

  const handleLuckyDip = useCallback(() => {
    setLoading(true);
    setError(null);
    setRecommendations([]);
    setLuckyDipRecommendation(null);

    let items = MOCK_MOVIES;

    if (luckyDipOrigin !== 'all') {
      items = items.filter(item => item.origin === luckyDipOrigin);
    }

    if (luckyDipType !== 'all') {
      items = items.filter(item => item.type === luckyDipType);
    }

    if (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomMovie = items[randomIndex];
      setLuckyDipRecommendation(randomMovie);
    } else {
      setError(t('recommend.error.lucky_dip_empty'));
    }
    setLoading(false);
  }, [luckyDipOrigin, luckyDipType, t]);


  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600 dark:from-fuchsia-400 dark:to-blue-400 mb-8 animate-fade-in-down">
        {t('recommend.title')}
      </h1>

      {/* Prompt-based Recommendation Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 max-w-2xl mx-auto animate-fade-in-up border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <label htmlFor="recommendation-prompt" className="block text-gray-900 dark:text-gray-200 text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fuchsia-500" />
          {t('recommend.prompt_label')}
        </label>
        <textarea
          id="recommendation-prompt"
          className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300 resize-y min-h-[120px]"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('recommend.prompt_placeholder')}
          disabled={loading}
        ></textarea>
        <button
          onClick={fetchRecommendations}
          className="mt-4 w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loading || !prompt.trim()}
        >
          {loading && prompt.trim() ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              {t('recommend.searching')}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {t('recommend.button')}
            </>
          )}
        </button>
      </div>

      <div className="text-center text-gray-400 text-xl font-semibold my-6">
        {t('recommend.or')}
      </div>

      {/* Lucky Dip Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto animate-fade-in-up border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 text-center flex items-center justify-center gap-2">
          <Dices className="w-6 h-6" />
          {t('recommend.lucky_dip.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 text-center">
          {t('recommend.lucky_dip.desc')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          {/* Origin Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setLuckyDipOrigin('all')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                luckyDipOrigin === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.all_origins')}
            </button>
            <button
              onClick={() => setLuckyDipOrigin('arabic')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                luckyDipOrigin === 'arabic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.arabic')}
            </button>
            <button
              onClick={() => setLuckyDipOrigin('foreign')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                luckyDipOrigin === 'foreign'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.foreign')}
            </button>
          </div>
          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setLuckyDipType('all')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                luckyDipType === 'all'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.all_types')}
            </button>
            <button
              onClick={() => setLuckyDipType('movie')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                luckyDipType === 'movie'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.movies')}
            </button>
            <button
              onClick={() => setLuckyDipType('series')}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                luckyDipType === 'series'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('filter.series')}
            </button>
          </div>
        </div>
        <button
          onClick={handleLuckyDip}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && !prompt.trim() ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              {t('recommend.lucky_dip.loading')}
            </>
          ) : (
            <>
              <Dices className="w-5 h-5" />
              {t('recommend.lucky_dip.button')}
            </>
          )}
        </button>
      </div>


      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 p-4 rounded-xl shadow-sm max-w-2xl mx-auto mb-8 mt-8 text-center animate-fade-in">
          {error}
        </div>
      )}

      {(recommendations.length > 0 || luckyDipRecommendation) && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-fuchsia-600 dark:text-fuchsia-400 mb-6">
            {t('recommend.results.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {luckyDipRecommendation ? (
              <MovieCard item={luckyDipRecommendation} onClick={() => setSelectedItem(luckyDipRecommendation)} />
            ) : (
              recommendations.map((rec, index) => (
                <MovieCard key={index} item={rec} onClick={() => setSelectedItem(rec)} />
              ))
            )}
          </div>
        </div>
      )}

      <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <style>
        {`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        `}
      </style>
    </div>
  );
};

export default RecommendPage;