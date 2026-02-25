import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { showToast } from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { Plus, Pencil, Trash2, ListTodo, Filter } from 'lucide-react';

const statusLabels = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const statusStyles = { todo: 'badge-primary', in_progress: 'badge-warning', done: 'badge-success' };
const priorityStyles = { high: 'badge-danger', medium: 'badge-warning', low: 'badge-primary' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (filterPriority) params.set('priority', filterPriority);
    const qs = params.toString() ? `?${params}` : '';
    api.get(`/tasks${qs}`)
      .then((res) => setTasks(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, [filterStatus, filterPriority]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/tasks/${deleteId}`);
      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      showToast('Task deleted');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/tasks/new" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto text-sm py-1.5">
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="input-field w-auto text-sm py-1.5">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          message={filterStatus || filterPriority ? 'Try changing your filters' : 'Create your first task to get started'}
          action={!filterStatus && !filterPriority && (
            <Link to="/tasks/new" className="btn-primary gap-2 mt-2"><Plus className="w-4 h-4" /> New Task</Link>
          )}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => {
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
                  return (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/tasks/${task.id}/edit`} className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors">
                          {task.title}
                        </Link>
                        {task.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{task.description}</p>}
                      </td>
                      <td className="px-4 py-3"><span className={statusStyles[task.status]}>{statusLabels[task.status]}</span></td>
                      <td className="px-4 py-3"><span className={priorityStyles[task.priority]}>{task.priority}</span></td>
                      <td className="px-4 py-3">
                        {task.due_date ? (
                          <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ) : <span className="text-xs text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/tasks/${task.id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(task.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task">
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
