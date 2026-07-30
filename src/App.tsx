//This CSS is only for the JSX in THIS component and its children
import './App.css'

//Routes is the parent containing the component pages
//Route is the individual pages associated in the DOM
//NavLink is the actual link (href)
import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard.tsx'
import MyTasks from './pages/MyTasks.tsx'
import Calendar from './pages/Calendar.tsx'

function App() {
  return (
    <div className="page">
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M4 18 L11 6 M11 18 L18 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="brand-name">Taskly</span>
          </div>

          <nav className="nav">
            <NavLink to="/" end className="nav-item">
              <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Dashboard
            </NavLink>

            <NavLink to="/tasks" className="nav-item">
              <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M8 12.5 l2.5 2.5 L16 9.5" />
              </svg>
              My Tasks
            </NavLink>

            <NavLink to="/calendar" className="nav-item">
              <button type="button" className="nav-item">
                <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="3" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
                Calendar
              </button>
            </NavLink>

            <button type="button" className="nav-item">
              <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M12 2.8v2.6M12 18.6v2.6M4.5 12H2M22 12h-2.5M6.2 6.2 4.4 4.4M19.6 19.6l-1.8-1.8M17.8 6.2l1.8-1.8M4.4 19.6l1.8-1.8" />
              </svg>
              Settings
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="avatar avatar-lg avatar-violet">NW</div>
            <p className="sidebar-name">Nora Watson</p>
            <p className="sidebar-role">Product Lead</p>
          </div>

          <button type="button" className="logout">
            <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
              <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8M18 15l3-3-3-3M21 12H10" />
            </svg>
            Log Out
          </button>
        </aside>

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App