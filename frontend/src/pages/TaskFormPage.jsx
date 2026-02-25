import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { showToast } from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/tasks/${id}`)
      .then((res) => {
        const t = res.data;
        setForm({
          title: t.title,
          description: t.description || '',
          status: t.status,
          priority: t.priority,
          due_date: t.due_date || '',
        });
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, form);
        showToast('Task updated');
      } else {
        await api.post('/tasks', form);
        showToast('Task created');
      }
      navigate('/tasks');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link to="/tasks" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Task' : 'New Task'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="What needs to be done?"
              className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select id="status" value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input-field">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select id="priority" value={form.priority} onChange={(e) => handleChange('priority', e.target.value)} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              id="due_date"
              type="date"
              value={form.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Link to="/tasks" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary gap-2">
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
