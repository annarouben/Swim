import { useState } from 'react';

function AvailableSlots({ slots, onSelectSlot }) {
  const [availableSlots, setAvailableSlots] = useState(slots);
  const [reservingSlots, setReservingSlots] = useState(new Set());
  const [completedSlots, setCompletedSlots] = useState(new Set());
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

  const handleReserve = (slot, index) => {
    // Start reservation animation
    setReservingSlots(prev => new Set(prev).add(index));
    
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

  return (
    <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl w-full max-w-md">
      <h3 className="text-lg font-medium mb-4 text-center text-slate-200">Reserve</h3>
      <div className="space-y-3">
        {availableSlots
          .filter((_, index) => !completedSlots.has(index))
          .map((slot, filteredIndex) => {
            const originalIndex = availableSlots.indexOf(slot);
            const isReserving = reservingSlots.has(originalIndex);
            
            return (
              <button 
                key={slot.id || originalIndex}
                onClick={() => !isReserving && handleReserve(slot, originalIndex)}
                disabled={isReserving}
                className={`w-full bg-slate-800/50 hover:bg-slate-800/70 rounded-xl px-6 py-4 text-left transition-all duration-300 border border-slate-700/50 hover:border-slate-600/70 shadow-md ring-1 ring-white/5 ${
                  isReserving 
                    ? 'cursor-default transform scale-[1.02]' 
                    : 'cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(168,245,224,0.1)]'
                }`}
              >
                <div className="flex justify-between items-center">
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
                      <div>
                        <div className="text-xl font-semibold mb-1">
                          {slot.time}
                        </div>
                        <div className="text-sm text-white/70">{slot.date}</div>
                      </div>
                      <LaneVisual lane={slot.lane} />
                    </>
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  )
}

export default AvailableSlots