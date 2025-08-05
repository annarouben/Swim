import { useState, useEffect, useRef } from 'react';

function CalendarAvailableSpots({ slots, onSelectSlot, onBackToList }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const slotsContainerRef = useRef(null);
  const dateSlotRefs = useRef({});
  const [availableSlots, setAvailableSlots] = useState(slots);
  const [reservingSlots, setReservingSlots] = useState(new Set());
  const [completedSlots, setCompletedSlots] = useState(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const [manualDateSelection, setManualDateSelection] = useState(false);

  // Helper function to check if lane is shared
  const isSharedLane = (lane) => lane === 1 || lane === 4;

  // Helper function to generate next available time
  const generateNextSlot = () => {
    const lastSlot = availableSlots[availableSlots.length - 1];
    const lastTime = new Date(`${lastSlot.date} ${lastSlot.time}`);
    
    // Add 1 hour to the last slot
    const nextTime = new Date(lastTime.getTime() + 60 * 60 * 1000);
    
    // If it's past 9 PM, move to next day at 6 AM
    if (nextTime.getHours() >= 21) {
      nextTime.setDate(nextTime.getDate() + 1);
      nextTime.setHours(6, 0, 0, 0);
    }
    
    // Random lane selection
    const lanes = [1, 2, 3, 4];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    
    return {
      time: nextTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      date: nextTime.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      lane: randomLane,
      id: Date.now() + Math.random() // Unique ID
    };
  };

  // Handle reservation
  const handleReserve = (slot, slotKey) => {
    // Start reservation animation
    setReservingSlots(prev => new Set(prev).add(slotKey));
    
    // After 1.5s, mark as completed and remove
    setTimeout(() => {
      setReservingSlots(prev => {
        const newSet = new Set(prev);
        newSet.delete(slotKey);
        return newSet;
      });
      setCompletedSlots(prev => new Set(prev).add(slotKey));
      
      // Generate and add new slot to the bottom
      const newSlot = generateNextSlot();
      setAvailableSlots(prev => [...prev, newSlot]);
      
      // Call parent callback
      onSelectSlot?.(slot);
    }, 1500);
  };

  // Group slots by date for scrolling functionality
  const groupSlotsByDate = () => {
    const grouped = {};
    availableSlots
      .filter((_, index) => !completedSlots.has(`slot-${index}`))
      .forEach(slot => {
        const dateKey = slot.date;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(slot);
      });
    return grouped;
  };

  // Get date object from slot date string
  const getDateFromSlotString = (dateString) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateString.includes('Today')) {
      return today;
    } else if (dateString.includes('Tomorrow')) {
      return tomorrow;
    } else {
      // Try to parse other date formats
      try {
        // Handle formats like "Wed, Dec 18" or "Wednesday, Dec 18"
        const cleanDateString = dateString.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/, '');
        const currentYear = today.getFullYear();
        const parsedDate = new Date(`${cleanDateString}, ${currentYear}`);
        
        // If the parsed date is valid and not in the past (accounting for year boundary)
        if (!isNaN(parsedDate.getTime())) {
          // If the date would be in the past, assume it's next year
          if (parsedDate < today) {
            parsedDate.setFullYear(currentYear + 1);
          }
          return parsedDate;
        }
      } catch (e) {
        console.warn('Could not parse date:', dateString);
      }
    }
    return null;
  };

  // Handle scroll to update selected date
  useEffect(() => {
    const container = slotsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Don't update selected date if we're programmatically scrolling or manually selecting
      if (isScrolling || manualDateSelection) return;
      
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const centerPoint = containerTop + containerHeight / 2;

      // Find which date section is currently in view
      let closestDate = null;
      let closestDistance = Infinity;

      Object.keys(dateSlotRefs.current).forEach(dateKey => {
        const element = dateSlotRefs.current[dateKey];
        if (element) {
          // Use getBoundingClientRect for accurate positioning relative to viewport
          const elementRect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Calculate element's position relative to container's scroll position
          const elementTop = element.offsetTop;
          const elementCenter = elementTop + element.offsetHeight / 2;
          const distance = Math.abs(elementCenter - centerPoint);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestDate = dateKey;
          }
        }
      });

      if (closestDate) {
        const newDate = getDateFromSlotString(closestDate);
        if (newDate && newDate.toDateString() !== selectedDate.toDateString()) {
          setSelectedDate(newDate);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedDate, isScrolling, manualDateSelection]);

  const groupedSlots = groupSlotsByDate();
  
  // Helper function to check if time is in the evening
  const isEvening = (timeString) => {
    const time = timeString.toLowerCase();
    if (time.includes('pm')) {
      const hour = parseInt(time.split(':')[0]);
      return hour >= 5 || hour === 12;
    }
    return false;
  };

  // Helper function to format time with moon icon
  const formatTimeWithIcon = (timeString) => {
    return (
      <div className="flex items-center space-x-1">
        <span>{timeString}</span>
        {isEvening(timeString) && (
          <img 
            src="./images/moon.svg"
            alt="Evening"
            className="w-4 h-4 text-slate-300"
            style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(6%) saturate(459%) hue-rotate(167deg) brightness(91%) contrast(89%)' }}
          />
        )}
      </div>
    );
  };

  // Get current week data
  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    
    return week;
  };

  // Get slots for a specific date
  const getSlotsForDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return availableSlots
        .filter((_, index) => !completedSlots.has(`slot-${index}`))
        .filter(slot => 
          slot.date.includes('Today') || 
          slot.date === date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        );
    }
    
    // Check if the date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return availableSlots
        .filter((_, index) => !completedSlots.has(`slot-${index}`))
        .filter(slot => 
          slot.date.includes('Tomorrow') ||
          slot.date === date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        );
    }
    
    // For other dates, try multiple format matches
    const dateFormats = [
      date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      `${date.toLocaleDateString('en-US', { weekday: 'short' })}, ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
    ];
    
    return availableSlots
      .filter((_, index) => !completedSlots.has(`slot-${index}`))
      .filter(slot => 
        dateFormats.some(format => slot.date === format) ||
        slot.date.includes(date.getDate().toString())
      );
  };

  // Function to scroll to a specific date section
  const scrollToDate = (targetDate) => {
    const container = slotsContainerRef.current;
    if (!container) return;

    // Set scrolling flag to prevent scroll listener from interfering
    setIsScrolling(true);

    // Find the date key that matches the target date
    const targetDateString = targetDate.toDateString();
    let targetDateKey = null;

    // Check for Today/Tomorrow first
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (targetDateString === today.toDateString()) {
      // Find a slot with "Today" in the date
      const todaySlot = availableSlots.find(slot => slot.date.includes('Today'));
      if (todaySlot) {
        targetDateKey = todaySlot.date;
      }
    } else if (targetDateString === tomorrow.toDateString()) {
      // Find a slot with "Tomorrow" in the date
      const tomorrowSlot = availableSlots.find(slot => slot.date.includes('Tomorrow'));
      if (tomorrowSlot) {
        targetDateKey = tomorrowSlot.date;
      }
    } else {
      // For other dates, try to match by formatted date
      const dateFormats = [
        targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        `${targetDate.toLocaleDateString('en-US', { weekday: 'short' })}, ${targetDate.toLocaleDateString('en-US', { month: 'short' })} ${targetDate.getDate()}`
      ];

      // Find a slot that matches any of these formats
      const matchingSlot = availableSlots.find(slot => 
        dateFormats.some(format => slot.date === format) ||
        slot.date.includes(targetDate.getDate().toString())
      );
      
      if (matchingSlot) {
        targetDateKey = matchingSlot.date;
      }
    }

    // If we found a matching date key, scroll to it
    if (targetDateKey && dateSlotRefs.current[targetDateKey]) {
      const targetElement = dateSlotRefs.current[targetDateKey];
      const containerTop = container.offsetTop;
      const elementTop = targetElement.offsetTop - containerTop;
      
      container.scrollTo({
        top: elementTop - 20, // Add small offset for better visibility
        behavior: 'smooth'
      });

      // Reset scrolling flag after scroll animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 500); // Smooth scroll typically takes ~300-500ms
    } else {
      // Reset flag immediately if no scroll happened
      setIsScrolling(false);
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentWeek = getCurrentWeek();
  const today = new Date();
  const selectedSlots = getSlotsForDate(selectedDate);

  return (
    <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl w-full max-w-md relative">
      {/* Back Button - Top Left Corner */}
      <button
        onClick={onBackToList}
        className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-600/40 transition-all duration-200 hover:scale-110"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h3 className="text-lg font-medium mb-2 text-center text-slate-200">Reserve</h3>
      
      {/* Current Month Display */}
      <div className="text-center mb-4">
        <div className="text-sm text-slate-300 font-medium">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {currentWeek.map((date, index) => {
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isPastDate = date < today && !isToday;
          const twoWeeksFromToday = new Date(today);
          twoWeeksFromToday.setDate(today.getDate() + 14);
          const isBeyondTwoWeeks = date > twoWeeksFromToday;
          const isDisabled = isPastDate || isBeyondTwoWeeks;
          const daySlots = getSlotsForDate(date);
          const hasSlots = daySlots.length > 0;
          
          return (
            <button
              key={index}
              onClick={() => {
                if (!isDisabled) {
                  setManualDateSelection(true);
                  setSelectedDate(date);
                  scrollToDate(date);
                  // Clear the manual selection flag after a delay to allow scroll to complete
                  setTimeout(() => setManualDateSelection(false), 1000);
                }
              }}
              className={`
                p-2 rounded-lg transition-all duration-200 text-center
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-700/40'}
                ${isSelected ? 'bg-[#A8F5E0]/20 ring-1 ring-[#A8F5E0]' : ''}
              `}
              disabled={isDisabled}
            >
              {/* Day name */}
              <div className={`text-xs font-medium mb-1 ${
                isDisabled ? 'text-slate-200/40' : 'text-slate-200'
              }`}>
                {dayNames[date.getDay()]}
              </div>
              
              {/* Date number - fixed height container */}
              <div className="h-6 flex items-center justify-center">
                {isToday ? (
                  <div className="w-6 h-6 bg-[#A8F5E0] rounded-full flex items-center justify-center text-slate-800 font-semibold text-sm">
                    {date.getDate()}
                  </div>
                ) : (
                  <div className={`text-sm font-medium ${
                    isDisabled ? 'text-slate-200/40' : 'text-slate-200'
                  }`}>
                    {date.getDate()}
                  </div>
                )}
              </div>
              
              {/* Slot indicator - fixed height to prevent layout shift */}
              <div className="h-2 flex items-center justify-center mt-1">
                {hasSlots && !isDisabled && (
                  <div className="w-1 h-1 bg-[#A8F5E0] rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* All Slots by Date */}
      <div 
        ref={slotsContainerRef}
        className="space-y-3 max-h-80 overflow-y-auto"
      >
        {Object.keys(groupedSlots).map((dateKey, dateIndex) => {
          const slotsForDate = groupedSlots[dateKey];
          const dateObj = getDateFromSlotString(dateKey);
          const isSelectedDate = dateObj && dateObj.toDateString() === selectedDate.toDateString();
          
          return (
            <div key={dateKey} ref={el => dateSlotRefs.current[dateKey] = el}>
              {/* Date separator - same as Reserve card */}
              {dateIndex > 0 && (
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-slate-600/40"></div>
                  <div className="px-3 text-xs text-slate-200 font-medium">
                    {dateKey}
                  </div>
                  <div className="flex-1 h-px bg-slate-600/40"></div>
                </div>
              )}
              
              {/* First date section without separator */}
              {dateIndex === 0 && (
                <div className="flex items-center justify-center mb-4">
                  <div className="px-3 text-xs text-slate-200 font-medium">
                    {dateKey}
                  </div>
                </div>
              )}
               {/* Slots for this date - same styling as Reserve card */}
              <div>
                {slotsForDate.map((slot, index) => {
                  const originalIndex = availableSlots.indexOf(slot);
                  const slotKey = `slot-${originalIndex}`;
                  const isReserving = reservingSlots.has(slotKey);
                  
                  return (
                    <button
                      key={`${dateKey}-${index}`}
                      onClick={() => !isReserving && handleReserve(slot, slotKey)}
                      disabled={isReserving}
                      className={`w-full bg-slate-800/50 hover:bg-slate-800/70 rounded-xl px-6 py-4 text-left transition-all duration-300 border border-slate-700/50 hover:border-slate-600/70 shadow-md ring-1 ring-white/5 ${
                        isReserving 
                          ? 'cursor-default transform scale-[1.02]' 
                          : 'cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(168,245,224,0.1)]'
                      } ${isSelectedDate ? 'ring-1 ring-[#A8F5E0]/50' : ''} ${index < slotsForDate.length - 1 ? 'mb-3' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        {isReserving ? (
                          <div className="flex items-center justify-center w-full space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                              <svg 
                                className="w-5 h-5 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={3} 
                                  d="M5 13l4 4L19 7" 
                                />
                              </svg>
                            </div>
                            <div className="text-lg font-semibold text-white">
                              Reserved
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Mobile: Stacked layout */}
                            <div className="w-full sm:hidden">
                              <div className="flex items-baseline space-x-2 mb-2">
                                <div className="text-xl font-semibold whitespace-nowrap">
                                  {formatTimeWithIcon(slot.time)}
                                </div>
                                <div className="text-xs text-white/70 whitespace-nowrap">
                                  {slot.date}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-xs text-white/90 font-medium whitespace-nowrap">
                                  Lane {slot.lane} • {isSharedLane(slot.lane) ? 'Shared' : 'Single'}
                                </span>
                                <div className="flex items-center space-x-1 w-6">
                                  <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
                                  {isSharedLane(slot.lane) ? (
                                    <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
                                  ) : (
                                    <div className="w-3"></div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4].map((laneNum) => (
                                    <div
                                      key={laneNum}
                                      className={`w-1 h-6 rounded-full ${
                                        laneNum === slot.lane 
                                          ? 'bg-[#A8F5E0]' 
                                          : 'bg-white/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Desktop: Keep current layout */}
                            <div className="hidden sm:block">
                              <div className="text-xl font-semibold mb-1">
                                {formatTimeWithIcon(slot.time)}
                              </div>
                              <div className="text-sm text-white/70">{slot.date}</div>
                            </div>
                            <div className="hidden sm:block">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 min-w-[80px]">
                                  <span className="text-xs text-white/90 font-medium">
                                    Lane {slot.lane} • {isSharedLane(slot.lane) ? 'Shared' : 'Single'}
                                  </span>
                                  <div className="flex items-center space-x-1 w-6">
                                    <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
                                    {isSharedLane(slot.lane) ? (
                                      <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
                                    ) : (
                                      <div className="w-3"></div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4].map((laneNum) => (
                                    <div
                                      key={laneNum}
                                      className={`w-1 h-6 rounded-full ${
                                        laneNum === slot.lane 
                                          ? 'bg-[#A8F5E0]' 
                                          : 'bg-white/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarAvailableSpots;