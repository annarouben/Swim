import { useState } from 'react';
import './App.css'
import Home from './components/Home'
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [homeVisible, setHomeVisible] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setHomeVisible(true);
    }, 100);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="./images/water.jpg" 
          alt="Water background" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay to match splash screen */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/70 to-teal-900/60"></div>
      </div>
      
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <div className={`transition-opacity duration-500 ${homeVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Home />
        </div>
      )}
    </div>
  );
}

export default App
