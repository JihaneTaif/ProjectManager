import { Link } from "react-router-dom";
import { deleteProject } from "../api/projectApi";
import { useState } from "react";

export default function ProjectCard({ project, onDelete, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this project and all its tasks?")) {
      setIsDeleting(true);
      try {
        await deleteProject(project.id);
        onDelete(project.id);
      } catch (error) {
        console.error("Failed to delete project:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const progressColor = project.progressPercentage === 100
    ? "bg-emerald-500"
    : project.progressPercentage >= 50
      ? "bg-indigo-500"
      : "bg-amber-500";

  return (
    <Link
      to={`/projects/${project.id}`}
      className="glass card-hover block group relative rounded-2xl overflow-hidden animate-fade-in shadow-sm"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate mb-1">
              {project.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {project.description || "No description provided"}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
              title="Edit project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all disabled:opacity-50"
              title="Delete project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex justify-between items-end mb-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Progress</span>
              <span className="text-[10px] font-bold text-slate-500">
                {project.completedTasks} / {project.totalTasks} Tasks
              </span>
            </div>
            <span className={`text-xs font-black ${project.progressPercentage === 100 ? 'text-emerald-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {project.progressPercentage}%
            </span>
          </div>
          <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
              style={{ width: `${project.progressPercentage}%` }}
            >
              <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-12 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
