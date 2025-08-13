import { useState, useRef, useEffect } from 'react';

function SwimPlanView() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shoulderPain, setShoulderPain] = useState(3); // 0-10 scale

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const timer = setTimeout(() => {
        video.pause();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Pain level options (0 = no pain, 10 = worst pain)
  const painLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
        {/* Single Workout Card - matching Reservations style */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-white shadow-2xl w-full max-w-none sm:max-w-md relative mx-1 sm:mx-0 flex flex-col h-full">
          
          {/* Card Title */}
          <h3 className="text-lg font-medium mb-6 text-center text-slate-200">Workout</h3>
          
          {/* Shoulder Pain Level Section */}
          <div className="mb-8">
            <h4 className="text-sm font-medium mb-4 text-slate-200">What is your shoulder pain level?</h4>
            
            {/* Scrollable Pain Level Selector */}
            <div className="relative">
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                {painLevels.map((level, index) => {
                  // Calculate opacity based on position - fade first 2 and last 2 circles
                  let opacityClass = '';
                  if (index === 0) opacityClass = 'opacity-30';
                  else if (index === 1) opacityClass = 'opacity-60';
                  else if (index === painLevels.length - 2) opacityClass = 'opacity-60';
                  else if (index === painLevels.length - 1) opacityClass = 'opacity-30';
                  else opacityClass = 'opacity-100';
                  
                  return (
                    <button
                      key={level}
                      onClick={() => setShoulderPain(level)}
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${opacityClass} ${
                        shoulderPain === level
                          ? 'bg-[#A8F5E0] text-slate-800'
                          : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700/70'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-400 mt-3 px-2">
              <span>No pain</span>
              <span>Worst pain</span>
            </div>
          </div>

          {/* Swim Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-200 mb-4">Swim</h4>
            
            {/* Interval 1 - Breaststroke */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-slate-200">Breaststroke</h5>
                <span className="text-[#A8F5E0] font-semibold text-sm">15 min</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed text-left">
                Start with gentle breaststroke sculling and gradually progress to breaststroke as tolerated
              </p>
            </div>

            {/* Interval 2 - Freestyle */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-slate-200">Freestyle</h5>
                <span className="text-[#A8F5E0] font-semibold text-sm">10 min</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed text-left">
                Consider a modified freestyle with a shorter, more controlled stroke, avoiding excessive arm extension and rotation.
              </p>
            </div>

            {/* Interval 3 - Cool Down */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-slate-200">Cool Down</h5>
                <span className="text-[#A8F5E0] font-semibold text-sm">5 min</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed text-left">
                Easy backstroke or gentle floating to help your shoulder muscles relax
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SwimPlanView;
