import { useState } from 'react';
import { Plus } from 'lucide-react';

const emptyForm = { title: '', description: '', priority: 'Medium' };

export default function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (name === 'title' && value.trim()) setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    onAddTask({ ...formData, title: formData.title.trim(), description: formData.description.trim() });
    setFormData(emptyForm);
    setError('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="task-title">Task title <span>*</span></label>
        <input id="task-title" name="title" type="text" placeholder="e.g. Finish project presentation" value={formData.title} onChange={handleChange} aria-invalid={Boolean(error)} aria-describedby={error ? 'title-error' : undefined} />
        {error && <small className="field-error" id="title-error">{error}</small>}
      </div>
      <div className="form-field">
        <label htmlFor="task-description">Description <span className="optional-label">(optional)</span></label>
        <textarea id="task-description" name="description" rows="4" placeholder="Add a few details about this task..." value={formData.description} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="task-priority">Priority</label>
        <select id="task-priority" name="priority" value={formData.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button className="add-task-button" type="submit"><Plus size={18} /> Add task</button>
    </form>
  );
}
