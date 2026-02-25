import { Calendar, Flag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const priorityColors = {
  high: 'badge-danger',
  medium: 'badge-warning',
  low: 'badge-primary',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const nextStatus = {
  todo: 'in_progress',
  in_progress: 'done',
};

export default function TaskCard({ task, onStatusChange }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/tasks/${task.id}/edit`} className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors ${task.status === 'done' ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h3>
          </Link>
          <span className={priorityColors[task.priority]}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {task.due_date && (
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          {nextStatus[task.status] && onStatusChange && (
            <button
              onClick={() => onStatusChange(task.id, nextStatus[task.status])}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Move <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
