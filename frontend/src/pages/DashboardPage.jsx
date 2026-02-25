import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Flag, ListTodo } from 'lucide-react';
import { api } from '../lib/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import TaskCard from '../components/TaskCard';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([api.get('/tasks/stats'), api.get('/tasks')])
      .then(([statsRes, tasksRes]) => {
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'bg-primary-50 text-primary-600' },
    { label: 'In Progress', value: stats.in_progress, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed', value: stats.done, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Completion Rate', value: `${stats.completion_rate}%`, icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
    { label: 'High Priority', value: stats.high_priority, icon: Flag, color: 'bg-red-50 text-red-600' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your task progress</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="card">
            <div className="card-body flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{s.value}</span>
              <span className="text-xs text-gray-500 mt-0.5">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Progress</h2>
            <span className="text-xs text-gray-500">{stats.done} of {stats.total} tasks done</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
            {stats.done > 0 && (
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(stats.done / stats.total) * 100}%` }} />
            )}
            {stats.in_progress > 0 && (
              <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${(stats.in_progress / stats.total) * 100}%` }} />
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Done</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200" /> To Do</span>
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
