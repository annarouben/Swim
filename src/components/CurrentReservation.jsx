function CurrentReservation({ reservation }) {
  return (
    <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 mb-8 text-center text-white shadow-2xl">
      <h2 className="text-lg font-medium mb-2 text-slate-200">Your Next Reservation</h2>
      <div className="text-5xl font-bold mb-2 text-white">{reservation.time}</div>
      <div className="text-2xl font-semibold text-slate-100 mb-3">Lane {reservation.lane}</div>
      <div className="text-lg text-slate-200">{reservation.date}</div>
    </div>
  )
}

export default CurrentReservation