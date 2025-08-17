import { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import MiniWave from './MiniWave';

function SwimPlanView() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shoulderPain, setShoulderPain] = useState(3); // 0-10 scale
  const [intensity, setIntensity] = useState('Moderate'); // Light, Moderate, Intense
  const [isUpdatingWorkout, setIsUpdatingWorkout] = useState(false);
  const [animatingCards, setAnimatingCards] = useState(new Set());
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  // Get workout routine based on pain level and intensity
  const getWorkoutForPainLevel = (painLevel, intensityLevel = 'Moderate') => {
    // Base durations that get modified by intensity
    const getIntensityMultiplier = () => {
      switch(intensityLevel) {
        case 'Light': return 0.8;
        case 'Intense': return 1.3;
        default: return 1.0; // Moderate
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
            description: intensityLevel === 'Light' 
              ? 'Very light breaststroke with minimal effort. Focus on gentle floating and breathing.'
              : intensityLevel === 'Intense'
              ? 'Gentle breaststroke with slightly longer intervals. Listen to your body and rest as needed.'
              : 'Very gentle breaststroke with minimal arm extension. Focus on leg movement and gentle arm gliding.'
          },
          {
            id: 'water-walking',
            name: 'Water Walking',
            duration: Math.round(baseDurations.walking * multiplier),
            icon: 'noun-bipedal-walking-5312620.svg',
            description: intensityLevel === 'Light'
              ? 'Easy water walking and gentle floating exercises.'
              : intensityLevel === 'Intense'
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
            description: intensityLevel === 'Light'
              ? 'Easy-paced breaststroke focusing on form and gentle movement.'
              : intensityLevel === 'Intense'
              ? 'Progressive breaststroke building intensity as shoulder tolerates.'
              : 'Start with gentle breaststroke sculling and gradually progress as tolerated.'
          },
          {
            id: 'modified-freestyle',
            name: 'Modified Freestyle',
            duration: Math.round(baseDurations.freestyle * multiplier),
            icon: 'noun-freestyle-243002.svg',
            description: intensityLevel === 'Light'
              ? 'Very controlled, easy freestyle with extra rest between laps.'
              : intensityLevel === 'Intense'
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
            description: intensityLevel === 'Light'
              ? 'Easy butterfly focusing on technique and rhythm.'
              : intensityLevel === 'Intense'
              ? 'High-intensity butterfly with sprint intervals and minimal rest.'
              : 'Full butterfly strokes to build shoulder strength and endurance.'
          },
          {
            id: 'freestyle',
            name: 'Freestyle',
            duration: Math.round(baseDurations.freestyle * multiplier),
            icon: 'noun-freestyle-243002.svg',
            description: intensityLevel === 'Light'
              ? 'Comfortable freestyle pace with focus on smooth technique.'
              : intensityLevel === 'Intense'
              ? 'High-intensity freestyle with sprint sets and competitive pacing.'
              : 'High-intensity freestyle with full range of motion and bilateral breathing.'
          },
          {
            id: 'backstroke',
            name: 'Backstroke',
            duration: Math.round(baseDurations.backstroke * multiplier),
            icon: 'noun-backstroke-242997.svg',
            description: intensityLevel === 'Light'
              ? 'Easy backstroke with focus on body position and gentle rotation.'
              : intensityLevel === 'Intense'
              ? 'Power backstroke with emphasis on strong catch and fast turnover.'
              : 'Full backstroke to work opposing muscle groups and improve flexibility.'
          },
          {
            id: 'cooldown',
            name: 'Cool Down',
            duration: Math.round(baseDurations.cool * multiplier),
            icon: 'noun-snowflake-7926919.svg',
            description: intensityLevel === 'Light'
              ? 'Extended cool down with gentle stretching and relaxation.'
              : intensityLevel === 'Intense'
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
          
          {/* Health Profile Section */}
          <div className="mb-6">
            {/* Profile Header - Clickable to expand/collapse */}
            <button 
              onClick={() => setIsProfileExpanded(!isProfileExpanded)}
              className="w-full flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/40 transition-all duration-200 mb-4"
            >
              <div className="flex items-center gap-3">
                {/* Profile Picture */}
                <div className="w-14 h-14 rounded-full bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                  <div 
                    className="w-10 h-10 text-slate-200"
                    style={{
                      WebkitMask: 'url(./images/noun-woman-face-1434620.svg) no-repeat center / contain',
                      mask: 'url(./images/noun-woman-face-1434620.svg) no-repeat center / contain',
                      backgroundColor: 'currentColor'
                    }}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <h4 className="font-medium text-slate-200">Health Profile</h4>
                  <span className="text-xs text-slate-300">
                    Pain: {shoulderPain} • Intensity: {intensity}
                  </span>
                </div>
              </div>
              <ChevronDownIcon 
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                  isProfileExpanded ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Expandable Controls - Stacked Vertically */}
            {isProfileExpanded && (
              <div className="space-y-6 animate-fadeIn">
                {/* Pain Level Control */}
                <div className="flex flex-col items-center">
                  {/* Title above control - left aligned */}
                  <div className="mb-3 w-full">
                    <h4 className="text-sm font-medium text-slate-200 text-left">Shoulder pain level <span className="text-xs text-slate-200 font-normal">• 0 - no pain, 10 - worst</span></h4>
                  </div>
                  
                  {/* Segmented Control for Pain Level */}
                  <div className="bg-slate-800/50 rounded-full p-1 flex w-full gap-1 justify-between">
                    {/* Individual circle buttons for 0-10 */}
                    {Array.from({ length: 11 }, (_, i) => i).map((level) => (
                      <button
                        key={level}
                        onClick={() => handlePainLevelChange(level)}
                        className={`py-2 px-1 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 flex-1 ${
                          shoulderPain === level
                            ? 'bg-[#A8F5E0] text-slate-900'
                            : 'bg-transparent text-slate-300 hover:bg-slate-700/30'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Control */}
                <div className="flex flex-col items-center">
                  {/* Title above control - left aligned */}
                  <div className="mb-3 w-full">
                    <h4 className="text-sm font-medium text-slate-200 text-left">Exercise intensity <span className="text-xs text-slate-200 font-normal">• Choose your preference</span></h4>
                  </div>
                  
                  {/* Segmented Control */}
                  <div className="bg-slate-800/50 rounded-full p-1 flex relative w-full">
                    {/* Background slider that moves */}
                    <div 
                      className={`absolute top-1 bottom-1 bg-[#A8F5E0] rounded-full transition-all duration-300 ease-in-out ${
                        intensity === 'Light' ? 'left-1 w-1/3' :
                        intensity === 'Moderate' ? 'left-1/2 transform -translate-x-1/2 w-1/3' :
                        'right-1 w-1/3'
                      }`}
                    />
                    
                    {/* Toggle buttons */}
                    {['Light', 'Moderate', 'Intense'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleIntensityChange(level)}
                        className={`relative z-10 px-3 py-2 text-sm font-medium transition-all duration-200 flex-1 ${
                          intensity === level
                            ? 'text-slate-900'
                            : 'text-slate-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                          className={interval.icon === 'noun-bipedal-walking-5312620.svg' ? "w-16 h-16" : "w-10 h-10"}
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
