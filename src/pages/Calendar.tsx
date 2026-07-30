import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { PRIORITY_LABEL, PRIORITY_RANK, loadTasks, parseDueDate, saveTasks, toDateKey } from '../lib/tasks.ts'
import type { Task } from '../lib/tasks.ts'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_DOTS = 3

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

type GridCell = {
  date: Date
  inCurrentMonth: boolean
}

function buildMonthGrid(viewDate: Date): GridCell[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  const cells: GridCell[] = []
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - firstWeekday + 1
    cells.push({
      date: new Date(year, month, dayOffset),
      inCurrentMonth: dayOffset >= 1 && dayOffset <= daysInMonth,
    })
  }
  return cells
}

function groupTasksByDate(tasks: Task[]): Map<string, Task[]> {
  const byDate = new Map<string, Task[]>()
  for (const task of tasks) {
    const existing = byDate.get(task.due)
    if (existing) existing.push(task)
    else byDate.set(task.due, [task])
  }
  for (const list of byDate.values()) {
    list.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
  }
  return byDate
}

function Calendar() {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => startOfDay(new Date()))
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const today = new Date()
  const todayKey = toDateKey(today)
  const selectedKey = selectedDate ? toDateKey(selectedDate) : null
  const tasksByDate = groupTasksByDate(tasks)
  const selectedTasks = selectedKey ? (tasksByDate.get(selectedKey) ?? []) : []

  function goToMonth(delta: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  function goToday() {
    const now = new Date()
    setViewDate(startOfMonth(now))
    setSelectedDate(startOfDay(now))
  }

  function selectDay(date: Date) {
    setSelectedDate(date)
  }

  function handleDatePicked(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (!value) {
      setSelectedDate(null)
      return
    }
    const picked = parseDueDate(value)
    setSelectedDate(picked)
    setViewDate(startOfMonth(picked))
  }

  function toggleComplete(id: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, complete: !task.complete } : task)),
    )
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  const monthLabel = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const todayLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const cells = buildMonthGrid(viewDate)

  return (
    <>
      <header className="topbar">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-date">{todayLabel}</p>
        </div>
      </header>

      <section className="card calendar-card">
        <div className="card-head">
          <div className="calendar-nav">
            <button type="button" className="icon-button" onClick={() => goToMonth(-1)} aria-label="Previous month">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2 className="card-title calendar-title">{monthLabel}</h2>
            <button type="button" className="icon-button" onClick={() => goToMonth(1)} aria-label="Next month">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="calendar-controls">
            <input
              type="date"
              className="calendar-date-input"
              value={selectedKey ?? ''}
              onChange={handleDatePicked}
              aria-label="Jump to date"
            />
            <button type="button" className="pill pill-lime" onClick={goToday}>
              Today
            </button>
          </div>
        </div>

        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((cell) => {
            const key = toDateKey(cell.date)
            if (!cell.inCurrentMonth) {
              return <span className="calendar-day empty" key={key} />
            }

            const classes = ['calendar-day']
            if (key === todayKey) classes.push('calendar-day-today')
            if (key === selectedKey) classes.push('calendar-day-selected')

            const dayTasks = tasksByDate.get(key) ?? []
            const shownTasks = dayTasks.slice(0, MAX_DOTS)
            const hiddenCount = dayTasks.length - shownTasks.length

            const dateLabel = cell.date.toLocaleDateString(undefined, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            const taskSuffix =
              dayTasks.length > 0 ? `, ${dayTasks.length} task${dayTasks.length === 1 ? '' : 's'}` : ''

            return (
              <button
                type="button"
                className={classes.join(' ')}
                key={key}
                onClick={() => selectDay(cell.date)}
                aria-pressed={key === selectedKey}
                aria-label={`${dateLabel}${taskSuffix}`}
              >
                <span className="calendar-day-number">{cell.date.getDate()}</span>
                <span className="calendar-day-dots" aria-hidden="true">
                  {shownTasks.map((task) => (
                    <span className={`calendar-day-dot calendar-day-dot-${task.priority}`} key={task.id} />
                  ))}
                  {hiddenCount > 0 && <span className="calendar-day-more">+{hiddenCount}</span>}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="card task-group selected-day-panel">
        <div className="group-head">
          <h2 className="card-title">{selectedLabel ?? 'No day selected'}</h2>
          {selectedDate && (
            <span className="group-date">
              {selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {!selectedDate ? (
          <p className="empty-note">Click a day on the calendar to see its tasks here.</p>
        ) : selectedTasks.length === 0 ? (
          <p className="empty-note">No tasks due this day.</p>
        ) : (
          selectedTasks.map((task) => (
            <div className={task.complete ? 'task-row task-row-complete' : 'task-row'} key={task.id}>
              <input
                type="checkbox"
                className="task-check"
                checked={task.complete}
                onChange={() => toggleComplete(task.id)}
                aria-label={task.name}
              />
              <div className="task-text">
                <p className="task-name">{task.name}</p>
                {task.group && <p className="task-meta">{task.group}</p>}
              </div>
              <span className={`prio prio-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
              <button
                type="button"
                className="task-delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.name}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M10 4h4M6.5 7l.9 12.4h9.2L17.5 7M10 11v5.5M14 11v5.5" />
                </svg>
              </button>
            </div>
          ))
        )}
      </section>
    </>
  )
}

export default Calendar
