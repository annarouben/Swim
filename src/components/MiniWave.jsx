import React from 'react';

function MiniWave() {
  return (
    <div className="relative w-12 h-4 overflow-hidden">
      {/* Mini particle wave - 4 particles for subtlety */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#A8F5E0]/70 animate-mini-wave-particle"
          style={{
            left: `${i * 25}%`, // Evenly spaced particles
            top: '50%',
            width: '3px',
            height: '3px',
            animationDelay: `${i * 0.2}s`, // Gentle staggered timing
            animationDuration: '3s', // Slower, smoother movement
            transform: 'translateY(-50%)',
          }}
        />
      ))}
    </div>
  );
}

export default MiniWave;
