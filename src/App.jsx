import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
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

  return (
    <div className="fixed inset-0 min-h-screen min-w-full overflow-hidden">
      {/* Static water image background - shows while video loads */}
      <div 
        className={`absolute inset-0 w-full h-full bg-[url('/Swim/images/water.jpg')] bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
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
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
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
      
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Swim
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
              Reserve your lane, dive into fitness
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
