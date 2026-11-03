import { CheckCheck, ListTodo, Clock3 } from 'lucide-react';

const summaryItems = [
  { key: 'total', label: 'Total tasks', icon: ListTodo, tone: 'purple', description: 'All your tasks' },
  { key: 'pending', label: 'Pending tasks', icon: Clock3, tone: 'orange', description: 'Still in progress' },
  { key: 'completed', label: 'Completed tasks', icon: CheckCheck, tone: 'green', description: 'Successfully finished' },
];

export default function DashboardSummary({ counts }) {
  return (
    <section className="summary-grid" aria-label="Task summary">
      {summaryItems.map(({ key, label, icon: Icon, tone, description }) => (
        <article className="summary-card" key={key}>
          <div className={`summary-icon ${tone}`}><Icon size={20} /></div>
          <div className="summary-content">
            <p className="summary-label">{label}</p>
            <div className="summary-bottom"><strong>{counts[key]}</strong><span>{description}</span></div>
          </div>
        </article>
      ))}
    </section>
  );
}
