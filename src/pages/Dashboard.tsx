import { loadTasks, toDateKey } from '../lib/tasks.ts'

function Dashboard() {
  //contains all the tasks from storage
  const tasks = loadTasks()

  const doneCount = tasks.filter((task) => task.complete).length
  const totalCount = tasks.length

  const today = new Date()
  const weekEnd = new Date(today)
  weekEnd.setDate(today.getDate() + 6)
  const todayKey = toDateKey(today)
  const weekEndKey = toDateKey(weekEnd)
  const dueThisWeekCount = tasks.filter(
    (task) => !task.complete && task.due >= todayKey && task.due <= weekEndKey,
  ).length

  const completionRateText =
    totalCount === 0 ? '0%' : `${((doneCount / totalCount) * 100).toFixed(2)}%`
  const completionNote = totalCount === 0 ? 'No tasks yet' : `${doneCount} of ${totalCount} tasks done`

  return (
    <>
      <header className="topbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-date">30th Jul 2026</p>
        </div>

        <div className="topbar-actions">
          <button type="button" className="icon-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
            </svg>
          </button>
          <button type="button" className="icon-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 15v-4a6 6 0 1 0-12 0v4l-1.6 2.4h15.2z" />
              <path d="M10 20h4" />
            </svg>
          </button>
          <div className="topbar-user">
            <div className="avatar avatar-violet">NW</div>
            <div>
              <p className="topbar-name">Nora Watson</p>
              <p className="topbar-role">Product Lead</p>
            </div>
          </div>
        </div>
      </header>

      <div className="layout">
        <div className="column">
          <section className="stats">
            <article className="stat stat-violet">
              <p className="stat-label">
                <span className="stat-dot" />
                Tasks Completed
              </p>
              <p className="stat-value">{doneCount}</p>
              <p className="stat-note">Across all projects</p>
            </article>

            <article className="stat stat-sky">
              <p className="stat-label">
                <span className="stat-dot" />
                Due This Week
              </p>
              <p className="stat-value">{dueThisWeekCount}</p>
              <p className="stat-note">Assigned to you</p>
            </article>

            <article className="stat stat-mint">
              <p className="stat-label">
                <span className="stat-dot" />
                Completion Rate
              </p>
              <p className="stat-value">{completionRateText}</p>
              <p className="stat-note">{completionNote}</p>
            </article>
          </section>

          <div className="split">
            <section className="card chart-card">
              <div className="card-head">
                <h2 className="card-title">Weekly Activity</h2>
                <button type="button" className="pill pill-lime">Export</button>
              </div>

              <div className="chart">
                <div className="chart-scale">
                  <span>50</span>
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                </div>

                <div className="chart-plot">
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '44%' }} />
                    <div className="bar bar-green" style={{ height: '30%' }} />
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '62%' }} />
                    <div className="bar bar-green" style={{ height: '41%' }} />
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '78%' }} />
                    <div className="bar bar-green" style={{ height: '96%' }} />
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '52%' }} />
                    <div className="bar bar-green" style={{ height: '34%' }} />
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '67%' }} />
                    <div className="bar bar-green" style={{ height: '46%' }} />
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '39%' }} />
                    <div className="bar bar-green" style={{ height: '58%' }} />
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-violet" style={{ height: '71%' }} />
                    <div className="bar bar-green" style={{ height: '50%' }} />
                  </div>
                </div>

                <div className="chart-days">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
            </section>

            <section className="analysis">
              <h2 className="card-title">More Analysis</h2>
              <p className="card-sub">There are more to view</p>

              <button type="button" className="row-link">
                <span className="row-icon row-icon-violet">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 20V11M12 20V5M19 20v-6" strokeLinecap="round" strokeWidth="2.6" />
                  </svg>
                </span>
                Task Completion Ratio
                <span className="row-chevron">›</span>
              </button>

              <button type="button" className="row-link">
                <span className="row-icon row-icon-navy">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />
                  </svg>
                </span>
                Most Active Project
                <span className="row-chevron">›</span>
              </button>

              <p className="analysis-foot">
                Analysis created by <span className="foot-badge">T</span>
              </p>
            </section>
          </div>

          <section className="card table-card">
            <div className="card-head">
              <h2 className="card-title">Top Projects</h2>
              <button type="button" className="pill pill-lime">Share</button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Team</th>
                  <th>Tasks</th>
                  <th className="align-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cell-strong">Website Redesign</td>
                  <td>Design</td>
                  <td>102 Tasks</td>
                  <td className="align-right">82%</td>
                </tr>
                <tr>
                  <td className="cell-strong">Mobile App v2</td>
                  <td>Engineering</td>
                  <td>214 Tasks</td>
                  <td className="align-right">64%</td>
                </tr>
                <tr>
                  <td className="cell-strong">Q3 Campaign</td>
                  <td>Growth</td>
                  <td>143 Tasks</td>
                  <td className="align-right">47%</td>
                </tr>
                <tr>
                  <td className="cell-strong">Onboarding Flow</td>
                  <td>Product</td>
                  <td>185 Tasks</td>
                  <td className="align-right">91%</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="column column-side">
          <section className="promo">
            <h2 className="promo-title">Upgrade to Pro</h2>
            <p className="promo-price">
              $4.20 <span>/ Month</span>
            </p>
            <p className="promo-note">$50 Billed Annually</p>
            <button type="button" className="promo-button">Upgrade Now</button>
          </section>

          <section className="card side-card">
            <div className="standup-head">
              <span className="standup-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="6" width="12" height="12" rx="3" />
                  <path d="M15 11l6-3.5v9L15 13z" />
                </svg>
              </span>
              <div>
                <h2 className="card-title">Daily Standup</h2>
                <p className="card-sub">Mon–Fri · 9:30 AM</p>
              </div>
            </div>

            <div className="standup-body">
              <div className="avatar-stack">
                <div className="avatar avatar-sm avatar-violet">MA</div>
                <div className="avatar avatar-sm avatar-mint">DK</div>
                <div className="avatar avatar-sm avatar-sky">EW</div>
              </div>
              <p className="standup-text">They will conduct the meeting</p>
            </div>

            <button type="button" className="dark-button">Click for meeting link</button>
          </section>

          <section className="card side-card">
            <h2 className="card-title">Team Member</h2>

            <div className="member">
              <div className="avatar avatar-sm avatar-violet">MA</div>
              <div className="member-text">
                <p className="member-name">Mahdi Ahmed</p>
                <p className="member-role">Project Manager</p>
              </div>
              <span className="row-chevron">›</span>
            </div>

            <div className="member">
              <div className="avatar avatar-sm avatar-sky">DK</div>
              <div className="member-text">
                <p className="member-name">Daniel Karl</p>
                <p className="member-role">Developer</p>
              </div>
              <span className="row-chevron">›</span>
            </div>

            <div className="member">
              <div className="avatar avatar-sm avatar-mint">EW</div>
              <div className="member-text">
                <p className="member-name">Elena Watson</p>
                <p className="member-role">Designer</p>
              </div>
              <span className="row-chevron">›</span>
            </div>

            <div className="member">
              <div className="avatar avatar-sm avatar-amber">SM</div>
              <div className="member-text">
                <p className="member-name">Salma Mitzo</p>
                <p className="member-role">Coordinator</p>
              </div>
              <span className="row-chevron">›</span>
            </div>

            <button type="button" className="add-member">+ Add more member</button>
          </section>
        </div>
      </div>
    </>
  )
}

export default Dashboard
