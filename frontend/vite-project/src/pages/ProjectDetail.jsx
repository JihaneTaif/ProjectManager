import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasksByProject, createTask, completeTask, deleteTask } from "../api/taskApi";
import { getProjects } from "../api/projectApi";
import TaskCard from "../components/TaskCard";

export default function ProjectDetail() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [filters, setFilters] = useState({ status: "", title: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

 useEffect(() => {
  fetchProject();
}, [id]);

useEffect(() => {
  if (project?.id) {
    fetchTasks(project.id);
  }
}, [project, filters, currentPage]);


  const fetchProject = async () => {
  try {
    const res = await getProjects();
    const foundProject = res.data.find(p => p.id === parseInt(id));
    if (foundProject) {
      setProject(foundProject);
    } else {
      setError("Project not found");
    }
  } catch (err) {
    setError("Failed to load project");
    console.error("Error fetching project:", err);
  }
};


  const fetchTasks = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTasksByProject(
        Number(projectId), {
        ...filters,
        page: currentPage,
        size: 10
      });
      console.log("Tasks response:", res.data);
      // Handle paginated response (Spring returns Page object)
      if (res.data && res.data.content !== undefined) {
        // Spring Page object structure
        setTasks(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } else if (Array.isArray(res.data)) {
        // Fallback for non-paginated response
        setTasks(res.data);
        setTotalPages(0);
      } else {
        // Empty or unexpected response
        setTasks([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      // Handle 401 separately (will be handled by interceptor)
      if (err.response?.status === 401) {
        return; // Interceptor will handle redirect
      }
      
      let errorMessage = "Failed to load tasks. Please try again.";
      if (err.response) {
        const errorData = err.response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to access these tasks. Please try logging in again.";
        } else {
          errorMessage = `Server error: ${err.response.status} ${err.response.statusText || ''}`;
        }
      } else if (err.request) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      // Prepare task data - convert empty description to null and ensure date is in correct format
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description?.trim() || null,
        dueDate: newTask.dueDate || null
      };
      
      console.log("Creating task with data:", { projectId: id, task: taskData });
      const res = await createTask(id, taskData);
      console.log("Task created:", res.data);
      setNewTask({ title: "", description: "", dueDate: "" });
      setShowCreateForm(false);
      fetchTasks(project.id);
      fetchProject(); // Refresh project to update progress
    } catch (err) {
      console.error("Error creating task:", err);
      let errorMessage = "Failed to create task. Please try again.";
      if (err.response) {
        const errorData = err.response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (Array.isArray(errorData)) {
          // Validation errors
          errorMessage = errorData.map(e => e.defaultMessage || e.message).join(", ");
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      }
      alert(errorMessage);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      fetchTasks(project.id);
      fetchProject(); // Refresh project to update progress
    } catch (err) {
      alert("Failed to complete task. Please try again.");
      console.error("Error completing task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks(project.id);
      fetchProject(); // Refresh project to update progress
    } catch (err) {
      alert("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(0); // Reset to first page when filtering
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          
          {project && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {project.description || "No description"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progress</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {project.progressPercentage}%
                  </div>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        project.progressPercentage === 100
                          ? "bg-green-500"
                          : project.progressPercentage >= 50
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search by Title
              </label>
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: "", title: "" });
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Create Task Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showCreateForm ? "Cancel" : "New Task"}
          </button>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Task
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTask({ title: "", description: "", dueDate: "" });
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get started by creating your first task
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}