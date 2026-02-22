import React from 'react';
import { Movie, Recommendation } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Film, Tv, Globe, Users, Calendar, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  item: Movie | Recommendation;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onClick }) => {
  const { t } = useSettings();
  const isMovieFromLibrary = (item as Movie).id !== undefined;
  const movie = item as Movie;

  // Determine colors based on type
  const isMovie = isMovieFromLibrary && movie.type === 'movie';
  const typeColor = isMovie ? 'text-blue-600 dark:text-blue-400' : 'text-fuchsia-600 dark:text-fuchsia-400';
  const badgeBg = isMovie ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-fuchsia-100 dark:bg-fuchsia-900/30';
  const badgeText = isMovie ? 'text-blue-700 dark:text-blue-300' : 'text-fuchsia-700 dark:text-fuchsia-300';
  const borderColor = isMovie ? 'border-blue-500/40 group-hover:border-blue-500' : 'border-fuchsia-500/40 group-hover:border-fuchsia-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 border-[3px] ${borderColor} hover:-translate-y-2 cursor-pointer h-full`}
    >
      {isMovieFromLibrary && (
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-900/50">
          <img 
            src={movie.imageUrl || `https://picsum.photos/seed/${movie.id}/400/600`} 
            alt={movie.titleArabic} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
             <p className="text-white text-xs line-clamp-4 leading-relaxed">{movie.synopsisArabic}</p>
          </div>
          {movie.rating && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 font-bold text-[10px] sm:text-xs border border-white/10">
              <Star className="w-3 h-3 fill-current" />
              {movie.rating.toFixed(1)}
            </div>
          )}
        </div>
      )}

      <div className="p-3 sm:p-4 flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className={`text-xs sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:${isMovie ? 'text-blue-500' : 'text-fuchsia-500'} transition-colors leading-tight`}>
            {item.titleArabic}
          </h3>
          {isMovieFromLibrary && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 flex-shrink-0 ${badgeBg} ${badgeText}`}>
              {isMovie ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
              {isMovie ? t('type.movie') : t('type.series')}
            </span>
          )}
        </div>

        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
          {item.titleEnglish}
        </div>

        {isMovieFromLibrary && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mt-auto">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="truncate">{movie.year || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-400" />
              <span className="truncate">{movie.origin === 'arabic' ? t('origin.arabic') : t('origin.foreign')}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
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