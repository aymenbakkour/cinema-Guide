
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import RecommendPage from './pages/RecommendPage';
import FavoritesPage from './pages/FavoritesPage';
import { SettingsProvider } from './context/SettingsContext';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/recommend" element={<RecommendPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
          <AdBanner />
          <Footer />
        </div>
      </FavoritesProvider>
    </SettingsProvider>
  );
}

export default App;
