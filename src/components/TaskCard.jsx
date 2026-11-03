import { Check, Circle, Trash2 } from 'lucide-react';

export default function TaskCard({ task, onToggleStatus, onDeleteTask }) {
  const isCompleted = task.status === 'Completed';

  return (
    <article className={`task-card ${isCompleted ? 'is-completed' : ''}`}>
      <button className={`status-toggle ${isCompleted ? 'checked' : ''}`} type="button" onClick={() => onToggleStatus(task.id)} aria-label={isCompleted ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`} title={isCompleted ? 'Mark as pending' : 'Mark as completed'}>
        {isCompleted ? <Check size={15} strokeWidth={3} /> : <Circle size={19} />}
      </button>
      <div className="task-card-content">
        <div className="task-title-row"><h3>{task.title}</h3><span className={`priority-badge priority-${task.priority.toLowerCase()}`}><span />{task.priority}</span></div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta"><span className={`status-label ${isCompleted ? 'completed-label' : 'pending-label'}`}>{task.status}</span></div>
      </div>
      <button className="delete-button" type="button" onClick={() => onDeleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={17} /></button>
    </article>
  );
}
