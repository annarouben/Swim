import { useState, useEffect, useRef } from 'react'
import CurrentReservation from './CurrentReservation'
import AvailableSlots from './AvailableSlots'

function Home() {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Stop the video after 2 seconds
      const timer = setTimeout(() => {
        video.pause()
        console.log('Video stopped after 2 seconds')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Mock data for reservations
  const reservations = [
    { time: '2:30 PM', date: 'Today, Feb 1', lane: 3 },
    { time: '7:00 AM', date: 'Wed, Feb 3', lane: 1 },
    { time: '6:30 PM', date: 'Fri, Feb 5', lane: 4 }
  ]

  const availableSlots = [
    { time: '4:00 PM', date: 'Today, Feb 1', lane: 2 },
    { time: '6:30 PM', date: 'Today, Feb 1', lane: 1 },
    { time: '7:00 AM', date: 'Tomorrow, Feb 2', lane: 4 }
  ]

  const handleSelectSlot = (slot) => {
    console.log('Selected slot:', slot)
    // Handle reservation logic here
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
      <div className="relative z-10 flex flex-col items-center pt-20 pb-20 px-6 min-h-screen">
        <CurrentReservation reservations={reservations} />
        <AvailableSlots slots={availableSlots} onSelectSlot={handleSelectSlot} />
      </div>
    </div>
  )
}

export default Home;