import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function CurrentReservation({ reservations = [], onCancelReservation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

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

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showCancelDialog) {
        setShowCancelDialog(false);
      }
    };

    if (showCancelDialog) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showCancelDialog]);

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
        <h2 className="text-lg font-medium mb-2 text-slate-200">Your Reservations</h2>
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
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white whitespace-nowrap">
          {timeString}
        </span>
        {isEvening(timeString) && (
          <img 
            src="./images/moon.svg"
            alt="Evening"
            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-slate-300"
            style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(6%) saturate(459%) hue-rotate(167deg) brightness(91%) contrast(89%)' }}
          />
        )}
      </div>
    );
  };

  // Handle cancel reservation click
  const handleCancelClick = () => {
    setReservationToCancel(currentReservation);
    setShowCancelDialog(true);
  };

  // Handle cancel confirmation dialog
  const handleCancelDialog = () => {
    setShowCancelDialog(false);
  };

  // Handle backdrop click to close dialog
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowCancelDialog(false);
    }
  };

  const handleConfirmCancel = () => {
    // Call the parent's cancel function with the reservation and current index
    if (onCancelReservation && reservationToCancel) {
      onCancelReservation(reservationToCancel, currentIndex);
    }
    setShowCancelDialog(false);
    
    // If we cancelled the last reservation and there are still reservations left,
    // adjust the current index to stay within bounds
    if (currentIndex >= reservations.length - 1 && reservations.length > 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  return (
    <div 
      className="bg-gradient-to-b from-slate-900/60 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 mb-8 text-center text-white shadow-2xl relative w-full max-w-lg"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Cancel Button - Top Right Corner */}
      <button
        onClick={handleCancelClick}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-600/40 transition-all duration-200 hover:scale-110"
      >
        <img 
          src="./images/trashcan.svg"
          alt="Cancel"
          className="w-4 h-4"
          style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(6%) saturate(459%) hue-rotate(167deg) brightness(91%) contrast(89%)' }}
        />
      </button>

      {/* Navigation arrows - only show when there's a previous/next reservation */}
      {reservations.length > 1 && (
        <>
          {/* Left arrow - only show if not on first reservation */}
          {currentIndex > 0 && (
            <button
              onClick={prevReservation}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all text-white hover:bg-slate-600/40 hover:scale-110"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all text-white hover:bg-slate-600/40 hover:scale-110"
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
        <h2 className="text-lg font-medium mb-2 text-slate-200">Your Reservations</h2>

        {formatTimeWithIcon(currentReservation.time)}
        <div className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3 whitespace-nowrap">Lane {currentReservation.lane}</div>
        <div className="mb-4">
          {formatDateWithBadge(currentReservation.date)}
        </div>
        
        {/* Pagination section - counter and dots */}
        {reservations.length > 1 && (
          <div className="mt-4">
            {/* Counter */}
            <div className="text-xs text-slate-200 mb-2">
              {currentIndex + 1} of {reservations.length}
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center items-center space-x-2">
              {reservations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-[#A8F5E0]' 
                      : 'bg-slate-700/80 hover:bg-slate-600/80'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-md text-center text-white shadow-2xl border border-slate-700/50">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-slate-200">Cancel Reservation?</h3>
              
              {/* Time */}
              <div className="text-3xl font-bold text-white mb-2">
                {reservationToCancel?.time}
              </div>
              
              {/* Lane */}
              <div className="text-xl font-semibold text-slate-100 mb-2">
                Lane {reservationToCancel?.lane}
              </div>
              
              {/* Date */}
              <div className="text-slate-200">
                {reservationToCancel?.date}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmCancel}
                className="w-full px-4 py-3 bg-[#A8F5E0] hover:bg-[#95E6D3] text-slate-800 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel Reservation
              </button>
              <button
                onClick={handleCancelDialog}
                className="w-full px-4 py-3 bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 rounded-lg transition-all duration-200 font-medium"
              >
                Keep Reservation
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default CurrentReservation;