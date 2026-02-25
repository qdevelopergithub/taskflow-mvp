import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { showToast } from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import TaskCard from '../components/TaskCard';
import { Columns3 } from 'lucide-react';

const columns = [
  { key: 'todo', label: 'To Do', color: 'border-gray-300', bgDot: 'bg-gray-400' },
  { key: 'in_progress', label: 'In Progress', color: 'border-amber-400', bgDot: 'bg-amber-400' },
  { key: 'done', label: 'Done', color: 'border-emerald-500', bgDot: 'bg-emerald-500' },
];

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    api.get('/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      showToast('Task moved');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Board</h1>
        <p className="mt-1 text-sm text-gray-500">Drag-free kanban — click "Move" to advance tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className={`flex items-center gap-2 pb-2 border-b-2 ${col.color}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${col.bgDot}`} />
                <h2 className="text-sm font-semibold text-gray-900">{col.label}</h2>
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{colTasks.length}</span>
              </div>
              {colTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No tasks</div>
              ) : (
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
