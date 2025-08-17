import { useState, useRef, useEffect } from 'react';
import SwimPerformance from './SwimPerformance';
import Health from './Health';

function Insights() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const timer = setTimeout(() => {
        video.pause();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline
        preload="auto"
        className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onCanPlay={() => setVideoLoaded(true)}
        onLoadedData={() => setVideoLoaded(true)}
        onError={(e) => console.log('Video failed to load:', e)}
      >
        <source src="./images/movingwater.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-10 pb-24 px-0 sm:px-3 min-h-screen">
        {/* Main Card Container */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-white shadow-2xl w-full max-w-none sm:max-w-md relative mx-1 sm:mx-0 flex flex-col h-full">
          
          {/* Card Title */}
          <h3 className="text-lg font-medium mb-6 text-center text-slate-200">Insights</h3>
          
          {/* Combined Content - Swimming Performance + Health */}
          <div className="space-y-6">
            {/* Swimming Performance Section */}
            <SwimPerformance />
            
            {/* Health Section with divider */}
            <div className="border-t border-slate-700/50 pt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3 text-left">Health Metrics</h4>
              <Health />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Insights;
