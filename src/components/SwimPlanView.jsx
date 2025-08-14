import { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

function SwimPlanView() {
  const videoRef = useRef(null);
  const scrollRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shoulderPain, setShoulderPain] = useState(3); // 0-10 scale
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Additional state for sphere controls
  const [realisticSpherePain, setRealisticSpherePain] = useState(3);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const timer = setTimeout(() => {
        video.pause();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Initial loading spin animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(false);
    }, 2000); // Spin for 2 seconds on load
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to update button opacities
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollPosition(scrollContainer.scrollLeft);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll position and button position
  const getButtonOpacity = (index) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return 1;

    const containerWidth = scrollContainer.clientWidth;
    const buttonWidth = 48; // w-12 = 48px
    const gap = 16; // gap-4 = 16px
    const buttonStart = index * (buttonWidth + gap);
    const buttonCenter = buttonStart + buttonWidth / 2;
    
    const fadeZone = 32; // 32px fade zone on each side
    
    // Left edge fade
    if (buttonCenter < scrollPosition + fadeZone) {
      const distance = scrollPosition + fadeZone - buttonCenter;
      const opacity = Math.max(0.2, 1 - (distance / fadeZone));
      return opacity;
    }
    
    // Right edge fade
    const rightEdge = scrollPosition + containerWidth;
    if (buttonCenter > rightEdge - fadeZone) {
      const distance = buttonCenter - (rightEdge - fadeZone);
      const opacity = Math.max(0.2, 1 - (distance / fadeZone));
      return opacity;
    }
    
    return 1;
  };

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
        {/* Single Swim Card - matching Reservations style */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-white shadow-2xl w-full max-w-none sm:max-w-md relative mx-1 sm:mx-0 flex flex-col h-full">
          
          {/* Card Title */}
          <h3 className="text-lg font-medium mb-4 text-center text-slate-200">Swim</h3>
          
          {/* Shoulder Pain Level Section */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-4 text-slate-200">What is your shoulder pain level?</h4>
            
            {/* Scrollable Pain Level Selector */}
            <div className="relative">
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide" 
                style={{ scrollBehavior: 'smooth' }}
              >
                {painLevels.map((level, index) => {
                  const opacity = getButtonOpacity(index);
                  
                  return (
                    <button
                      key={level}
                      onClick={() => setShoulderPain(level)}
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        shoulderPain === level
                          ? 'bg-[#A8F5E0] text-slate-800'
                          : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700/70'
                      }`}
                      style={{ opacity }}
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

            {/* Alternative Controls Section */}
            <div className="mt-8 space-y-6">
              <h5 className="text-xs font-medium text-slate-400 text-center">Alternative Control (Testing)</h5>
              
              {/* 3D Sphere */}
              <div className="text-center">
                <div className="flex justify-center">
                  <div 
                    className="relative w-20 h-20 cursor-pointer select-none"
                    style={{ touchAction: 'none' }}
                    onMouseDown={(e) => {
                      // Don't start drag if clicking on chevron buttons
                      if (e.target.closest('button')) return;
                      
                      const startY = e.clientY;
                      const handleMouseMove = (moveEvent) => {
                        const deltaY = moveEvent.clientY - startY;
                        const delta = Math.round(deltaY / 15); // Only vertical movement
                        const newValue = Math.max(0, Math.min(10, realisticSpherePain - delta)); // Drag up increases, drag down decreases
                        setRealisticSpherePain(newValue);
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                    onTouchStart={(e) => {
                      // Don't start drag if touching chevron buttons
                      if (e.target.closest('button')) return;
                      
                      e.preventDefault(); // Prevent scrolling
                      const startY = e.touches[0].clientY;
                      const startValue = realisticSpherePain;
                      
                      const handleTouchMove = (moveEvent) => {
                        if (moveEvent.touches.length === 0) return;
                        moveEvent.preventDefault(); // Prevent scrolling during drag
                        const touch = moveEvent.touches[0];
                        const deltaY = touch.clientY - startY;
                        const delta = Math.round(deltaY / 15); // Only vertical movement
                        const newValue = Math.max(0, Math.min(10, startValue - delta));
                        setRealisticSpherePain(newValue);
                      };
                      
                      const handleTouchEnd = (endEvent) => {
                        endEvent.preventDefault();
                        document.removeEventListener('touchmove', handleTouchMove, { passive: false });
                        document.removeEventListener('touchend', handleTouchEnd);
                      };
                      
                      document.addEventListener('touchmove', handleTouchMove, { passive: false });
                      document.addEventListener('touchend', handleTouchEnd);
                    }}
                  >
                    {/* 3D Sphere with organic texture */}
                    <div 
                      className={`w-20 h-20 rounded-full relative transition-all duration-300 hover:scale-105 ${
                        isSpinning ? 'animate-spin-vertical' : ''
                      }`}
                      style={{
                        background: `radial-gradient(circle at 25% 25%, 
                          rgba(148, 163, 184, 0.9), 
                          rgba(100, 116, 139, 0.7) 40%,
                          rgba(71, 85, 105, 0.8) 70%,
                          rgba(51, 65, 85, 0.9) 100%)`,
                        boxShadow: `
                          inset -8px -8px 16px rgba(0,0,0,0.5),
                          inset 4px 4px 12px rgba(255,255,255,0.2),
                          inset -2px -2px 6px rgba(0,0,0,0.3),
                          0 12px 24px rgba(0,0,0,0.4),
                          0 4px 8px rgba(0,0,0,0.2)
                        `,
                        transform: 'perspective(100px)'
                      }}
                    >
                      {/* Organic surface texture - subtle latitude lines */}
                      <div 
                        className="absolute inset-1 rounded-full"
                        style={{
                          background: `repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            rgba(255,255,255,0.03) 8px,
                            transparent 16px
                          ), repeating-linear-gradient(
                            90deg,
                            transparent 0px,
                            rgba(255,255,255,0.02) 12px,
                            transparent 24px
                          )`
                        }}
                      />
                      
                      {/* Highlight - stays in same position for consistent sphere shape */}
                      <div 
                        className="absolute top-2 left-2 w-4 h-4 rounded-full"
                        style={{
                          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)'
                        }}
                      />
                      
                      {/* Content container */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Up chevron */}
                        <button 
                          className="absolute top-1 p-1 hover:bg-white/10 rounded transition-colors pointer-events-auto z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Up clicked, current:', realisticSpherePain);
                            setRealisticSpherePain(prev => Math.min(10, prev + 1));
                          }}
                          disabled={realisticSpherePain === 10}
                        >
                          <ChevronUpIcon className={`w-4 h-4 transition-opacity ${
                            realisticSpherePain === 10 
                              ? 'text-slate-500 opacity-30' 
                              : 'text-slate-300 opacity-60 hover:opacity-90'
                          }`} />
                        </button>
                        
                        {/* Number display */}
                        <span className="text-white font-bold text-lg drop-shadow-lg pointer-events-none">
                          {realisticSpherePain}
                        </span>
                        
                        {/* Down chevron */}
                        <button 
                          className="absolute bottom-1 p-1 hover:bg-white/10 rounded transition-colors pointer-events-auto z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Down clicked, current:', realisticSpherePain);
                            setRealisticSpherePain(prev => Math.max(0, prev - 1));
                          }}
                          disabled={realisticSpherePain === 0}
                        >
                          <ChevronDownIcon className={`w-4 h-4 transition-opacity ${
                            realisticSpherePain === 0 
                              ? 'text-slate-500 opacity-30' 
                              : 'text-slate-300 opacity-60 hover:opacity-90'
                          }`} />
                        </button>
                      </div>
                      
                      {/* Subtle rotation indicator - organic flowing pattern */}
                      <div 
                        className="absolute inset-2 rounded-full border border-slate-400/10"
                        style={{
                          transform: `rotate(${realisticSpherePain * 15}deg)`,
                          borderStyle: 'dashed',
                          borderWidth: '1px'
                        }}
                      />
                    </div>
                  </div>
                </div>
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
