import { useState, useEffect } from 'react';

function SplashScreenDemo({ onComplete }) {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const demos = [
    { name: 'Ripples', component: RippleDemo },
    { name: 'Waves', component: WaveDemo },
    { name: 'Liquid Blobs', component: LiquidDemo },
    { name: 'Particle Wave', component: ParticleDemo },
    { name: 'Gradient Flow', component: GradientDemo }
  ];

  useEffect(() => {
    // Auto-advance demo every 4 seconds
    const timer = setInterval(() => {
      setCurrentDemo((prev) => {
        if (prev >= demos.length - 1) {
          // Complete after all demos
          handleComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 500);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const CurrentDemoComponent = demos[currentDemo]?.component || RippleDemo;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleSkip}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src="./images/water.jpg" 
          alt="Water background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/70 to-teal-900/60"></div>
      </div>

      {/* Current Animation */}
      <CurrentDemoComponent />

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl animate-pulse">
            Swim
          </h1>
        </div>

        <div className="opacity-80">
          <p className="text-lg text-slate-200/80 font-light mb-2">
            Designed by Anna Rouben
          </p>
          <p className="text-sm text-slate-300/60">
            Demo: {demos[currentDemo]?.name}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {demos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentDemo ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={handleSkip}
            className="text-slate-200/60 hover:text-slate-200 text-sm font-medium transition-colors duration-200"
          >
            Tap to skip
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo 1: Concentric Ripples
function RippleDemo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-teal-300/30 animate-ripple-demo"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: `${i * 0.5}s`,
            animationDuration: '4s'
          }}
        />
      ))}
    </div>
  );
}

// Demo 2: Layered Waves
function WaveDemo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="rgba(168, 245, 224, 0.15)" className="animate-wave-demo1" />
      </svg>
      <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,80 C300,20 900,100 1200,40 L1200,120 L0,120 Z" fill="rgba(59, 130, 246, 0.15)" className="animate-wave-demo2" />
      </svg>
      <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C300,80 900,20 1200,80 L1200,120 L0,120 Z" fill="rgba(20, 184, 166, 0.15)" className="animate-wave-demo3" />
      </svg>
    </div>
  );
}

// Demo 3: Floating Liquid Blobs
function LiquidDemo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-r from-blue-400/20 via-teal-400/25 to-cyan-400/20 animate-liquid-blob-demo"
          style={{
            left: `${10 + (i * 8) % 80}%`,
            top: `${10 + (i * 6) % 70}%`,
            width: `${40 + Math.sin(i) * 20}px`,
            height: `${40 + Math.cos(i) * 20}px`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${4 + (i % 3)}s`,
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
}

// Demo 4: Particle Wave Effect
function ParticleDemo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-teal-300/60 rounded-full animate-particle-wave"
          style={{
            left: `${(i * 4) % 100}%`,
            bottom: '20%',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  );
}

// Demo 5: Gradient Flow
function GradientDemo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-gradient-flow-1" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-teal-500/20 to-transparent animate-gradient-flow-2" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/15 to-transparent animate-gradient-flow-3" />
    </div>
  );
}

export default SplashScreenDemo;
