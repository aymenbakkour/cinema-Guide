import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Film } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import SettingsModal from './SettingsModal';

const Header: React.FC = () => {
  const { t, contentFilter, setContentFilter } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white p-3 sm:p-4 shadow-sm sticky top-0 z-[60] border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <nav className="container mx-auto flex flex-row justify-between items-center gap-2">
          <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0">
            <Film className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="hidden xs:inline">{t('app.title')}</span>
          </NavLink>
          
          <div className="flex items-center gap-3 sm:gap-6 text-sm sm:text-lg font-medium">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
              <button
                onClick={() => setContentFilter(contentFilter === 'arabic' ? 'all' : 'arabic')}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all ${
                  contentFilter === 'arabic'
                    ? 'bg-white dark:bg-gray-600 text-fuchsia-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setContentFilter(contentFilter === 'foreign' ? 'all' : 'foreign')}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all ${
                  contentFilter === 'foreign'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                أجنبي
              </button>
            </div>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                  isActive ? 'text-fuchsia-600 dark:text-fuchsia-400 font-bold' : ''
                }`
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                  isActive ? 'text-fuchsia-600 dark:text-fuchsia-400 font-bold' : ''
                }`
              }
            >
              {t('nav.library')}
            </NavLink>
            <NavLink
              to="/recommend"
              className={({ isActive }) =>
                `hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                  isActive ? 'text-fuchsia-600 dark:text-fuchsia-400 font-bold' : ''
                }`
              }
            >
              {t('nav.recommend')}
            </NavLink>
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label={t('settings.title')}
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </nav>
      </header>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;