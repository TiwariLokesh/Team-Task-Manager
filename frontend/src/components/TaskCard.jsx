const TaskCard = ({ task, onStatusChange, canUpdate }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{task.title}</p>
          <p className="mt-1 text-xs text-steel">{task.description || 'No description'}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-wider text-steel">
          {task.priority}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-steel">
        <span>Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}</span>
        {canUpdate && (
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task.id, event.target.value)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-ink"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        )}
      </div>
    </div>
  )
}

export default TaskCard
