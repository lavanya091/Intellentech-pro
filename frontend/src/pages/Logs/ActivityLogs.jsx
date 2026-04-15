import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  History, 
  Filter, 
  Calendar, 
  Clock,
  User as UserIcon, 
  Tag,
  Search,
  ArrowDownAz,
  FileText
} from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/activity?${queryParams}`);
      setLogs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('Created')) return 'bg-green-100 text-green-700';
    if (action.includes('Updated') || action.includes('Reset')) return 'bg-blue-100 text-blue-700';
    if (action.includes('Deleted')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500">Audit trail of all system actions and events.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
            >
              <option value="">All Actions</option>
              <option value="Login">Login</option>
              <option value="User Created">User Created</option>
              <option value="Project Created">Project Created</option>
              <option value="Task Created">Task Created</option>
              <option value="Task Updated">Task Updated</option>
              <option value="Password Reset">Password Reset</option>
            </select>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={() => setFilters({ action: '', startDate: '', endDate: '' })}
          className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium transition"
        >
          Reset
        </button>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading audit logs...</div>
        ) : logs.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log._id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)} mt-1`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-900">{log.action}</p>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserIcon size={12} />
                        <span>Performed by: <span className="font-medium text-gray-700">{log.user?.name}</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Tag size={12} />
                        <span>Type: <span className="font-medium text-gray-700">{log.entityType}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
            <History size={48} className="mx-auto mb-4 opacity-20" />
            <p>No activity logs found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
