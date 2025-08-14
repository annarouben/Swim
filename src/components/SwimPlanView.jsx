import { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import MiniWave from './MiniWave';

function SwimPlanView() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shoulderPain, setShoulderPain] = useState(3); // 0-10 scale
  const [intensity, setIntensity] = useState('Steady'); // Easy, Steady, Push
  const [isUpdatingWorkout, setIsUpdatingWorkout] = useState(false);
  const [animatingCards, setAnimatingCards] = useState(new Set());

  // Get workout routine based on pain level and intensity
  const getWorkoutForPainLevel = (painLevel, intensityLevel = 'Steady') => {
    // Base durations that get modified by intensity
    const getIntensityMultiplier = () => {
      switch(intensityLevel) {
        case 'Easy': return 0.8;
        case 'Push': return 1.3;
        default: return 1.0; // Steady
      }
    };

    const multiplier = getIntensityMultiplier();
    
    if (painLevel >= 7) {
      // High pain: Only gentle movements
      const baseDurations = { gentle: 10, walking: 10 };
      return {
        title: `Gentle Recovery - ${Math.round((baseDurations.gentle + baseDurations.walking) * multiplier)} min`,
        intervals: [
          {
            id: 'gentle-breaststroke',
            name: 'Gentle Breaststroke',
            duration: Math.round(baseDurations.gentle * multiplier),
            icon: 'noun-breaststroke-243000.svg',
            description: intensityLevel === 'Easy' 
              ? 'Very light breaststroke with minimal effort. Focus on gentle floating and breathing.'
              : intensityLevel === 'Push'
              ? 'Gentle breaststroke with slightly longer intervals. Listen to your body and rest as needed.'
              : 'Very gentle breaststroke with minimal arm extension. Focus on leg movement and gentle arm gliding.'
          },
          {
            id: 'water-walking',
            name: 'Water Walking',
            duration: Math.round(baseDurations.walking * multiplier),
            icon: 'noun-wave-5622627.svg',
            description: intensityLevel === 'Easy'
              ? 'Easy water walking and gentle floating exercises.'
              : intensityLevel === 'Push'
              ? 'Water walking with gentle resistance exercises and light stretching.'
              : 'Gentle water walking and floating exercises to promote circulation without strain.'
          }
        ]
      };
    } else if (painLevel >= 4) {
      // Medium pain: Current routine - breaststroke focus with modified freestyle
      const baseDurations = { breast: 12, freestyle: 8, cool: 5 };
      return {
        title: `Modified Workout - ${Math.round((baseDurations.breast + baseDurations.freestyle + baseDurations.cool) * multiplier)} min`,
        intervals: [
          {
            id: 'breaststroke',
            name: 'Breaststroke',
            duration: Math.round(baseDurations.breast * multiplier),
            icon: 'noun-breaststroke-243000.svg',
            description: intensityLevel === 'Easy'
              ? 'Easy-paced breaststroke focusing on form and gentle movement.'
              : intensityLevel === 'Push'
              ? 'Progressive breaststroke building intensity as shoulder tolerates.'
              : 'Start with gentle breaststroke sculling and gradually progress as tolerated.'
          },
          {
            id: 'modified-freestyle',
            name: 'Modified Freestyle',
            duration: Math.round(baseDurations.freestyle * multiplier),
            icon: 'noun-freestyle-243002.svg',
            description: intensityLevel === 'Easy'
              ? 'Very controlled, easy freestyle with extra rest between laps.'
              : intensityLevel === 'Push'
              ? 'Modified freestyle with gradual increase in pace and range of motion.'
              : 'Shortened, controlled freestyle strokes. Avoid excessive arm extension and rotation.'
          },
          {
            id: 'cooldown',
            name: 'Cool Down',
            duration: Math.round(baseDurations.cool * multiplier),
            icon: 'noun-snowflake-7926919.svg',
            description: 'Easy floating and gentle movements to help shoulder muscles relax.'
          }
        ]
      };
    } else {
      // Low pain: Full intensity with all strokes
      const baseDurations = { butterfly: 10, freestyle: 15, backstroke: 7, cool: 3 };
      return {
        title: `Full Intensity - ${Math.round((baseDurations.butterfly + baseDurations.freestyle + baseDurations.backstroke + baseDurations.cool) * multiplier)} min`,
        intervals: [
          {
            id: 'butterfly',
            name: 'Butterfly',
            duration: Math.round(baseDurations.butterfly * multiplier),
            icon: 'noun-butterfly-stroke-242995.svg',
            description: intensityLevel === 'Easy'
              ? 'Easy butterfly focusing on technique and rhythm.'
              : intensityLevel === 'Push'
              ? 'High-intensity butterfly with sprint intervals and minimal rest.'
              : 'Full butterfly strokes to build shoulder strength and endurance.'
          },
          {
            id: 'freestyle',
            name: 'Freestyle',
            duration: Math.round(baseDurations.freestyle * multiplier),
            icon: 'noun-freestyle-243002.svg',
            description: intensityLevel === 'Easy'
              ? 'Comfortable freestyle pace with focus on smooth technique.'
              : intensityLevel === 'Push'
              ? 'High-intensity freestyle with sprint sets and competitive pacing.'
              : 'High-intensity freestyle with full range of motion and bilateral breathing.'
          },
          {
            id: 'backstroke',
            name: 'Backstroke',
            duration: Math.round(baseDurations.backstroke * multiplier),
            icon: 'noun-backstroke-242997.svg',
            description: intensityLevel === 'Easy'
              ? 'Easy backstroke with focus on body position and gentle rotation.'
              : intensityLevel === 'Push'
              ? 'Power backstroke with emphasis on strong catch and fast turnover.'
              : 'Full backstroke to work opposing muscle groups and improve flexibility.'
          },
          {
            id: 'cooldown',
            name: 'Cool Down',
            duration: Math.round(baseDurations.cool * multiplier),
            icon: 'noun-snowflake-7926919.svg',
            description: intensityLevel === 'Easy'
              ? 'Extended cool down with gentle stretching and relaxation.'
              : intensityLevel === 'Push'
              ? 'Brief but thorough cool down with targeted stretches.'
              : 'Brief cool down with easy breaststroke and stretching.'
          }
        ]
      };
    }
  };

  const currentWorkout = getWorkoutForPainLevel(shoulderPain, intensity);

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

  // Handle intensity level changes
  const handleIntensityChange = (newIntensity) => {
    setIntensity(newIntensity);
    
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
          
          {/* Controls Section - Side by Side */}
          <div className="mb-6">
            <div className="flex gap-8 justify-start">
              {/* Pain Level Control */}
              <div className="flex flex-col items-center">
                {/* Title above control */}
                <div className="mb-3 text-center">
                  <h4 className="text-sm font-medium text-slate-200">Shoulder pain level</h4>
                  <div className="text-xs text-slate-200 mt-1">0 - no pain, 10 - worst</div>
                </div>
                
                {/* Up/Down Chevron Control */}
                <div className="flex flex-col items-center">
                  {/* Up Button */}
                  <button
                    onClick={() => handlePainLevelChange(Math.min(10, shoulderPain + 1))}
                    disabled={shoulderPain === 10}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronUpIcon className="w-6 h-6 text-slate-300" />
                  </button>
                  
                  {/* Pain Level Display Circle */}
                  <div 
                    className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors -my-1"
                    onWheel={(e) => {
                      e.preventDefault();
                      const delta = e.deltaY > 0 ? -1 : 1;
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
                        const delta = Math.round(deltaY / 15);
                        const newValue = Math.max(0, Math.min(10, startValue - delta));
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
                        const delta = Math.round(deltaY / 10);
                        const newValue = Math.max(0, Math.min(10, startValue - delta));
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
                    <span className="text-xs font-bold text-white select-none">
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
              </div>

              {/* Intensity Control */}
              <div className="flex flex-col items-center">
                {/* Title above control */}
                <div className="mb-3 text-center">
                  <h4 className="text-sm font-medium text-slate-200">Exercise intensity</h4>
                  <div className="text-xs text-slate-200 mt-1">Choose your preference</div>
                </div>
                
                {/* Up/Down Chevron Control */}
                <div className="flex flex-col items-center">
                  {/* Up Button */}
                  <button
                    onClick={() => handleIntensityChange(intensity === 'Easy' ? 'Steady' : intensity === 'Steady' ? 'Push' : 'Push')}
                    disabled={intensity === 'Push'}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronUpIcon className="w-6 h-6 text-slate-300" />
                  </button>
                  
                  {/* Intensity Level Display Circle */}
                  <div 
                    className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors -my-1"
                    onWheel={(e) => {
                      e.preventDefault();
                      const delta = e.deltaY > 0 ? -1 : 1;
                      const levels = ['Easy', 'Steady', 'Push'];
                      const currentIndex = levels.indexOf(intensity);
                      const newIndex = Math.max(0, Math.min(2, currentIndex + delta));
                      handleIntensityChange(levels[newIndex]);
                    }}
                    style={{ touchAction: 'none' }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const startY = e.touches[0].clientY;
                      const levels = ['Easy', 'Steady', 'Push'];
                      const startIndex = levels.indexOf(intensity);
                      
                      const handleTouchMove = (moveEvent) => {
                        if (moveEvent.touches.length === 0) return;
                        moveEvent.preventDefault();
                        const touch = moveEvent.touches[0];
                        const deltaY = touch.clientY - startY;
                        const delta = Math.round(deltaY / 30);
                        const newIndex = Math.max(0, Math.min(2, startIndex - delta));
                        handleIntensityChange(levels[newIndex]);
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
                      const levels = ['Easy', 'Steady', 'Push'];
                      const startIndex = levels.indexOf(intensity);
                      
                      const handleMouseMove = (moveEvent) => {
                        const deltaY = moveEvent.clientY - startY;
                        const delta = Math.round(deltaY / 20);
                        const newIndex = Math.max(0, Math.min(2, startIndex - delta));
                        handleIntensityChange(levels[newIndex]);
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <span className="text-xs font-bold text-white select-none">{intensity}</span>
                  </div>
                  
                  {/* Down Button */}
                  <button
                    onClick={() => handleIntensityChange(intensity === 'Push' ? 'Steady' : intensity === 'Steady' ? 'Easy' : 'Easy')}
                    disabled={intensity === 'Easy'}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-slate-300" />
                  </button>
                </div>
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
