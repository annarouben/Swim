import { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import MiniWave from './MiniWave';

function SwimPlanView() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shoulderPain, setShoulderPain] = useState(3); // 0-10 scale
  const [isUpdatingWorkout, setIsUpdatingWorkout] = useState(false);
  const [animatingCards, setAnimatingCards] = useState(new Set());

  // Get workout routine based on pain level
  const getWorkoutForPainLevel = (painLevel) => {
    if (painLevel >= 7) {
      // High pain: Only gentle movements
      return {
        title: "Gentle Recovery - 20 min",
        intervals: [
          {
            id: 'gentle-breaststroke',
            name: 'Gentle Breaststroke',
            duration: 10,
            icon: 'noun-breaststroke-243000.svg',
            description: 'Very gentle breaststroke with minimal arm extension. Focus on leg movement and gentle arm gliding.'
          },
          {
            id: 'water-walking',
            name: 'Water Walking',
            duration: 10,
            icon: 'noun-wave-5622627.svg',
            description: 'Gentle water walking and floating exercises to promote circulation without strain.'
          }
        ]
      };
    } else if (painLevel >= 4) {
      // Medium pain: Current routine - breaststroke focus with modified freestyle
      return {
        title: "Modified Workout - 25 min",
        intervals: [
          {
            id: 'breaststroke',
            name: 'Breaststroke',
            duration: 12,
            icon: 'noun-breaststroke-243000.svg',
            description: 'Start with gentle breaststroke sculling and gradually progress as tolerated.'
          },
          {
            id: 'modified-freestyle',
            name: 'Modified Freestyle',
            duration: 8,
            icon: 'noun-freestyle-243002.svg',
            description: 'Shortened, controlled freestyle strokes. Avoid excessive arm extension and rotation.'
          },
          {
            id: 'cooldown',
            name: 'Cool Down',
            duration: 5,
            icon: 'noun-snowflake-7926919.svg',
            description: 'Easy floating and gentle movements to help shoulder muscles relax.'
          }
        ]
      };
    } else {
      // Low pain: Full intensity with all strokes
      return {
        title: "Full Intensity - 35 min",
        intervals: [
          {
            id: 'butterfly',
            name: 'Butterfly',
            duration: 10,
            icon: 'noun-butterfly-stroke-242995.svg',
            description: 'Full butterfly strokes to build shoulder strength and endurance.'
          },
          {
            id: 'freestyle',
            name: 'Freestyle',
            duration: 15,
            icon: 'noun-freestyle-243002.svg',
            description: 'High-intensity freestyle with full range of motion and bilateral breathing.'
          },
          {
            id: 'backstroke',
            name: 'Backstroke',
            duration: 7,
            icon: 'noun-backstroke-242997.svg',
            description: 'Full backstroke to work opposing muscle groups and improve flexibility.'
          },
          {
            id: 'cooldown',
            name: 'Cool Down',
            duration: 3,
            icon: 'noun-snowflake-7926919.svg',
            description: 'Brief cool down with easy breaststroke and stretching.'
          }
        ]
      };
    }
  };

  const currentWorkout = getWorkoutForPainLevel(shoulderPain);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const timer = setTimeout(() => {
        video.pause();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle workout update animation when pain level changes
  const handlePainLevelChange = (newPainLevel) => {
    setShoulderPain(newPainLevel);
    
    // Debounce the animation trigger
    clearTimeout(window.workoutUpdateTimeout);
    window.workoutUpdateTimeout = setTimeout(() => {
      triggerWorkoutUpdateAnimation();
    }, 500); // Wait 500ms after user stops adjusting
  };

  const triggerWorkoutUpdateAnimation = () => {
    setIsUpdatingWorkout(true);
    
    // Get current workout intervals for dynamic animation
    const intervals = currentWorkout.intervals;
    
    intervals.forEach((interval, index) => {
      setTimeout(() => {
        setAnimatingCards(prev => new Set([...prev, interval.id]));
        
        // Remove animation after it completes
        setTimeout(() => {
          setAnimatingCards(prev => {
            const newSet = new Set(prev);
            newSet.delete(interval.id);
            return newSet;
          });
        }, 400); // Animation duration
      }, index * 200); // Stagger by 200ms
    });
    
    // Complete the update process
    setTimeout(() => {
      setIsUpdatingWorkout(false);
    }, intervals.length * 200 + 400); // Total duration
  };

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
                  onClick={() => handlePainLevelChange(Math.min(10, shoulderPain + 1))}
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
                    handlePainLevelChange(Math.max(0, Math.min(10, shoulderPain + delta)));
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
                      handlePainLevelChange(newValue);
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
                      handlePainLevelChange(newValue);
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
                  onClick={() => handlePainLevelChange(Math.max(0, shoulderPain - 1))}
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
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-slate-200">{currentWorkout.title}</h4>
              {/* Mini wave animation during workout update */}
              {isUpdatingWorkout && <MiniWave />}
            </div>
            
            {/* Dynamic Workout Intervals */}
            {currentWorkout.intervals.map((interval, index) => (
              <div key={interval.id} className={`bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 transition-all duration-400 ${
                animatingCards.has(interval.id) 
                  ? 'scale-105 bg-slate-700/60 shadow-lg shadow-[#A8F5E0]/10' 
                  : 'scale-100'
              }`}>
                <div className="flex gap-4">
                  {/* Left Column - Icon */}
                  <div className="flex flex-col items-center justify-start flex-shrink-0">
                    {/* Icon with subtle background circle */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                        <div 
                          className="w-10 h-10"
                          style={{
                            WebkitMask: `url(./images/${interval.icon}) no-repeat center / contain`,
                            mask: `url(./images/${interval.icon}) no-repeat center / contain`,
                            backgroundColor: 'currentColor'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Time + Title + Description */}
                  <div className="flex-1 pt-1">
                    <h5 className="font-medium text-slate-200 mb-2 text-left">
                      <span className="text-[#A8F5E0] font-bold text-base mr-2">{interval.duration} min</span>
                      {interval.name}
                    </h5>
                    <p className="text-sm text-slate-300 leading-normal text-left">
                      {interval.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SwimPlanView;
