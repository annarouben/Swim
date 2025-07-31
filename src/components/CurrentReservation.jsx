function CurrentReservation({ reservation }) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 mb-8 text-center text-white shadow-2xl border border-white/20">
      <h2 className="text-lg font-medium mb-2 text-white/80">Your Next Reservation</h2>
      <div className="text-5xl font-bold mb-2">{reservation.time}</div>
      <div className="text-xl text-white/90 mb-3">{reservation.date}</div>
      <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2">
        <span className="text-sm font-medium">Lane {reservation.lane}</span>
      </div>
    </div>
  )
}

export default CurrentReservation