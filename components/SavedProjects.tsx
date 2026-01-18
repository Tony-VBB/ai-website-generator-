'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';

interface Project {
  _id: string;
  title: string;
  prompt: string;
  aiModel: string;
  provider: string;
  createdAt: string;
}

interface SavedProjectsProps {
  onLoadProject: (projectId: string) => void;
}

export default function SavedProjects({ onLoadProject }: SavedProjectsProps) {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Server error when fetching projects:', text.substring(0, 200));
        setLoading(false);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (!session) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Saved Projects</h3>
        <button
          onClick={fetchProjects}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No saved projects yet
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-700 p-3 rounded border border-gray-600 hover:border-gray-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm truncate flex-1">
                  {project.title}
                </h4>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => onLoadProject(project._id)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {project.prompt}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{project.provider} - {project.aiModel}</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
