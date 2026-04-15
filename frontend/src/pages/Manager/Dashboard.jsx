import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search,
  ChevronRight,
  TrendingUp,
  ListTodo
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const [data, setData] = useState({ projects: [], tasks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/tasks')
        ]);
        setData({ 
          projects: projRes.data.data, 
          tasks: taskRes.data.data 
        });
      } catch (err) {
        console.error('Failed to fetch manager dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const stats = [
    { title: 'My Projects', value: data.projects.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Tasks', value: data.tasks.length, icon: ListTodo, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Completed', value: data.tasks.filter(t => t.status === 'Done').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'High Priority', value: data.tasks.filter(t => t.priority === 'High').length, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-500">Monitor your projects and team performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <Link to="/manager/projects" className="text-sm text-primary-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {data.projects.slice(0, 5).map(project => (
              <div key={project._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{project.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
            {data.projects.length === 0 && <p className="p-6 text-center text-gray-500">No projects created yet.</p>}
          </div>
        </div>

        {/* Task Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Recent Task Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {['Done', 'In Progress', 'To Do'].map(status => {
              const count = data.tasks.filter(t => t.status === status).length;
              const total = data.tasks.length || 1;
              const percent = (count / total) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{status}</span>
                    <span className="text-gray-500">{count} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        status === 'Done' ? 'bg-green-500' : 
                        status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
