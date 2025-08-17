import { ChartBarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

function SwimPerformance() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollRef = useRef(null);

  // Handle scroll to update active dot
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const scrollLeft = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.clientWidth;
      
      // Find which card is most visible in the viewport
      const cards = scrollContainer.children;
      let activeIndex = 0;
      let maxVisibleArea = 0;
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardRect = card.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        // Calculate visible area of this card
        const visibleLeft = Math.max(cardRect.left, containerRect.left);
        const visibleRight = Math.min(cardRect.right, containerRect.right);
        const visibleWidth = Math.max(0, visibleRight - visibleLeft);
        const visibleArea = visibleWidth * cardRect.height;
        
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          activeIndex = i;
        }
      }
      
      setActiveCardIndex(activeIndex);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      // Throttle scroll events for better performance
      let throttleTimer = null;
      const throttledHandleScroll = () => {
        if (throttleTimer) {
          clearTimeout(throttleTimer);
        }
        throttleTimer = setTimeout(() => {
          handleScroll();
        }, 10);
      };

      // Initial call to set correct active state
      handleScroll();
      
      scrollElement.addEventListener('scroll', throttledHandleScroll, { passive: true });
      
      return () => {
        scrollElement.removeEventListener('scroll', throttledHandleScroll);
        if (throttleTimer) {
          clearTimeout(throttleTimer);
        }
      };
    }
  }, []);

  // Mock data - in real app this would come from watch/API
  const performanceData = {
    strokeEfficiency: [
      {
        stroke: 'Freestyle',
        icon: 'noun-freestyle-243002.svg',
        strokesPerLap: 16,
        average: 18,
        distancePerStroke: 2.3,
        rating: 'excellent',
        tip: 'Perfect glide extension - keep it up!'
      },
      {
        stroke: 'Breaststroke', 
        icon: 'noun-breaststroke-243000.svg',
        strokesPerLap: 12,
        average: 14,
        distancePerStroke: 2.8,
        rating: 'great',
        tip: 'Strong pull phase - focus on timing'
      },
      {
        stroke: 'Backstroke',
        icon: 'noun-backstroke-242997.svg', 
        strokesPerLap: 18,
        average: 20,
        distancePerStroke: 2.1,
        rating: 'good',
        tip: 'Work on body rotation for better reach'
      },
      {
        stroke: 'Butterfly',
        icon: 'noun-butterfly-stroke-242995.svg',
        strokesPerLap: 14,
        average: 16,
        distancePerStroke: 2.5,
        rating: 'excellent', 
        tip: 'Powerful undulation - great technique!'
      }
    ],
    speed: {
      current: '13',
      previous: '15',
      improvement: 2
    },
    consistency: {
      steadyLaps: 15,
      rating: 'great'
    }
  };

  return (
    <div className="space-y-4">
      {/* Stroke Efficiency Cards - Horizontally Scrollable */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-200">Stroke Efficiency</h4>
        </div>
        
        {/* Horizontally scrollable stroke cards */}
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide stroke-scroll"
        >
          {performanceData.strokeEfficiency.map((stroke, index) => (
            <div key={stroke.stroke} className="stroke-card flex-shrink-0 w-72 bg-slate-700/30 rounded-lg p-3">
              <div className="flex gap-3">
                {/* Stroke Icon */}
                <div className="flex flex-col items-center justify-start flex-shrink-0">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                      <div 
                        className="w-10 h-10"
                        style={{
                          WebkitMask: `url(./images/${stroke.icon}) no-repeat center / contain`,
                          mask: `url(./images/${stroke.icon}) no-repeat center / contain`,
                          backgroundColor: 'currentColor'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stroke Data */}
                <div className="flex-1">
                  <h5 className="font-medium text-slate-200 mb-1 text-sm text-left">
                    <span className="text-[#A8F5E0] font-bold mr-2">{stroke.strokesPerLap}</span>
                    {stroke.stroke}
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 text-left">
                      Pool avg: {stroke.average} • {stroke.distancePerStroke}m per stroke
                    </p>
                    <p className="text-xs text-slate-300 text-left">
                      {stroke.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Swipe dots indicator */}
        <div className="flex justify-center gap-1 mt-3">
          {performanceData.strokeEfficiency.map((stroke, index) => (
            <div 
              key={`dot-${index}`}
              className={`w-1.5 h-1.5 rounded-full ${
                index === activeCardIndex ? 'bg-[#A8F5E0]' : 'bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Speed Progress Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <div 
                  className="w-10 h-10"
                  style={{
                    WebkitMask: `url(./images/noun-speedometer-1580091.svg) no-repeat center / contain`,
                    mask: `url(./images/noun-speedometer-1580091.svg) no-repeat center / contain`,
                    backgroundColor: 'currentColor'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{performanceData.speed.current}s/lap</span>
              Speed Progress
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Previous: {performanceData.speed.previous}s ({performanceData.speed.improvement}s improvement!)
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                You're getting faster each week
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consistency Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{performanceData.consistency.steadyLaps}</span>
              Technique Consistency
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Your technique stayed steady for 15 laps
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                Great endurance and form control
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwimPerformance;
