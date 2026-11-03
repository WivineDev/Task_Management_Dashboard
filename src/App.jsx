import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, LayoutDashboard, ListTodo, Plus, Sparkles } from 'lucide-react';
import DashboardSummary from './components/DashboardSummary.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

const storageKey = 'taskflow-tasks';
const validPriorities = ['Low', 'Medium', 'High'];
const validStatuses = ['Pending', 'Completed'];

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(storageKey);
    if (!savedTasks) return { tasks: [], error: '' };

    const parsedTasks = JSON.parse(savedTasks);
    const isValidTask = (task) => (
      task
      && typeof task.id === 'string'
      && typeof task.title === 'string'
      && typeof task.description === 'string'
      && validPriorities.includes(task.priority)
      && validStatuses.includes(task.status)
    );

    if (!Array.isArray(parsedTasks) || !parsedTasks.every(isValidTask)) {
      return {
        tasks: [],
        error: 'Saved tasks could not be loaded. Add or update a task to replace the invalid saved data.',
      };
    }

    return { tasks: parsedTasks, error: '' };
  } catch {
    return {
      tasks: [],
      error: 'Saved tasks could not be read from this browser. Add or update a task to try saving again.',
    };
  }
}

export default function App() {
  const [initialState] = useState(loadTasks);
  const [tasks, setTasks] = useState(initialState.tasks);
  const [storageError, setStorageError] = useState(initialState.error);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hasTaskChanges, setHasTaskChanges] = useState(false);
  const [activeNav, setActiveNav] = useState(() => (
    window.location.hash === '#tasks' ? 'tasks' : 'top'
  ));

  useEffect(() => {
    if (!hasTaskChanges) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      setStorageError('');
    } catch {
      setStorageError('Tasks changed but could not be saved to this browser. Check your browser storage settings.');
    }
  }, [tasks, hasTaskChanges]);

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'Pending').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
  }), [tasks]);

  const visibleTasks = useMemo(() => {
    if (activeFilter === 'All') return tasks;
    return tasks.filter((task) => task.status === activeFilter);
  }, [tasks, activeFilter]);
  const completionRate = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

  function addTask(taskDetails) {
    const newTask = {
      id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...taskDetails,
      status: 'Pending',
    };
    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setHasTaskChanges(true);
  }

  function toggleTaskStatus(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId
        ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' }
        : task
    )));
    setHasTaskChanges(true);
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    setHasTaskChanges(true);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main sidebar">
        <a className="brand sidebar-brand" href="#top" aria-label="TaskFlow home">
          <span className="brand-mark"><CheckCircle2 size={21} /></span>
          <span>Task<span className="brand-accent">Flow</span></span>
        </a>

        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <a
            className={`sidebar-link ${activeNav === 'top' ? 'active' : ''}`}
            href="#top"
            aria-current={activeNav === 'top' ? 'page' : undefined}
            onClick={() => setActiveNav('top')}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </a>
          <a
            className={`sidebar-link ${activeNav === 'tasks' ? 'active' : ''}`}
            href="#tasks"
            aria-current={activeNav === 'tasks' ? 'page' : undefined}
            onClick={() => setActiveNav('tasks')}
          >
            <ListTodo size={18} />
            <span>My tasks</span>
            <span className="sidebar-count">{counts.total}</span>
          </a>
        </nav>

        <div className="sidebar-spacer" />
        <section className="sidebar-progress" aria-label="Task completion progress">
          <div className="progress-heading"><span className="progress-icon"><Sparkles size={15} /></span><span>Your progress</span></div>
          <p><strong>{counts.completed}</strong> of {counts.total} {counts.total === 1 ? 'task' : 'tasks'} completed</p>
          <div className="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuenow={completionRate} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${completionRate}%` }} />
          </div>
          <span className="progress-caption">{completionRate}% complete</span>
        </section>
        <div className="sidebar-footer"><span className="footer-avatar">T</span><span><strong>Personal space</strong><small>TaskFlow workspace</small></span></div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title"><span>Workspace / Overview</span><h2>Dashboard</h2></div>
          <div className="topbar-note"><span className="online-dot" /> Your personal productivity space</div>
        </header>

        <main className="main-content" id="top">
        <section className="welcome-section">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> PLAN. FOCUS. COMPLETE.</div>
            <h1>Good day! <span>Let’s get things done.</span></h1>
            <p className="welcome-copy">Keep your tasks organized and make progress one step at a time.</p>
          </div>
          <div className="date-chip"><span className="date-icon"><ClipboardList size={17} /></span> My task dashboard</div>
        </section>

        <DashboardSummary counts={counts} />
        {storageError && <p className="field-error" role="status">{storageError}</p>}

        <section className="workspace-grid">
          <aside className="form-panel">
            <div className="section-heading">
              <div className="heading-icon"><Plus size={19} /></div>
              <div><h2>Add a new task</h2><p>What would you like to accomplish?</p></div>
            </div>
            <TaskForm onAddTask={addTask} />
            <div className="tip-box"><span className="tip-icon">✦</span><p><strong>Small steps matter.</strong><br />Break your work into tasks and celebrate every completed step.</p></div>
          </aside>

          <section className="tasks-panel" id="tasks">
            <div className="tasks-header">
              <div className="section-heading list-heading">
                <div className="heading-icon list-icon"><ListTodo size={19} /></div>
                <div><h2>Your tasks</h2><p>Manage and track your daily activities.</p></div>
              </div>
              <span className="task-total">{counts.total} {counts.total === 1 ? 'task' : 'tasks'}</span>
            </div>
            <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
              {['All', 'Pending', 'Completed'].map((filter) => (
                <button
                  className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  <span className="filter-count">{filter === 'All' ? counts.total : filter === 'Pending' ? counts.pending : counts.completed}</span>
                </button>
              ))}
            </div>
            <TaskList tasks={visibleTasks} onToggleStatus={toggleTaskStatus} onDeleteTask={deleteTask} activeFilter={activeFilter} />
          </section>
        </section>
        <footer className="page-footer">Made for better focus <span>•</span> TaskFlow Dashboard</footer>
        </main>
      </div>
    </div>
  );
}
