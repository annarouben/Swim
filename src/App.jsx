import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[url('/images/water.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
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
  )
}

export default App
