import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Theme = 'dark' | 'light';
type ContentFilter = 'all' | 'arabic' | 'foreign';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  contentFilter: ContentFilter;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  setContentFilter: (filter: ContentFilter) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'app.title': 'دليلك للسينما',
    'nav.home': 'الرئيسية',
    'nav.library': 'المكتبة',
    'nav.recommend': 'اقتراح',
    'library.title': 'مكتبة الأفلام والمسلسلات',
    'search.placeholder': 'ابحث عن فيلم أو مسلسل أو ممثل...',
    'filter.all_types': 'الكل (نوع)',
    'filter.movies': 'أفلام',
    'filter.series': 'مسلسلات',
    'filter.all_origins': 'الكل (أصل)',
    'filter.arabic': 'عربي',
    'filter.foreign': 'أجنبي',
    'filter.all_genres': 'جميع الأنواع',
    'filter.all_years': 'جميع السنوات',
    'filter.all_actors': 'جميع الممثلين',
    'no_results': 'لا توجد نتائج مطابقة لبحثك أو فلاترك.',
    'card.english_title': 'العنوان الإنجليزي:',
    'card.year': 'السنة:',
    'card.genre': 'النوع:',
    'card.type': 'التصنيف:',
    'card.origin': 'الأصل:',
    'card.actors': 'الممثلون:',
    'card.synopsis': 'القصة:',
    'type.movie': 'فيلم',
    'type.series': 'مسلسل',
    'origin.arabic': 'عربي',
    'origin.foreign': 'أجنبي',
    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'theme.dark': 'ليلي',
    'theme.light': 'نهاري',
    'language.ar': 'العربية',
    'language.en': 'English',
    'close': 'إغلاق',
    
    // Home Page
    'home.welcome': 'مرحبًا بك في دليلك الشامل للسينما!',
    'home.description': 'اكتشف عالمًا من الأفلام والمسلسلات العربية والأجنبية. استعرض مكتبتنا الغنية، أو دع ذكاءنا الاصطناعي يقترح عليك تحفتك الفنية القادمة.',
    'home.browse_library': 'استعرض المكتبة',
    'home.get_recommendation': 'احصل على اقتراح',
    'home.random_recommendation': 'اقتراح عشوائي لك!',
    'home.loading_recommendation': 'جاري تحميل الاقتراح...',
    'home.feature.library.title': 'مكتبة شاملة',
    'home.feature.library.desc': 'تصفح قائمة واسعة من الأفلام والمسلسلات مع تفاصيل قصصها كاملة.',
    'home.feature.smart.title': 'اقتراحات ذكية',
    'home.feature.smart.desc': 'احصل على توصيات مخصصة بناءً على ذوقك وتفضيلاتك.',
    'home.feature.updates.title': 'تحديث مستمر',
    'home.feature.updates.desc': 'نضيف محتوى جديد بانتظام لتجد دائمًا ما يشاهد.',
    'home.starring': 'بطولة:',

    // Recommend Page
    'recommend.title': 'اقتراح فيلم أو مسلسل',
    'recommend.prompt_label': 'صف نوع الفيلم/المسلسل الذي تبحث عنه:',
    'recommend.prompt_placeholder': 'مثال: أريد فيلم أكشن مليئ بالإثارة مع قصة قوية، أو مسلسل درامي تاريخي من إنتاج عربي، أو فيلم من بطولة أحمد حلمي...',
    'recommend.button': 'احصل على اقتراح',
    'recommend.searching': 'جاري البحث في المكتبة...',
    'recommend.or': 'أو',
    'recommend.lucky_dip.title': 'ضربة حظ!',
    'recommend.lucky_dip.desc': 'اختر تفضيلاتك ودعنا نختار لك فيلمًا أو مسلسلًا عشوائيًا.',
    'recommend.lucky_dip.button': 'ضربة حظ!',
    'recommend.lucky_dip.loading': 'جاري اختيار ضربة حظ...',
    'recommend.results.title': 'اقتراحاتنا لك:',
    'recommend.error.empty': 'الرجاء إدخال تفضيلاتك للحصول على اقتراحات.',
    'recommend.error.no_results': 'تعذر العثور على اقتراحات مطابقة في المكتبة المحلية. يرجى المحاولة بكلمات مفتاحية أخرى.',
    'recommend.error.lucky_dip_empty': 'لا توجد عناصر مطابقة لتفضيلات ضربة الحظ. يرجى تغيير الفلاتر.',
    
    // Footer
    'footer.copyright': '© {year} دليلك للسينما. جميع الحقوق محفوظة.',
    'footer.developed_by': 'تم التطوير بواسطة',
    'footer.developer_name': 'أيمن بكور',
  },
  en: {
    'app.title': 'Cinema Guide',
    'nav.home': 'Home',
    'nav.library': 'Library',
    'nav.recommend': 'Recommend',
    'library.title': 'Movies & Series Library',
    'search.placeholder': 'Search for a movie, series, or actor...',
    'filter.all_types': 'All Types',
    'filter.movies': 'Movies',
    'filter.series': 'Series',
    'filter.all_origins': 'All Origins',
    'filter.arabic': 'Arabic',
    'filter.foreign': 'Foreign',
    'filter.all_genres': 'All Genres',
    'filter.all_years': 'All Years',
    'filter.all_actors': 'All Actors',
    'no_results': 'No results found matching your search or filters.',
    'card.english_title': 'English Title:',
    'card.year': 'Year:',
    'card.genre': 'Genre:',
    'card.type': 'Type:',
    'card.origin': 'Origin:',
    'card.actors': 'Actors:',
    'card.synopsis': 'Synopsis:',
    'type.movie': 'Movie',
    'type.series': 'Series',
    'origin.arabic': 'Arabic',
    'origin.foreign': 'Foreign',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'theme.dark': 'Dark',
    'theme.light': 'Light',
    'language.ar': 'Arabic',
    'language.en': 'English',
    'close': 'Close',

    // Home Page
    'home.welcome': 'Welcome to Your Comprehensive Cinema Guide!',
    'home.description': 'Discover a world of Arabic and international movies and series. Browse our rich library, or let our AI suggest your next masterpiece.',
    'home.browse_library': 'Browse Library',
    'home.get_recommendation': 'Get Recommendation',
    'home.random_recommendation': 'Random Recommendation for You!',
    'home.loading_recommendation': 'Loading recommendation...',
    'home.feature.library.title': 'Comprehensive Library',
    'home.feature.library.desc': 'Browse a wide list of movies and series with full story details.',
    'home.feature.smart.title': 'Smart Recommendations',
    'home.feature.smart.desc': 'Get personalized recommendations based on your taste and preferences.',
    'home.feature.updates.title': 'Continuous Updates',
    'home.feature.updates.desc': 'We add new content regularly so you always find something to watch.',
    'home.starring': 'Starring:',

    // Recommend Page
    'recommend.title': 'Recommend a Movie or Series',
    'recommend.prompt_label': 'Describe the type of movie/series you are looking for:',
    'recommend.prompt_placeholder': 'Example: I want an action-packed movie with a strong story, or a historical drama series of Arabic production, or a movie starring Ahmed Helmy...',
    'recommend.button': 'Get Recommendation',
    'recommend.searching': 'Searching library...',
    'recommend.or': 'OR',
    'recommend.lucky_dip.title': 'Lucky Dip!',
    'recommend.lucky_dip.desc': 'Choose your preferences and let us pick a random movie or series for you.',
    'recommend.lucky_dip.button': 'Lucky Dip!',
    'recommend.lucky_dip.loading': 'Picking a lucky dip...',
    'recommend.results.title': 'Our Recommendations:',
    'recommend.error.empty': 'Please enter your preferences to get recommendations.',
    'recommend.error.no_results': 'No matching recommendations found in local library. Please try other keywords.',
    'recommend.error.lucky_dip_empty': 'No items match your lucky dip preferences. Please change filters.',

    // Footer
    'footer.copyright': '© {year} Cinema Guide. All rights reserved.',
    'footer.developed_by': 'Developed by',
    'footer.developer_name': 'Aymen Bakkour',
  },
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('dark');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');

  useEffect(() => {
    // Apply theme class to html element
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // Set direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, theme, contentFilter, toggleLanguage, toggleTheme, setContentFilter, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
