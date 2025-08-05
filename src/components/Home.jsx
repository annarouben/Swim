import { useState, useEffect, useRef } from 'react'
import CurrentReservation from './CurrentReservation'
import AvailableSlots from './AvailableSlots'

function Home() {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [reservations, setReservations] = useState([
    { time: '2:30 PM', date: 'Today, Aug 5', lane: 3 },
    { time: '7:00 AM', date: 'Wed, Aug 7', lane: 1 },
    { time: '6:30 PM', date: 'Fri, Aug 9', lane: 4 }
  ])

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

  const availableSlots = [
    // Today's slots
    { time: '4:00 PM', date: 'Today, Aug 5', lane: 2 },
    { time: '5:30 PM', date: 'Today, Aug 5', lane: 3 },
    { time: '6:30 PM', date: 'Today, Aug 5', lane: 1 },
    { time: '8:00 PM', date: 'Today, Aug 5', lane: 4 },
    
    // Tomorrow's slots
    { time: '7:00 AM', date: 'Tomorrow, Aug 6', lane: 4 },
    { time: '8:30 AM', date: 'Tomorrow, Aug 6', lane: 2 },
    { time: '10:00 AM', date: 'Tomorrow, Aug 6', lane: 1 },
    { time: '2:00 PM', date: 'Tomorrow, Aug 6', lane: 3 },
    { time: '5:00 PM', date: 'Tomorrow, Aug 6', lane: 2 },
    { time: '7:30 PM', date: 'Tomorrow, Aug 6', lane: 4 },
    
    // Day after tomorrow
    { time: '6:00 AM', date: 'Wed, Aug 7', lane: 1 },
    { time: '9:00 AM', date: 'Wed, Aug 7', lane: 3 },
    { time: '11:30 AM', date: 'Wed, Aug 7', lane: 2 },
    { time: '1:00 PM', date: 'Wed, Aug 7', lane: 4 },
    { time: '4:30 PM', date: 'Wed, Aug 7', lane: 1 },
    { time: '6:00 PM', date: 'Wed, Aug 7', lane: 3 },
    
    // Thursday
    { time: '6:30 AM', date: 'Thu, Aug 8', lane: 2 },
    { time: '8:00 AM', date: 'Thu, Aug 8', lane: 4 },
    { time: '12:00 PM', date: 'Thu, Aug 8', lane: 1 },
    { time: '3:30 PM', date: 'Thu, Aug 8', lane: 3 },
    { time: '5:30 PM', date: 'Thu, Aug 8', lane: 2 },
    { time: '8:30 PM', date: 'Thu, Aug 8', lane: 4 },
    
    // Friday
    { time: '7:30 AM', date: 'Fri, Aug 9', lane: 1 },
    { time: '10:30 AM', date: 'Fri, Aug 9', lane: 3 },
    { time: '1:30 PM', date: 'Fri, Aug 9', lane: 2 },
    { time: '4:00 PM', date: 'Fri, Aug 9', lane: 4 },
    { time: '6:30 PM', date: 'Fri, Aug 9', lane: 1 },
    
    // Saturday  
    { time: '6:00 AM', date: 'Sat, Aug 10', lane: 3 },
    { time: '9:30 AM', date: 'Sat, Aug 10', lane: 2 },
    { time: '12:30 PM', date: 'Sat, Aug 10', lane: 4 },
    { time: '3:00 PM', date: 'Sat, Aug 10', lane: 1 },
    { time: '7:00 PM', date: 'Sat, Aug 10', lane: 3 }
  ]

  const handleSelectSlot = (slot) => {
    console.log('Selected slot:', slot)
    // Handle reservation logic here
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
          reservations={reservations} 
          onCancelReservation={handleCancelReservation}
        />
        <AvailableSlots slots={availableSlots} onSelectSlot={handleSelectSlot} />
      </div>
    </div>
  )
}

export default Home;