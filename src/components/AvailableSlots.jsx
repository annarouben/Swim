function AvailableSlots({ slots, onSelectSlot }) {
  const isSharedLane = (lane) => lane === 1 || lane === 4;

  const LaneVisual = ({ lane }) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 min-w-[80px]">
          <span className="text-xs text-white/90 font-medium">
            Lane {lane} {isSharedLane(lane) ? 'Shared' : 'Single'}
          </span>
          <div className="flex items-center space-x-1 w-6">
            <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
            {isSharedLane(lane) ? (
              <img src="/Swim/images/user.svg" alt="User" className="w-3 h-3 filter brightness-0 invert opacity-90" />
            ) : (
              <div className="w-3"></div>
            )}
          </div>
        </div>
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
            className="w-full bg-slate-800/50 hover:bg-slate-800/70 rounded-xl px-6 py-4 text-left transition-all duration-200 border border-slate-700/50 hover:border-slate-600/70 cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(168,245,224,0.1)] shadow-md ring-1 ring-white/5"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-semibold mb-1">
                  {slot.time}
                </div>
                <div className="text-sm text-white/70">{slot.date}</div>
              </div>
              <LaneVisual lane={slot.lane} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AvailableSlots