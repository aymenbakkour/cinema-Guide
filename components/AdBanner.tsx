
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
    document.body.appendChild(script2Options);

    const script2 = document.createElement('script');
    script2.src = 'https://www.highperformanceformat.com/05bab0e8516c3d9a66056b87a3f73707/invoke.js';
    document.body.appendChild(script2);

    return () => {
      // Cleanup if necessary, though usually not needed for global ads
      document.body.removeChild(script1);
      document.body.removeChild(script2Options);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 my-4">
      {/* Container for Ad 1 */}
      <div id="container-697d5ed923e87eece1a94ac4c69b52dd"></div>
    </div>
  );
};

export default AdBanner;
