import { useState } from 'react';
import { createPortal } from 'react-dom';
import CalendarAvailableSpots from './CalendarAvailableSpots';

function AvailableSlots({ slots, onSelectSlot, reservationsRef }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(slots);
  const [reservingSlots, setReservingSlots] = useState(new Set());
  const [completedSlots, setCompletedSlots] = useState(new Set());
  const [activeBubbles, setActiveBubbles] = useState([]);
  const isSharedLane = (lane) => lane === 1 || lane === 4;

  // Helper function to check if time is in the evening
  const isEvening = (timeString) => {
    const time = timeString.toLowerCase();
    // Check for PM times that are typically evening (5 PM onwards)
    if (time.includes('pm')) {
      const hour = parseInt(time.split(':')[0]);
      return hour >= 5 || hour === 12; // 5 PM onwards, plus 12 PM (noon could be considered evening meal time)
    }
    return false;
  };

  // Helper function to format time with moon icon
  const formatTimeWithIcon = (timeString) => {
    return (
      <div className="flex items-center space-x-2">
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

  // Helper function to extract date from slot
  const getDateFromSlot = (slot) => {
    return slot.date;
  };

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

  const handleReserve = (slot, index, event) => {
    // Start reservation animation
    setReservingSlots(prev => new Set(prev).add(index));
    
    // Get the position of the clicked slot button
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const startY = buttonRect.top + buttonRect.height / 2; // Middle of the button
    
    // Calculate target position based on reservations area
    let targetY = startY - 300; // Default fallback
    if (reservationsRef?.current) {
      const reservationsRect = reservationsRef.current.getBoundingClientRect();
      targetY = reservationsRect.top + reservationsRect.height / 2; // Middle of reservations area
    }
    
    // Create bubble animation
    const bubbleId = Date.now() + Math.random();
    const newBubble = {
      id: bubbleId,
      time: slot.time,
      lane: slot.lane,
      slotIndex: index,
      startY: startY, // Store the starting Y position
      targetY: targetY, // Store the target Y position
    };
    
    setActiveBubbles(prev => [...prev, newBubble]);
    
    // Remove bubble after animation completes
    setTimeout(() => {
      setActiveBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    }, 3000);
    
    // After 1.5s, mark as completed and remove
    setTimeout(() => {
      setReservingSlots(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      setCompletedSlots(prev => new Set(prev).add(index));
      
      // Generate and add new slot to the bottom
      const newSlot = generateNextSlot();
      setAvailableSlots(prev => [...prev, newSlot]);
      
      // Call parent callback
      onSelectSlot?.(slot);
    }, 1500);
  };

  const LaneVisual = ({ lane }) => {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 min-w-[80px]">
          <span className="text-xs text-white/90 font-medium">
            Lane {lane} • {isSharedLane(lane) ? 'Shared' : 'Single'}
          </span>
          <div className="flex items-center space-x-1 w-6">
            <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
            {isSharedLane(lane) ? (
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
                laneNum === lane 
                  ? 'bg-[#A8F5E0]' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Handle calendar toggle
  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  const handleBackToList = () => {
    setShowCalendar(false);
  };

  // If calendar view is active, show calendar component
  if (showCalendar) {
    return (
      <CalendarAvailableSpots 
        slots={slots} 
        onSelectSlot={onSelectSlot}
        onBackToList={handleBackToList}
        reservationsRef={reservationsRef}
      />
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-white shadow-2xl w-full max-w-none sm:max-w-md relative mx-1 sm:mx-0 flex flex-col h-full">
      {/* Floating Bubbles - Using Portal */}
      {activeBubbles.length > 0 && createPortal(
        <div>
          {activeBubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="fixed inset-0 pointer-events-none"
              style={{
                zIndex: 9999,
              }}
            >
              <div 
                className="absolute animate-bubble-float-to-target"
                style={{
                  left: '50%',
                  top: `${bubble.startY}px`, // Start from the clicked slot position
                  transform: 'translateX(-50%)',
                  '--start-y': `${bubble.startY}px`,
                  '--target-y': `${bubble.targetY}px`,
                }}
              >
                <div className="bg-gradient-to-br from-[#A8F5E0]/90 to-[#95E6D3]/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/30">
                  <div className="text-xs font-medium text-slate-800 whitespace-nowrap flex items-center space-x-2">
                    <span>🫧</span>
                    <span>{bubble.time}</span>
                    <span className="text-slate-600">•</span>
                    <span>Lane {bubble.lane}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* View Toggle - Top Left Corner */}
      <div className="absolute top-4 left-4 flex bg-slate-700/50 rounded-lg p-1">
        <button
          className="flex items-center justify-center w-10 h-8 rounded-md transition-all duration-200 text-[#A8F5E0]"
          disabled
        >
          <img 
            src="./images/list.svg"
            alt="List View"
            className="w-4 h-4"
            style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(89%) saturate(1180%) hue-rotate(104deg) brightness(106%) contrast(89%)' }}
          />
        </button>
        <button
          onClick={handleCalendarClick}
          className="flex items-center justify-center w-10 h-8 rounded-md transition-all duration-200 bg-slate-600/80 text-slate-200"
        >
          <img 
            src="./images/calendar.svg"
            alt="Calendar View"
            className="w-4 h-4"
            style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(6%) saturate(459%) hue-rotate(167deg) brightness(91%) contrast(89%)' }}
          />
        </button>
      </div>

      <h3 className="text-lg font-medium mb-6 text-center text-slate-200">Reserve</h3>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {availableSlots
          .filter((_, index) => !completedSlots.has(index))
          .map((slot, filteredIndex) => {
            const originalIndex = availableSlots.indexOf(slot);
            const isReserving = reservingSlots.has(originalIndex);
            
            // Check if we need a date separator
            const prevSlot = filteredIndex > 0 ? 
              availableSlots.filter((_, index) => !completedSlots.has(index))[filteredIndex - 1] : 
              null;
            const needsDateSeparator = prevSlot && getDateFromSlot(prevSlot) !== getDateFromSlot(slot);
            
            return (
              <div key={slot.id || originalIndex}>
                {/* Date separator */}
                {needsDateSeparator && (
                  <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-slate-600/40"></div>
                    <div className="px-3 text-xs text-slate-200 font-medium">
                      {slot.date}
                    </div>
                    <div className="flex-1 h-px bg-slate-600/40"></div>
                  </div>
                )}
                
                <button 
                  onClick={(event) => !isReserving && handleReserve(slot, originalIndex, event)}
                  disabled={isReserving}
                  className={`w-full bg-slate-800/50 hover:bg-slate-800/70 rounded-xl px-6 py-4 text-left transition-all duration-300 border border-slate-700/50 hover:border-slate-600/70 shadow-md ring-1 ring-white/5 ${
                    isReserving 
                      ? 'cursor-default transform scale-[1.02]' 
                      : 'cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(168,245,224,0.1)]'
                  }`}
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
                        Added to your reservations
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
                        <LaneVisual lane={slot.lane} />
                      </div>
                    </>
                  )}
                </div>
              </button>
              </div>
            );
          })}
      </div>
    </div>
  )
}

export default AvailableSlots