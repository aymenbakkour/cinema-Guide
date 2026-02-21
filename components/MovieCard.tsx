import React from 'react';
import { Movie, Recommendation } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Film, Tv, Globe, Users, Calendar, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  item: Movie | Recommendation;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const { t } = useSettings();
  const isMovieFromLibrary = (item as Movie).id !== undefined;
  const movie = item as Movie;

  // Determine colors based on type
  const isMovie = isMovieFromLibrary && movie.type === 'movie';
  const typeColor = isMovie ? 'text-blue-600 dark:text-blue-400' : 'text-fuchsia-600 dark:text-fuchsia-400';
  const badgeBg = isMovie ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-fuchsia-100 dark:bg-fuchsia-900/30';
  const badgeText = isMovie ? 'text-blue-700 dark:text-blue-300' : 'text-fuchsia-700 dark:text-fuchsia-300';
  const borderColor = isMovie ? 'hover:border-blue-500' : 'hover:border-fuchsia-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 ${borderColor} hover:-translate-y-2`}
    >
      {isMovieFromLibrary && movie.imageUrl && (
        <div className="relative h-64 overflow-hidden">
          <img 
            src={movie.imageUrl} 
            alt={movie.titleArabic} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <p className="text-white text-sm line-clamp-3">{movie.synopsisArabic}</p>
          </div>
          {movie.rating && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 font-bold text-sm">
              <Star className="w-3 h-3 fill-current" />
              {movie.rating.toFixed(1)}
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex-grow flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className={`text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:${isMovie ? 'text-blue-500' : 'text-fuchsia-500'} transition-colors`}>
            {item.titleArabic}
          </h3>
          {isMovieFromLibrary && (
            <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 flex-shrink-0 ${badgeBg} ${badgeText}`}>
              {isMovie ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
              {isMovie ? t('type.movie') : t('type.series')}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
          {item.titleEnglish}
        </div>

        {isMovieFromLibrary && (
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{movie.year || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>{movie.origin === 'arabic' ? t('origin.arabic') : t('origin.foreign')}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{movie.genre}</span>
            </div>
          </div>
        )}

        {isMovieFromLibrary && movie.actors && movie.actors.length > 0 && (
          <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{movie.actors.join(', ')}</span>
          </div>
        )}

        {!isMovieFromLibrary && (
           <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
              {item.synopsisArabic}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;