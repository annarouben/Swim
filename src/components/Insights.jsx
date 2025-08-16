import { useState, useRef, useEffect } from 'react';
import { ChartPieIcon, HeartIcon } from '@heroicons/react/24/solid';
import SwimPerformance from './SwimPerformance';
import Health from './Health';

function Insights() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('performance'); // 'performance' or 'health'

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
          <h3 className="text-lg font-medium mb-4 text-center text-slate-200">Insights</h3>
          
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="bg-slate-800/50 rounded-full p-1 flex relative">
              {/* Background slider that moves */}
              <div 
                className={`absolute top-1 bottom-1 bg-[#A8F5E0] rounded-full transition-all duration-300 ease-in-out w-1/2 ${
                  activeTab === 'performance' ? 'left-1' : 'right-1'
                }`}
              />
              
              {/* Tab buttons */}
              <button
                onClick={() => setActiveTab('performance')}
                className={`relative z-10 px-4 py-2 text-sm font-medium transition-all duration-200 flex-1 flex items-center justify-center gap-2 ${
                  activeTab === 'performance'
                    ? 'text-slate-900'
                    : 'text-slate-300'
                }`}
              >
                <ChartPieIcon className="w-4 h-4" />
                Swimming
              </button>
              
              <button
                onClick={() => setActiveTab('health')}
                className={`relative z-10 px-4 py-2 text-sm font-medium transition-all duration-200 flex-1 flex items-center justify-center gap-2 ${
                  activeTab === 'health'
                    ? 'text-slate-900'
                    : 'text-slate-300'
                }`}
              >
                <HeartIcon className="w-4 h-4" />
                Health
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'performance' ? (
              <SwimPerformance />
            ) : (
              <Health />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Insights;
