import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  TrendingUp,
  ChevronRight,
  Columns
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DeveloperDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch developer tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const stats = [
    { title: 'My Tasks', value: tasks.length, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Completed', value: tasks.filter(t => t.status === 'Done').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'High Priority', value: tasks.filter(t => t.priority === 'High').length, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
          <p className="text-gray-500">Overview of your tasks and progress.</p>
        </div>
        <Link 
          to="/developer/kanban" 
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Columns size={16} />
          Open Kanban Board
        </Link>
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
        {/* Task Progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Task Progress</h3>
          </div>
          <div className="p-6 space-y-4">
            {['Done', 'In Progress', 'To Do'].map(status => {
              const count = tasks.filter(t => t.status === status).length;
              const total = tasks.length || 1;
              const percent = (count / total) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{status}</span>
                    <span className="text-gray-500">{count} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        status === 'Done' ? 'bg-green-500' : 
                        status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Tasks</h3>
            <Link to="/developer/kanban" className="text-sm text-primary-600 font-medium hover:underline">View Board</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 truncate">{task.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Status: <span className={`font-medium ${
                      task.status === 'Done' ? 'text-green-600' :
                      task.status === 'In Progress' ? 'text-blue-600' : 'text-gray-600'
                    }`}>{task.status}</span>
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </div>
            ))}
            {tasks.length === 0 && <p className="p-6 text-center text-gray-500">No tasks assigned yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
