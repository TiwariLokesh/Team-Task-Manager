const StatCard = ({ label, value, accent }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.28em] text-steel">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent || 'text-ink'}`}>{value}</p>
    </div>
  )
}

export default StatCard
