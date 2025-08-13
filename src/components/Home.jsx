import { useState, useEffect, useRef } from 'react'
import CurrentReservation from './CurrentReservation'
import AvailableSlots from './AvailableSlots'

function Home() {
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
      const slotsPerDay = 4 + Math.floor(Math.random() * 3); // 4-6 slots
      const selectedTimeSlots = [];
      
      // Randomly select time slots for this day
      for (let i = 0; i < slotsPerDay; i++) {
        let timeSlot;
        do {
          timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        } while (selectedTimeSlots.some(slot => slot.hour === timeSlot.hour && slot.minute === timeSlot.minute));
        selectedTimeSlots.push(timeSlot);
      }
      
      // Sort time slots by time
      selectedTimeSlots.sort((a, b) => {
        if (a.hour !== b.hour) return a.hour - b.hour;
        return a.minute - b.minute;
      });
      
      // Create slot objects
      selectedTimeSlots.forEach(timeSlot => {
        const slotDate = new Date(currentDate);
        slotDate.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
        
        // Format date string
        let dateString;
        if (dayOffset === 0) {
          dateString = `Today, ${slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        } else if (dayOffset === 1) {
          dateString = `Tomorrow, ${slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        } else {
          dateString = slotDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
        
        // Format time string
        const timeString = slotDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        
        // Random lane
        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        
        slots.push({
          time: timeString,
          date: dateString,
          lane: randomLane,
          id: `${dayOffset}-${timeSlot.hour}-${timeSlot.minute}-${randomLane}`
        });
      });
    }
    
    return slots;
  };

  const availableSlots = generateAvailableSlots()

  const handleSelectSlot = (slot) => {
    console.log('Selected slot:', slot)
    // Add the new reservation to the existing reservations
    setReservations(prev => [...prev, slot])
  }

  const handleCancelReservation = (reservation, index) => {
    console.log('Cancelling reservation:', reservation)
    // Remove the reservation from the array
    setReservations(prev => prev.filter((_, i) => i !== index))
    // Here you would also make an API call to cancel the reservation on the server
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Static water image background - shows while video loads */}
      <div 
        className={`fixed inset-0 w-full h-full bg-[url('/Swim/images/water.jpg')] bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          videoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
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
        <source src="/Swim/images/movingwater.mp4" type="video/mp4" />
        <p>Your browser does not support the video tag.</p>
      </video>

      {/* Reservation Content */}
      <div className="relative z-10 flex flex-col items-center pt-10 pb-10 px-0 sm:px-3 min-h-screen">
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

export default Home;