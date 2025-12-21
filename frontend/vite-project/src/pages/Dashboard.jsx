import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, updateProject } from "../api/projectApi";
import { AuthContext } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { useNotification } from "../context/NotificationContext";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const { user, logout } = useContext(AuthContext);
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      addNotification("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      addNotification("Project title is required", "error");
      return;
    }
    try {
      if (editingProject) {
        await updateProject(editingProject.id, newProject);
        addNotification("Project updated successfully!", "success");
      } else {
        await createProject(newProject);
        addNotification("Project created successfully!", "success");
      }
      setNewProject({ title: "", description: "" });
      setShowCreateForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      addNotification(editingProject ? "Could not update project" : "Could not create project", "error");
      console.error("Error submitting project:", err);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setNewProject({ title: project.title, description: project.description });
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    addNotification("Project removed", "info");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Stats calculation
  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / totalProjects)
    : 0;
  const completedProjects = projects.filter(p => p.progressPercentage === 100).length;

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">

            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {user?.email?.split('@')[0] || 'User'}'s <span className="text-indigo-600 dark:text-indigo-400">Workspace</span>
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {totalProjects} Active Projects
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setEditingProject(null);
                setNewProject({ title: "", description: "" });
                setShowCreateForm(!showCreateForm);
              }}
              className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showCreateForm && !editingProject ? "Close Hub" : "New Project"}
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass p-5 rounded-2xl shadow-sm border-l-4 border-indigo-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Projects</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalProjects}</h3>
          </div>
          <div className="glass p-5 rounded-2xl shadow-sm border-l-4 border-emerald-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency Rate </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{avgProgress}%</h3>
          </div>
          <div className="glass p-5 rounded-2xl shadow-sm border-l-4 border-amber-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Finished Projects</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{completedProjects} Done</h3>
          </div>
        </div>

        {/* Create Project Form - Compact Overlay */}
        {showCreateForm && (
          <div className="glass rounded-2xl p-6 mb-8 animate-fade-in shadow-xl border-2 border-indigo-100 dark:border-indigo-900/30">
            <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">
              {editingProject ? "Update Project Details" : "Setup New Project"}
            </h2>
            <form onSubmit={handleSubmitProject} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-all text-sm dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Short Description..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-all text-sm dark:text-white"
                />
              </div>
              <div className="flex md:flex-col gap-2">
                <button
                  type="submit"
                  className="flex-1 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  {editingProject ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProject(null);
                    setNewProject({ title: "", description: "" });
                  }}
                  className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass rounded-3xl py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full scale-150"></div>
              <svg className="relative mx-auto h-16 w-16 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">No Projects Detected</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 tracking-wide italic">Your workspace is currently quiet. Time to launch something new.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-500/20 transition-all"
            >
              Start New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} onEdit={handleEditClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
