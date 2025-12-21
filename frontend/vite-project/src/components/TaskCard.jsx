export default function TaskCard({ task, onComplete, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      TODO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      DONE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    };
    return badges[status] || badges.TODO;
  };

  const getStatusLabel = (status) => {
    const labels = {
      TODO: "To Do",
      DONE: "Done"
    };
    return labels[status] || status;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${
      task.status === "DONE" 
        ? "border-green-500 opacity-75" 
        : isOverdue
        ? "border-red-500"
        : "border-blue-500"
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-lg font-bold ${
                task.status === "DONE" 
                  ? "line-through text-gray-400 dark:text-gray-500" 
                  : "text-gray-900 dark:text-white"
              }`}>
                {task.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(task.status)}`}>
                {getStatusLabel(task.status)}
              </span>
            </div>
            {task.description && (
              <p className={`text-gray-600 dark:text-gray-300 mb-3 ${
                task.status === "DONE" ? "line-through opacity-60" : ""
              }`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${
                isOverdue ? "text-red-600 dark:text-red-400 font-semibold" : "text-gray-500 dark:text-gray-400"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <span className="ml-1">(Overdue)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {task.status !== "DONE" && (
            <button
              onClick={() => onComplete(task.id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this task?")) {
                onDelete(task.id);
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
