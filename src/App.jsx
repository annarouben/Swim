import { useState } from 'react';
import './App.css'
import SplashScreen from './components/SplashScreen'
import ReservationsView from './components/ReservationsView'
import SwimPlanView from './components/SwimPlanView'
import Insights from './components/Insights'
import BottomNavigation from './components/BottomNavigation'

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('reserve');

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => {
      setAppVisible(true);
    }, 100);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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
        <div className={`transition-opacity duration-500 ${appVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Main Content Views */}
          <div className="relative">
            {activeTab === 'reserve' && <ReservationsView />}
            {activeTab === 'swim' && <SwimPlanView />}
            {activeTab === 'insights' && <Insights />}
          </div>
          
          {/* Bottom Navigation */}
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
    </div>
  );
}

export default App
