function AvailableSlots({ slots, onSelectSlot }) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl border border-white/20 w-full max-w-md">
      <h3 className="text-lg font-medium mb-4 text-center text-white/80">Available Times</h3>
      <div className="space-y-3">
        {slots.map((slot, index) => (
          <button 
            key={index}
            onClick={() => onSelectSlot(slot)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 text-left transition-all duration-200 border border-white/10 hover:border-white/30"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-semibold">{slot.time}</div>
                <div className="text-sm text-white/70">{slot.date}</div>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1">
                <span className="text-sm font-medium">Lane {slot.lane}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AvailableSlots