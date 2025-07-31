function AvailableSlots({ slots, onSelectSlot }) {
  const isSharedLane = (lane) => lane === 1 || lane === 4;

  const LaneVisual = ({ lane }) => {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-white/60 font-medium min-w-[40px]">
          Lane {lane}
        </span>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4].map((laneNum) => (
            <div
              key={laneNum}
              className={`w-1 h-6 rounded-full ${
                laneNum === lane 
                  ? 'bg-[#A8F5E0]' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl w-full max-w-md">
      <h3 className="text-lg font-medium mb-4 text-center text-slate-200">Available Times</h3>
      <div className="space-y-3">
        {slots.map((slot, index) => (
          <button 
            key={index}
            onClick={() => onSelectSlot(slot)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 text-left transition-all duration-200 border border-white/10 hover:border-white/30"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-semibold mb-1">
                  {slot.time}
                </div>
                <div className="text-sm text-white/70">{slot.date}</div>
              </div>
              <div className="flex items-center space-x-2 min-w-[60px]">
                <LaneVisual lane={slot.lane} />
                <div className="flex items-center space-x-1 w-6">
                  <img src="/Swim/images/user.svg" alt="User" className="w-4 h-4 filter brightness-0 invert opacity-75" />
                  {isSharedLane(slot.lane) ? (
                    <img src="/Swim/images/user.svg" alt="User" className="w-4 h-4 filter brightness-0 invert opacity-75" />
                  ) : (
                    <div className="w-4"></div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AvailableSlots