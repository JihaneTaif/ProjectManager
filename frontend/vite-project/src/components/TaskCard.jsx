export default function TaskCard({ task, onComplete, onDelete, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      TODO: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
      DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
    };
    return badges[status] || badges.TODO;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate).setHours(23, 59, 59) < new Date() && task.status !== "DONE";

  return (
    <div className={`glass animate-fade-in rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${task.status === "DONE"
      ? "border-emerald-500 opacity-80"
      : isOverdue
        ? "border-rose-500 shadow-rose-100 dark:shadow-rose-900/10"
        : "border-indigo-500"
      }`}>
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`text-base font-semibold truncate ${task.status === "DONE"
              ? "line-through text-slate-400 dark:text-slate-500"
              : "text-slate-900 dark:text-white"
              }`}>
              {task.title}
            </h3>
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${getStatusBadge(task.status)}`}>
              {task.status === "DONE" ? "Completed" : "In Progress"}
            </span>
            {isOverdue && (
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse">
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className={`text-sm text-slate-600 dark:text-slate-400 line-clamp-1 ${task.status === "DONE" ? "line-through opacity-50" : ""
              }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-rose-600 dark:text-rose-400 font-medium" : "text-slate-500 dark:text-slate-500"
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {task.status !== "DONE" && (
            <button
              onClick={() => onComplete(task.id)}
              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              title="Mark as Done"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Edit Task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm("Delete this task?")) {
                onDelete(task.id);
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
            title="Delete Task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
