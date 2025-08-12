import { useState, useEffect } from 'react';

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-complete splash screen after 3 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 500); // Wait for fade out animation
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleSkip}
    >
      {/* Background - Water Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="./images/water.jpg" 
          alt="Water background" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/70 to-teal-900/60"></div>
      </div>

      {/* Animation Layer */}
      <ParticleWaveAnimation />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Animated "Swim" Text */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
            {'Swim'.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block animate-float-once"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '2s'
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Designed by text */}
        <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '1s' }}>
          <p className="text-lg text-slate-200/80 font-light">
            Designed by Anna Rouben
          </p>
        </div>
      </div>
    </div>
  );
}

// Particle Wave Animation Component
function ParticleWaveAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Single line of particles moving in wave motion - positioned under "Designed by" text */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-[#A8F5E0]/60 to-blue-300/60 animate-wave-particle"
          style={{
            left: `${30 + (i * 2.67)}%`, // Start at 30% and span to 70% (matches text width)
            top: '75%', // Position well below "Designed by Anna Rouben" text
            width: '6px', // Fixed size for perfectly round particles
            height: '6px', // Same as width for perfect circles
            animationDelay: `${i * 0.1}s`, // Staggered timing for wave effect
            animationDuration: '5s', // Slower wave movement
            transform: 'translateY(-50%)', // Center vertically
          }}
        />
      ))}
    </div>
  );
}

export default SplashScreen;
