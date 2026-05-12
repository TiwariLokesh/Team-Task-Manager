const StatCard = ({ label, value, accent, tone }) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 p-5 shadow-soft ${
        tone || 'bg-white'
      }`}
    >
      <p className="text-xs uppercase tracking-[0.28em] text-steel">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent || 'text-ink'}`}>{value}</p>
    </div>
  )
}

export default StatCard
