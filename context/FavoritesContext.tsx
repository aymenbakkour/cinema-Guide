import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types';

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: string | number) => void;
  isFavorite: (id: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinema_guide_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cinema_guide_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie: Movie) => {
    setFavorites(prev => {
      if (!prev.find(m => m.id === movie.id)) {
        return [...prev, movie];
      }
      return prev;
    });
  };

  const removeFavorite = (id: string | number) => {
    setFavorites(prev => prev.filter(m => m.id !== id));
  };

  const isFavorite = (id: string | number) => {
    return favorites.some(m => m.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
