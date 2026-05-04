import TaskCard from './TaskCard'

const StatusColumn = ({ title, tasks, onStatusChange, canUpdate, accent }) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${accent}`}>{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.length === 0 ? (
          <p className="text-xs text-steel">No tasks here yet.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              canUpdate={canUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default StatusColumn
