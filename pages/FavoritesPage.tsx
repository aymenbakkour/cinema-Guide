import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';
import MovieCard from '../components/MovieCard';
import ItemDetailsModal from '../components/ItemDetailsModal';
import { Movie } from '../types';
import { Heart } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { t, contentFilter } = useSettings();
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);

  const filteredFavorites = favorites.filter(movie => {
    if (contentFilter === 'all') return true;
    return movie.origin === contentFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8 flex-grow max-w-6xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600 dark:from-fuchsia-400 dark:to-blue-400 mb-8 animate-fade-in-down flex items-center justify-center gap-3">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        {t('favorites.title')}
      </h1>

      {filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('favorites.empty')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredFavorites.map((movie) => (
            <MovieCard key={movie.id} item={movie} onClick={() => setSelectedItem(movie)} />
          ))}
        </div>
      )}

      <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default FavoritesPage;
