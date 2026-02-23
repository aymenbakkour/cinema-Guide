
import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    // Ad 1: Script injection
    const script1 = document.createElement('script');
    script1.src = 'https://pl28774765.effectivegatecpm.com/697d5ed923e87eece1a94ac4c69b52dd/invoke.js';
    script1.async = true;
    script1.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script1);

    // Ad 2: atOptions and Script injection
    const ad2Container = document.getElementById('ad-2-container');
    if (ad2Container) {
      const script2Options = document.createElement('script');
      script2Options.innerHTML = `
        atOptions = {
          'key' : '05bab0e8516c3d9a66056b87a3f73707',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      ad2Container.appendChild(script2Options);

      const script2 = document.createElement('script');
      script2.src = 'https://www.highperformanceformat.com/05bab0e8516c3d9a66056b87a3f73707/invoke.js';
      ad2Container.appendChild(script2);
    }

    return () => {
      document.body.removeChild(script1);
      if (ad2Container) {
        ad2Container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-6 bg-gray-100/50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">إعلان / Advertisement</div>
      
      {/* Container for Ad 1 */}
      <div 
        id="container-697d5ed923e87eece1a94ac4c69b52dd" 
        className="min-h-[50px] w-full flex justify-center items-center"
      ></div>

      {/* Container for Ad 2 */}
      <div 
        id="ad-2-container" 
        className="min-h-[50px] w-full flex justify-center items-center"
      ></div>
    </div>
  );
};

export default AdBanner;
