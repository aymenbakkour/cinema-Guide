import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Film } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import SettingsModal from './SettingsModal';

const Header: React.FC = () => {
  const { t } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white p-4 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Film className="w-8 h-8" />
            <span>{t('app.title')}</span>
          </NavLink>
          
          <div className="flex items-center gap-6 text-lg font-medium">
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
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label={t('settings.title')}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;