import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasksByProject, createTask, completeTask, deleteTask, updateTask } from "../api/taskApi";
import { getProjects } from "../api/projectApi";
import TaskCard from "../components/TaskCard";
import { useNotification } from "../context/NotificationContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { addNotification } = useNotification();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [filters, setFilters] = useState({ status: "", title: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProject = useCallback(async () => {
    try {
      const res = await getProjects();
      const foundProject = res.data.find(p => p.id === parseInt(id));
      if (foundProject) {
        setProject(foundProject);
      } else {
        setError("Project not found");
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      addNotification("Could not load project details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, addNotification]);

  const fetchTasks = useCallback(async (projectId) => {
    try {
      setTasksLoading(true);
      const res = await getTasksByProject(Number(projectId), {
        ...filters,
        page: currentPage,
        size: pageSize
      });

      if (res.data && res.data.content !== undefined) {
        setTasks(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else if (Array.isArray(res.data)) {
        setTasks(res.data);
        setTotalPages(1);
        setTotalElements(res.data.length);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      addNotification("Failed to load tasks", "error");
    } finally {
      setTasksLoading(false);
    }
  }, [filters, currentPage, pageSize, addNotification]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.id) {
      fetchTasks(project.id);
    }
  }, [project, fetchTasks]);

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.dueDate) {
      addNotification("Please fill in title and due date", "error");
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: newTask.title.trim(),
          description: newTask.description?.trim() || null,
          dueDate: newTask.dueDate
        });
        addNotification("Task updated successfully", "success");
      } else {
        await createTask(id, {
          title: newTask.title.trim(),
          description: newTask.description?.trim() || null,
          dueDate: newTask.dueDate
        });
        addNotification("Task created successfully", "success");
      }
      setNewTask({ title: "", description: "", dueDate: "" });
      setShowCreateForm(false);
      setEditingTask(null);
      fetchTasks(project.id);
      fetchProject();
    } catch (err) {
      addNotification(editingTask ? "Failed to update task" : "Failed to create task", "error");
    }
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || ""
    });
    setShowCreateForm(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      addNotification("Task completed", "success");
      fetchTasks(project.id);
      fetchProject();
    } catch (err) {
      addNotification("Failed to update task", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      addNotification("Task removed", "info");
      fetchTasks(project.id);
      fetchProject();
    } catch (err) {
      addNotification("Failed to delete task", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading project details...</p>
        </div>
      </div>
    );
  }

  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate).setHours(23, 59, 59) < new Date() && t.status !== "DONE").length;

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6 group">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {project?.title}
                </h1>

              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {project?.description || "No description provided for this project."}
              </p>
            </div>

            <div className="w-full md:w-auto flex items-center gap-8 py-4 px-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/20">
              <div className="text-center shrink-0">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Tasks</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{project?.completedTasks}</span>
                  <span className="text-xs font-bold text-slate-400">/ {project?.totalTasks}</span>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Outdated</p>
                <span className={`text-sm font-bold ${overdueCount > 0 ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                  {overdueCount} Items
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {project?.progressPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 ease-out"
              style={{ width: `${project?.progressPercentage}%` }}
            >
              <div className="absolute top-0 right-0 h-full w-24 bg-white/20 skew-x-12 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="glass flex-1 flex flex-col md:flex-row items-center gap-3 p-2 rounded-2xl shadow-sm">
            <div className="relative flex-1 w-full md:w-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks by name..."
                value={filters.title}
                onChange={(e) => {
                  setFilters({ ...filters, title: e.target.value });
                  setCurrentPage(0);
                }}
                className="w-full bg-transparent pl-10 pr-4 py-2 text-sm border-0 focus:ring-0 placeholder-slate-400 dark:text-white"
              />
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
            <div className="flex items-center gap-2 w-full md:w-auto px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status:</span>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(0);
                }}
                className="bg-transparent border-0 text-sm font-semibold focus:ring-0 dark:text-white"
              >
                <option value="">All Tasks</option>
                <option value="TODO">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setNewTask({ title: "", description: "", dueDate: "" });
              setShowCreateForm(!showCreateForm);
            }}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 ${showCreateForm
              ? "bg-slate-800 text-white hover:bg-slate-900"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            {showCreateForm ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {showCreateForm && !editingTask ? "Close Form" : "Create New Task"}
          </button>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="glass rounded-3xl p-6 mb-8 animate-fade-in shadow-xl border-2 border-indigo-100 dark:border-indigo-900/30">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">
              {editingTask ? "Update Task Details" : "New Task Details"}
            </h2>
            <form onSubmit={handleSubmitTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1.5 ml-1">Title</label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1.5 ml-1">Deadline</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1.5 ml-1">Description (Optional)</label>
                <textarea
                  placeholder="Additional context..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="flex-1 w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 resize-none transition-all dark:text-white"
                  rows="4"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  {editingTask ? "Confirm Update" : "Confirm Creation"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="space-y-3 relative min-h-[400px]">
          {tasksLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm rounded-3xl">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="glass rounded-3xl flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <svg className="relative w-16 h-16 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Workspace Empty</h3>
              <p className="text-slate-500 max-w-xs text-sm">No tasks match your current criteria. Broaden your search or create something new.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTaskClick}
                  />
                ))}
              </div>

              {/* Enhanced Pagination Bar */}
              <div className="glass mt-8 p-4 rounded-2xl flex flex-col sm:row-row sm:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Show:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(0);
                      }}
                      className="bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-xs font-bold py-1 px-2 focus:ring-0 dark:text-white"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest truncate">
                    Total: <span className="text-slate-900 dark:text-white">{totalElements}</span> items
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:border-indigo-500 transition-all dark:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === idx
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                          }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:border-indigo-500 transition-all dark:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
