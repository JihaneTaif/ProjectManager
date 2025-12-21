import { Link } from "react-router-dom";
import { deleteProject } from "../api/projectApi";
import { useState } from "react";

export default function ProjectCard({ project, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      setIsDeleting(true);
      try {
        await deleteProject(project.id);
        onDelete(project.id);
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const progressColor = project.progressPercentage === 100 
    ? "bg-green-500" 
    : project.progressPercentage >= 50 
    ? "bg-blue-500" 
    : "bg-yellow-500";

  return (
    <Link 
      to={`/projects/${project.id}`} 
      className="block group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h2>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors disabled:opacity-50"
            title="Delete project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description || "No description"}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {project.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${project.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

