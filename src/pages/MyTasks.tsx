/*
 * STEP 02 — the new page at /tasks.
 *
 * A header and two date groups, each listing its tasks High → Medium → Low.
 * That is the whole page.
 *
 * Nothing here computes anything. The grouping and the ordering are typed out
 * by hand; they become real once tasks live in state and get sorted. The round
 * markers are <span>s rather than checkboxes, because a checkbox that cannot be
 * ticked is worse than an obvious placeholder.
 */

function MyTasks() {
  return (
    <>
      <header className="topbar testHeader">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-date">Thursday, 30th Jul 2026</p>
        </div>
      </header>

      <div className="tasks">
        <section className="card task-group">
          <div className="group-head">
            <h2 className="card-title">Today</h2>
            <span className="group-date">30 Jul 2026</span>
          </div>

          <div className="task-row">
            <span className="task-check" />
            <div className="task-text">
              <p className="task-name">Ship dashboard spacing tokens</p>
              <p className="task-meta">Website Redesign</p>
            </div>
            <span className="prio prio-high">High</span>
          </div>

          <div className="task-row">
            <span className="task-check" />
            <div className="task-text">
              <p className="task-name">Reply to Daniel about the API shape</p>
              <p className="task-meta">Mobile App v2</p>
            </div>
            <span className="prio prio-medium">Medium</span>
          </div>

          <div className="task-row">
            <span className="task-check" />
            <div className="task-text">
              <p className="task-name">Archive Q2 retro notes</p>
              <p className="task-meta">Growth</p>
            </div>
            <span className="prio prio-low">Low</span>
          </div>
        </section>

        <section className="card task-group">
          <div className="group-head">
            <h2 className="card-title">Tomorrow</h2>
            <span className="group-date">31 Jul 2026</span>
          </div>

          <div className="task-row">
            <span className="task-check" />
            <div className="task-text">
              <p className="task-name">Finalise the Q3 campaign brief</p>
              <p className="task-meta">Q3 Campaign</p>
            </div>
            <span className="prio prio-high">High</span>
          </div>

          <div className="task-row">
            <span className="task-check" />
            <div className="task-text">
              <p className="task-name">Tidy the Figma component library</p>
              <p className="task-meta">Design</p>
            </div>
            <span className="prio prio-low">Low</span>
          </div>
        </section>
      </div>
    </>
  )
}

export default MyTasks
