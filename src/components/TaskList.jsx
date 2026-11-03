import { ListTodo } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, onToggleStatus, onDeleteTask, activeFilter }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><ListTodo size={27} /></div>
        <h3>{activeFilter === 'All' ? 'No tasks yet' : `No ${activeFilter.toLowerCase()} tasks`}</h3>
        <p>{activeFilter === 'All' ? 'Add your first task using the form to get started.' : 'There are no tasks in this category right now.'}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggleStatus={onToggleStatus} onDeleteTask={onDeleteTask} />
      ))}
    </div>
  );
}
