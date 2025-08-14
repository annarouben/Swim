import { useState, useEffect } from 'react';
import { CalendarDaysIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon as CalendarDaysSolidIcon, ChartBarIcon as ChartBarSolidIcon } from '@heroicons/react/24/solid';

function BottomNavigation({ activeTab, onTabChange }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down (but not on very small scrolls)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Add scroll listener
    window.addEventListener('scroll', controlNavbar);
    
    // Also listen to touch events for better mobile experience
    window.addEventListener('touchmove', controlNavbar);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.removeEventListener('touchmove', controlNavbar);
    };
  }, [lastScrollY]);
  const tabs = [
    {
      id: 'reserve',
      label: 'Reserve',
      type: 'heroicon',
      OutlineIcon: CalendarDaysIcon,
      SolidIcon: CalendarDaysSolidIcon,
      description: 'Book pool time'
    },
    {
      id: 'swim',
      label: 'Swim',
      type: 'svg',
      iconSrc: './images/noun-wave-5622627.svg',
      description: 'Swim workouts'
    },
    {
      id: 'insights',
      label: 'Insights',
      type: 'heroicon',
      OutlineIcon: ChartBarIcon,
      SolidIcon: ChartBarSolidIcon,
      description: 'Progress tracking'
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* Navigation Bar - More subtle styling */}
      <div className="bg-slate-800/40 backdrop-blur-sm border-t border-slate-600/30">
        <div className="flex">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 px-4 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-[#A8F5E0]'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {/* Icon - handle both Heroicons and SVG files */}
                {tab.type === 'heroicon' ? (
                  (() => {
                    const IconComponent = activeTab === tab.id ? tab.SolidIcon : tab.OutlineIcon;
                    return (
                      <IconComponent className={`w-5 h-5 mb-1 transition-all duration-200 ${
                        activeTab === tab.id ? 'scale-105' : ''
                      }`} />
                    );
                  })()
                ) : (
                  <div 
                    className={`w-5 h-5 mb-1 transition-all duration-200 ${
                      activeTab === tab.id ? 'scale-105' : ''
                    }`}
                    style={{
                      WebkitMask: `url(${tab.iconSrc}) no-repeat center / contain`,
                      mask: `url(${tab.iconSrc}) no-repeat center / contain`,
                      backgroundColor: 'currentColor'
                    }}
                  />
                )}
                
                {/* Label - smaller text */}
                <span className={`text-xs ${
                  activeTab === tab.id ? 'font-medium' : 'font-normal'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Safe area padding for mobile devices */}
      <div className="bg-slate-800/40 h-safe-area-inset-bottom"></div>
    </div>
  );
}

export default BottomNavigation;
