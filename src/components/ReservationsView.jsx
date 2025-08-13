import { useState, useEffect, useRef } from 'react'
import CurrentReservation from './CurrentReservation'
import AvailableSlots from './AvailableSlots'

function ReservationsView() {
  const videoRef = useRef(null)
  const reservationsRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  
  // Generate dynamic reservations
  const generateReservations = () => {
    const today = new Date();
    const todayStr = `Today, ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    
    const wed = new Date(today);
    wed.setDate(today.getDate() + 2);
    const wedStr = wed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    const fri = new Date(today);
    fri.setDate(today.getDate() + 4);
    const friStr = fri.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    return [
      { time: '2:30 PM', date: todayStr, lane: 3 },
      { time: '7:00 AM', date: wedStr, lane: 1 },
      { time: '6:30 PM', date: friStr, lane: 4 }
    ];
  };

  const [reservations, setReservations] = useState(generateReservations())

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Stop the video after 10 seconds
      const timer = setTimeout(() => {
        video.pause()
        console.log('Video stopped after 10 seconds')
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Generate dynamic available slots for two weeks starting from today
  const generateAvailableSlots = () => {
    const slots = [];
    const today = new Date();
    const twoWeeksFromToday = new Date(today);
    twoWeeksFromToday.setDate(today.getDate() + 14);
    
    // Time slots available each day (in hours, 24-hour format)
    const timeSlots = [
      { hour: 6, minute: 0 },    // 6:00 AM
      { hour: 7, minute: 30 },   // 7:30 AM
      { hour: 8, minute: 30 },   // 8:30 AM
      { hour: 9, minute: 0 },    // 9:00 AM
      { hour: 10, minute: 30 },  // 10:30 AM
      { hour: 11, minute: 30 },  // 11:30 AM
      { hour: 12, minute: 0 },   // 12:00 PM
      { hour: 13, minute: 0 },   // 1:00 PM
      { hour: 13, minute: 30 },  // 1:30 PM
      { hour: 15, minute: 30 },  // 3:30 PM
      { hour: 16, minute: 0 },   // 4:00 PM
      { hour: 16, minute: 30 },  // 4:30 PM
      { hour: 17, minute: 0 },   // 5:00 PM
      { hour: 17, minute: 30 },  // 5:30 PM
      { hour: 18, minute: 0 },   // 6:00 PM
      { hour: 18, minute: 30 },  // 6:30 PM
      { hour: 19, minute: 30 },  // 7:30 PM
      { hour: 20, minute: 0 },   // 8:00 PM
      { hour: 20, minute: 30 }   // 8:30 PM
    ];
    
    const lanes = [1, 2, 3, 4];
    
    // Generate slots for each day in the two-week period
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      // Generate 4-6 random slots per day
      const numSlotsThisDay = 4 + Math.floor(Math.random() * 3); // 4-6 slots
      const usedTimes = new Set();
      
      for (let i = 0; i < numSlotsThisDay; i++) {
        // Pick a random time slot that hasn't been used today
        let timeSlot;
        let attempts = 0;
        do {
          timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
          attempts++;
        } while (usedTimes.has(`${timeSlot.hour}:${timeSlot.minute}`) && attempts < 20);
        
        if (attempts >= 20) continue; // Skip if we can't find an unused time
        
        usedTimes.add(`${timeSlot.hour}:${timeSlot.minute}`);
        
        // Create time string
        const timeDate = new Date();
        timeDate.setHours(timeSlot.hour, timeSlot.minute);
        const timeString = timeDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        
        // Create date string
        let dateString;
        if (dayOffset === 0) {
          dateString = `Today, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        } else if (dayOffset === 1) {
          dateString = `Tomorrow, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        } else {
          dateString = currentDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
        }
        
        // Pick a random lane
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        
        slots.push({
          time: timeString,
          date: dateString,
          lane: lane,
          id: `slot-${Date.now()}-${Math.random()}`
        });
      }
    }
    
    // Sort slots by date and then by time
    slots.sort((a, b) => {
      // First, sort by date
      const dateA = a.date.includes('Today') ? 0 : a.date.includes('Tomorrow') ? 1 : 2;
      const dateB = b.date.includes('Today') ? 0 : b.date.includes('Tomorrow') ? 1 : 2;
      
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      
      // Then sort by time within the same date
      const timeA = new Date(`1970-01-01 ${a.time}`);
      const timeB = new Date(`1970-01-01 ${b.time}`);
      return timeA - timeB;
    });
    
    return slots;
  };

  const [availableSlots, setAvailableSlots] = useState(generateAvailableSlots());

  const handleSelectSlot = (slot) => {
    // Add to reservations
    setReservations(prev => [...prev, slot]);
  };

  const handleCancelReservation = (indexToCancel) => {
    setReservations(reservations.filter((_, index) => index !== indexToCancel))
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
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => {
          console.log('Video can play')
          setVideoLoaded(true)
        }}
        onLoadedData={() => {
          console.log('Video data loaded')
          setVideoLoaded(true)
        }}
        onEnded={() => {
          console.log('Video ended - should stop now');
        }}
        onError={(e) => {
          console.log('Video failed to load:', e);
          console.log('Video error details:', e.target.error);
        }}
      >
        <source src="./images/movingwater.mp4" type="video/mp4" />
        <p>Your browser does not support the video tag.</p>
      </video>

      {/* Reservation Content */}
      <div className="relative z-10 flex flex-col items-center pt-10 pb-24 px-0 sm:px-3 min-h-screen">
        <CurrentReservation 
          ref={reservationsRef}
          reservations={reservations} 
          onCancelReservation={handleCancelReservation}
        />
        <div className="flex-1 w-full max-w-none sm:max-w-md mx-1 sm:mx-0">
          <AvailableSlots 
            slots={availableSlots} 
            onSelectSlot={handleSelectSlot} 
            reservationsRef={reservationsRef}
          />
        </div>
      </div>
    </div>
  )
}

export default ReservationsView;
