
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-8 mt-auto border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-medium">
          {t('footer.copyright').replace('{year}', currentYear.toString())}
        </p>
        
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{t('footer.developed_by')}</span>
          <a 
            href="https://behance.net/aymenbakkour" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-fuchsia-600 dark:text-fuchsia-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
          >
            {t('footer.developer_name')}
            <Heart className="w-3 h-3 fill-current" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
