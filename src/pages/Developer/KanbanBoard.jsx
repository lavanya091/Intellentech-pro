import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  ChevronRight, 
  Clock, 
  MoreVertical, 
  User as UserIcon,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to move task');
    }
  };

  const columns = [
    { id: 'To Do', name: 'To Do', color: 'bg-gray-100' },
    { id: 'In Progress', name: 'In Progress', color: 'bg-blue-50' },
    { id: 'Done', name: 'Done', color: 'bg-green-50' },
  ];

  if (loading) return <div>Loading board...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Kanban Board</h1>
          <p className="text-gray-500">Manage and track your assigned tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  column.id === 'To Do' ? 'bg-gray-400' : 
                  column.id === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                }`}></span>
                <h2 className="font-semibold text-gray-700">{column.name}</h2>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tasks.filter(t => t.status === column.id).map((task) => (
                <motion.div
                  layoutId={task._id}
                  key={task._id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1 leading-tight">{task.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span className="text-xs">{task.comments?.length || 0}</span>
                      </div>
                    </div>
                    {task.project && (
                      <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                        {task.project.name}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    {column.id !== 'To Do' && (
                      <button 
                        onClick={() => moveTask(task._id, 'To Do')}
                        className="flex-1 text-[11px] font-semibold py-1.5 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        ← To Do
                      </button>
                    )}
                    {column.id !== 'In Progress' && (
                      <button 
                        onClick={() => moveTask(task._id, 'In Progress')}
                        className="flex-1 text-[11px] font-semibold py-1.5 rounded bg-blue-50 text-primary-600 hover:bg-blue-100 transition-colors"
                      >
                        {column.id === 'To Do' ? 'Start →' : '← In Progress'}
                      </button>
                    )}
                    {column.id !== 'Done' && (
                      <button 
                        onClick={() => moveTask(task._id, 'Done')}
                        className="flex-1 text-[11px] font-semibold py-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      >
                        Finish ✓
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {tasks.filter(t => t.status === column.id).length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                  <p className="text-xs">No tasks here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
