import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon as CalendarDaysSolidIcon } from '@heroicons/react/24/solid';

function BottomNavigation({ activeTab, onTabChange }) {
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
      type: 'svg',
      iconSrc: './images/stats.svg',
      description: 'Progress tracking'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Navigation Bar - Darker and always visible */}
      <div className="bg-slate-800/80 backdrop-blur-md border-t border-slate-600/50 shadow-lg">
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
      <div className="bg-slate-800/80 h-safe-area-inset-bottom"></div>
    </div>
  );
}

export default BottomNavigation;
