

import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { MOCK_MOVIES } from '../constants';
import { Movie } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Library, RefreshCw } from 'lucide-react';

const HomePage: React.FC = () => {
  const { t } = useSettings();
  const [currentRandomMovie, setCurrentRandomMovie] = useState<Movie | null>(null);

  const getRandomMovie = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MOCK_MOVIES.length);
    return MOCK_MOVIES[randomIndex];
  }, []);

  useEffect(() => {
    setCurrentRandomMovie(getRandomMovie());
    const intervalId = setInterval(() => {
      setCurrentRandomMovie(getRandomMovie());
    }, 10000);
    return () => clearInterval(intervalId);
  }, [getRandomMovie]);

  return (
    <div className="container mx-auto px-4 py-8 text-center flex-grow">
      <section className="bg-white dark:bg-gray-800 border border-fuchsia-200 dark:border-fuchsia-800/50 p-8 lg:p-16 rounded-3xl shadow-xl mb-12 animate-fade-in-up transition-colors duration-300">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600 dark:from-fuchsia-400 dark:to-blue-400 mb-6 tracking-tight leading-tight">
          {t('home.welcome')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('home.description')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <NavLink
            to="/library"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Library className="w-5 h-5" />
            {t('home.browse_library')}
          </NavLink>
          <NavLink
            to="/recommend"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t('home.get_recommendation')}
          </NavLink>
        </div>
      </section>

      {/* Random Recommendation Section */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/50 mb-12 animate-fade-in-up transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center text-fuchsia-600 dark:text-fuchsia-400 mb-6 flex items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6" />
          {t('home.random_recommendation')}
        </h2>
        {currentRandomMovie ? (
          <div key={currentRandomMovie.id} className="text-center animate-fade-in-out">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentRandomMovie.titleArabic}</p>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{currentRandomMovie.titleEnglish}</p>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
              {currentRandomMovie.type === 'movie' ? t('type.movie') : t('type.series')} • {currentRandomMovie.genre} ({currentRandomMovie.year}) • {currentRandomMovie.origin === 'arabic' ? t('origin.arabic') : t('origin.foreign')}
            </p>
            {currentRandomMovie.actors && currentRandomMovie.actors.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-500 mt-2 italic">
                {t('home.starring')} {currentRandomMovie.actors.slice(0, 3).join(', ')}{currentRandomMovie.actors.length > 3 ? '...' : ''}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto line-clamp-3 leading-relaxed">
              {currentRandomMovie.synopsisArabic}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">{t('home.loading_recommendation')}</p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:scale-105 animate-fade-in-left">
          <div className="w-12 h-12 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Library className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('home.feature.library.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('home.feature.library.desc')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-100">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('home.feature.smart.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('home.feature.smart.desc')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:scale-105 animate-fade-in-right delay-200">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('home.feature.updates.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('home.feature.updates.desc')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;