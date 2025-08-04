import { useState } from 'react';

function CurrentReservation({ reservations = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const nextReservation = () => {
    if (currentIndex < reservations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevReservation = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < reservations.length - 1) {
      nextReservation();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevReservation();
    }
  };

  // Handle empty reservations
  if (!reservations || reservations.length === 0) {
    return (
      <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 mb-8 text-center text-white shadow-2xl w-full max-w-lg">
        <h2 className="text-lg font-medium mb-2 text-slate-200">Your Reservation</h2>
        <div className="text-slate-400">No upcoming reservations</div>
      </div>
    );
  }

  const currentReservation = reservations[currentIndex];

  // Helper function to check if date contains "Today"
  const isToday = (dateString) => {
    return dateString.toLowerCase().includes('today');
  };

  // Helper function to format date with badge
  const formatDateWithBadge = (dateString) => {
    if (isToday(dateString)) {
      return (
        <div className="flex items-center justify-center h-10">
          <span className="bg-[#A8F5E0] text-slate-800 px-4 py-2 rounded-full text-lg font-semibold">
            {dateString}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-10">
        <span className="text-slate-200">{dateString}</span>
      </div>
    );
  };

  return (
    <div 
      className="bg-gradient-to-b from-slate-900/60 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 mb-8 text-center text-white shadow-2xl relative w-full max-w-lg"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Navigation arrows - only show when there's a previous/next reservation */}
      {reservations.length > 1 && (
        <>
          {/* Left arrow - only show if not on first reservation */}
          {currentIndex > 0 && (
            <button
              onClick={prevReservation}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-slate-700/80 text-white hover:bg-slate-600/80 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Right arrow - only show if not on last reservation */}
          {currentIndex < reservations.length - 1 && (
            <button
              onClick={nextReservation}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-slate-700/80 text-white hover:bg-slate-600/80 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Content area with padding to avoid arrow overlap */}
      <div className="px-8">
        <h2 className="text-lg font-medium mb-2 text-slate-200">Your Reservation</h2>
        
        {/* Counter */}
        {reservations.length > 1 && (
          <div className="text-xs text-slate-400 mb-3">
            {currentIndex + 1} of {reservations.length}
          </div>
        )}

        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">{currentReservation.time}</div>
        <div className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">Lane {currentReservation.lane}</div>
        <div className="mb-2">
          {formatDateWithBadge(currentReservation.date)}
        </div>
      </div>
    </div>
  );
}

export default CurrentReservation;