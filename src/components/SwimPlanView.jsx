import { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

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
        {/* Single Swim Card - matching Reservations style */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-white shadow-2xl w-full max-w-none sm:max-w-md relative mx-1 sm:mx-0 flex flex-col h-full">
          
          {/* Card Title */}
          <h3 className="text-lg font-medium mb-4 text-center text-slate-200">Swim</h3>
          
          {/* Shoulder Pain Level Section */}
          <div className="mb-6">
            {/* Left-aligned layout: Control on left, text on right */}
            <div className="flex items-center gap-6">
              {/* Left Side - Up/Down Chevron Control */}
              <div className="flex flex-col items-center">
                {/* Up Button */}
                <button
                  onClick={() => setShoulderPain(prev => Math.min(10, prev + 1))}
                  disabled={shoulderPain === 10}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronUpIcon className="w-6 h-6 text-slate-300" />
                </button>
                
                {/* Pain Level Display Circle - smaller with scroll control */}
                <div 
                  className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors -my-1"
                  onWheel={(e) => {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -1 : 1; // Scroll down decreases, scroll up increases
                    setShoulderPain(prev => Math.max(0, Math.min(10, prev + delta)));
                  }}
                  style={{ touchAction: 'none' }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const startY = e.touches[0].clientY;
                    const startValue = shoulderPain;
                    
                    const handleTouchMove = (moveEvent) => {
                      if (moveEvent.touches.length === 0) return;
                      moveEvent.preventDefault();
                      const touch = moveEvent.touches[0];
                      const deltaY = touch.clientY - startY;
                      const delta = Math.round(deltaY / 15); // Touch sensitivity - made more sensitive
                      const newValue = Math.max(0, Math.min(10, startValue - delta)); // Up increases, down decreases
                      setShoulderPain(newValue);
                    };
                    
                    const handleTouchEnd = () => {
                      document.removeEventListener('touchmove', handleTouchMove, { passive: false });
                      document.removeEventListener('touchend', handleTouchEnd, { passive: false });
                    };
                    
                    document.addEventListener('touchmove', handleTouchMove, { passive: false });
                    document.addEventListener('touchend', handleTouchEnd, { passive: false });
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const startY = e.clientY;
                    const startValue = shoulderPain;
                    
                    const handleMouseMove = (moveEvent) => {
                      const deltaY = moveEvent.clientY - startY;
                      const delta = Math.round(deltaY / 10); // Mouse sensitivity
                      const newValue = Math.max(0, Math.min(10, startValue - delta)); // Up increases, down decreases
                      setShoulderPain(newValue);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <span className="text-lg font-bold text-white select-none">
                    {shoulderPain}
                  </span>
                </div>
                
                {/* Down Button */}
                <button
                  onClick={() => setShoulderPain(prev => Math.max(0, prev - 1))}
                  disabled={shoulderPain === 0}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronDownIcon className="w-6 h-6 text-slate-300" />
                </button>
              </div>
              
              {/* Right Side - Title */}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-slate-200 text-left">What is your shoulder pain level?</h4>
                <div className="text-xs text-slate-200 mt-1 text-left">0 - no pain, 10 - worst pain</div>
              </div>
            </div>
          </div>
          {/* Workout Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-200 mb-3">Workout 30 min</h4>
            
            {/* Interval 1 - Breaststroke */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex gap-4">
                {/* Left Column - Icon */}
                <div className="flex flex-col items-center justify-start flex-shrink-0">
                  {/* Icon with subtle background circle */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                      <div 
                        className="w-10 h-10"
                        style={{
                          WebkitMask: 'url(./images/noun-breaststroke-243000.svg) no-repeat center / contain',
                          mask: 'url(./images/noun-breaststroke-243000.svg) no-repeat center / contain',
                          backgroundColor: 'currentColor'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Time + Title + Description */}
                <div className="flex-1 pt-1">
                  <h5 className="font-medium text-slate-200 mb-2 text-left">
                    <span className="text-[#A8F5E0] font-bold text-base mr-2">15 min</span>
                    Breaststroke
                  </h5>
                  <p className="text-sm text-slate-300 leading-normal text-left">
                    Start with gentle breaststroke sculling and gradually progress to breaststroke as tolerated
                  </p>
                </div>
              </div>
            </div>

            {/* Interval 2 - Freestyle */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex gap-4">
                {/* Left Column - Icon */}
                <div className="flex flex-col items-center justify-start flex-shrink-0">
                  {/* Icon with subtle background circle */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                      <div 
                        className="w-10 h-10"
                        style={{
                          WebkitMask: 'url(./images/noun-freestyle-243002.svg) no-repeat center / contain',
                          mask: 'url(./images/noun-freestyle-243002.svg) no-repeat center / contain',
                          backgroundColor: 'currentColor'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Time + Title + Description */}
                <div className="flex-1 pt-1">
                  <h5 className="font-medium text-slate-200 mb-2 text-left">
                    <span className="text-[#A8F5E0] font-bold text-base mr-2">10 min</span>
                    Freestyle
                  </h5>
                  <p className="text-sm text-slate-300 leading-normal text-left">
                    Consider a modified freestyle with a shorter, more controlled stroke, avoiding excessive arm extension and rotation.
                  </p>
                </div>
              </div>
            </div>

            {/* Interval 3 - Cool Down */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex gap-4">
                {/* Left Column - Icon */}
                <div className="flex flex-col items-center justify-start flex-shrink-0">
                  {/* Icon with subtle background circle - using snowflake for cool down */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                      <div 
                        className="w-10 h-10"
                        style={{
                          WebkitMask: 'url(./images/noun-snowflake-7926919.svg) no-repeat center / contain',
                          mask: 'url(./images/noun-snowflake-7926919.svg) no-repeat center / contain',
                          backgroundColor: 'currentColor'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Time + Title + Description */}
                <div className="flex-1 pt-1">
                  <h5 className="font-medium text-slate-200 mb-2 text-left">
                    <span className="text-[#A8F5E0] font-bold text-base mr-2">5 min</span>
                    Cool Down
                  </h5>
                  <p className="text-sm text-slate-300 leading-normal text-left">
                    Easy backstroke or gentle floating to help your shoulder muscles relax
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SwimPlanView;
