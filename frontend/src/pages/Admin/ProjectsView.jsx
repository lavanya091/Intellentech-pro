import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, ListTodo, User as UserIcon, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const AdminProjectsView = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/tasks'),
        ]);
        setProjects(projRes.data.data);
        setTasks(taskRes.data.data);
      } catch (err) {
        console.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading projects...</div>;

  const getStatusIcon = (status) => {
    if (status === 'Done') return <CheckCircle2 size={14} className="text-green-500" />;
    if (status === 'In Progress') return <Clock size={14} className="text-blue-500" />;
    return <AlertCircle size={14} className="text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
        <p className="text-gray-500">View-only overview of all projects and tasks across the system.</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg"><Briefcase size={20} className="text-indigo-600" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Projects</p>
            <p className="text-xl font-bold text-gray-900">{projects.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg"><ListTodo size={20} className="text-blue-600" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Tasks</p>
            <p className="text-xl font-bold text-gray-900">{tasks.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 size={20} className="text-green-600" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Completed Tasks</p>
            <p className="text-xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Done').length}</p>
          </div>
        </div>
      </div>

      {/* Projects list */}
      <div className="space-y-4">
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.project?._id === project._id || t.project === project._id);
          return (
            <div key={project._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Briefcase size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{project.description}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-lg">
                  {projectTasks.length} tasks
                </span>
              </div>

              {projectTasks.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {projectTasks.map(task => (
                    <div key={task._id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            Assigned to: <span className="font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          task.priority === 'High' ? 'bg-red-50 text-red-600' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          task.status === 'Done' ? 'bg-green-100 text-green-700' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-5 text-sm text-gray-400 italic">No tasks in this project yet.</p>
              )}
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
            <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
            <p>No projects found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsView;
