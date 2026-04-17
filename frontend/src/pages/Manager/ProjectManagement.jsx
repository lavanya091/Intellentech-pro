import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Briefcase, 
  ListTodo, 
  User as UserIcon, 
  Calendar,
  ChevronRight,
  MoreVertical,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Projects
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error('Failed to fetch projects');
    }

    // Fetch Developers
    try {
      const res = await axios.get('/api/users');
      // Case-insensitive filter for developers for maximum compatibility
      setDevelopers(res.data.data.filter(u => u.role.toLowerCase() === 'developer'));
    } catch (err) {
      console.error('Failed to fetch developers');
    }

    setLoading(false);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', projectForm);
      setShowProjectModal(false);
      setProjectForm({ name: '', description: '' });
      fetchData();
    } catch (err) {
      alert('Error creating project');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...taskForm, project: selectedProjectId });
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      fetchData();
    } catch (err) {
      alert('Error creating task');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project & Task Management</h1>
          <p className="text-gray-500">Manage your projects and assign tasks to developers.</p>
        </div>
        <button 
          onClick={() => setShowProjectModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase size={20} className="text-primary-600" />
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              </div>
              <button 
                onClick={() => { setSelectedProjectId(project._id); setShowTaskModal(true); }}
                className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>
            
            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Project Tasks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* We'd normally filter tasks here, but for now we'll just show all since we lack a complex join */}
                <p className="text-sm text-gray-400 italic col-span-full">Manage tasks through the Kanban board or comprehensive list views.</p>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
            <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
            <p>You haven't created any projects yet.</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Create New Project</h3>
              <button onClick={() => setShowProjectModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Project Name</label>
                <input 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  value={projectForm.name}
                  onChange={e => setProjectForm({...projectForm, name: e.target.value})}
                  required
                  placeholder="e.g. Website Overhaul"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <textarea 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 h-24"
                  value={projectForm.description}
                  onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                  required
                  placeholder="What is this project about?"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add Task to Project</h3>
              <button onClick={() => setShowTaskModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <input 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select 
                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                    value={taskForm.priority}
                    onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input 
                    type="date"
                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  value={taskForm.assignedTo}
                  onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  required
                >
                  <option value="">Select Developer</option>
                  {developers.map(dev => <option key={dev._id} value={dev._id}>{dev.name}</option>)}
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
