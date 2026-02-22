import React from 'react';
import { Movie, Actor } from '../types';
import { X, Star, Calendar, Globe, Tag, Film, Tv, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemDetailsModalProps {
  item: Movie | Actor | null;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isMovie = (item as Movie).type !== undefined;
  const movie = item as Movie;
  const actor = item as Actor;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-gray-100 dark:border-gray-800"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[110] p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-colors hidden md:block"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Side: Image */}
          <div className={`w-full md:w-2/5 h-72 md:h-auto relative bg-gray-100 dark:bg-gray-800 border-b md:border-b-0 md:border-l border-gray-100 dark:border-gray-800 ${!isMovie ? 'p-8' : ''}`}>
            <img
              src={isMovie ? movie.imageUrl : actor.profilePath}
              alt={isMovie ? movie.titleArabic : actor.name}
              className={`w-full h-full ${!isMovie ? 'object-contain rounded-2xl shadow-xl' : 'object-contain md:object-cover'}`}
            />
            {isMovie && movie.rating && (
              <div className="absolute bottom-4 left-4 bg-yellow-500 text-black px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-lg text-sm">
                <Star className="w-4 h-4 fill-current" />
                {movie.rating.toFixed(1)}
              </div>
            )}
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isMovie ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${movie.type === 'movie' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300'}`}>
                      {movie.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                      {movie.type === 'movie' ? 'فيلم' : 'مسلسل'}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <Users className="w-3 h-3" />
                      ممثل
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {isMovie ? (movie.origin === 'arabic' ? 'عربي' : 'أجنبي') : (actor.origin === 'arabic' ? 'عربي' : 'أجنبي')}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                  {isMovie ? movie.titleArabic : actor.name}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                  {isMovie ? movie.titleEnglish : actor.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {isMovie && (
                  <>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">السنة</p>
                        <p className="font-bold">{movie.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">التصنيف</p>
                        <p className="font-bold">{movie.genre}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  {isMovie ? 'القصة' : 'أبرز الأعمال'}
                </h3>
                {isMovie ? (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {movie.synopsisArabic}
                  </p>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {actor.knownFor.map((m) => (
                      <div key={m.id} className="flex-shrink-0 w-32">
                        <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2">
                          <img src={m.imageUrl} alt={m.titleArabic} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">{m.titleArabic}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isMovie && movie.actors && movie.actors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    طاقم التمثيل
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.actors.map((a, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItemDetailsModal;
