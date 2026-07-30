//Use 'useRef' to change values WITHOUT the UI
//Use 'useState' to change values that effect the DOM
//Use 'useEffect' to do something during the change of the value
import { useRef, useState, useEffect  } from 'react'
//This is a Type, not a function in the react module
import type { SubmitEvent } from 'react'

//This is the name of the local storage
const STORAGE_KEY = 'taskly.tasks'

//TYPESCRIPT: Assigned types
type Priority = 'high' | 'medium' | 'low'
type Task = {
  id: string
  name: string
  group: string
  priority: Priority
  due: string
  complete: boolean
}

// Sort order for priority, and the display text for each.
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
const PRIORITY_LABEL: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' }

//This is a guard function to check the quality of information that is in local storage
//It will be dismissed if the object doesn't meet the specifications
function toTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null
  const candidate = value as Record<string, unknown>

  if (typeof candidate.id !== 'string') return null
  if (typeof candidate.name !== 'string') return null
  if (typeof candidate.group !== 'string') return null
  if (typeof candidate.due !== 'string') return null
  if (
    candidate.priority !== 'high' &&
    candidate.priority !== 'medium' &&
    candidate.priority !== 'low'
  ) {
    return null
  }

  return {
    id: candidate.id,
    name: candidate.name,
    group: candidate.group,
    priority: candidate.priority,
    due: candidate.due,
    complete: candidate.complete === true,
  }
}

//Use Promise to load and check each task in Local Storage, then append
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(toTask).filter((task) => task !== null)
  } catch {
    return []
  }
}

function parseDueDate(due: string): Date {
  const [year, month, day] = due.split('-').map(Number)
  return new Date(year, month - 1, day)
}


function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function groupTitle(due: string): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (due === toDateKey(today)) return 'Today'
  if (due === toDateKey(tomorrow)) return 'Tomorrow'
  return parseDueDate(due).toLocaleDateString(undefined, { weekday: 'long' })
}

function groupDate(due: string): string {
  return parseDueDate(due).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function groupByDate(tasks: Task[]) {
  const byDate = new Map<string, Task[]>()

  for (const task of tasks) {
    const existing = byDate.get(task.due)
    if (existing) existing.push(task)
    else byDate.set(task.due, [task])
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([due, list]) => ({
      due,
      tasks: [...list].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]),
    }))
}




function MyTasks() {

    //This is the dialog box that will open and close
    const dialogRef = useRef<HTMLDialogElement>(null)
    //This is the actual form data within the dialog box
    const formRef = useRef<HTMLFormElement>(null)
    //Update the DOM if any changes are made
    const [tasks, setTasks] = useState(loadTasks)


    useEffect(() => {
        try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
        } catch {
        // Storage blocked or full. The list still works for this session.
        }
    }, [tasks])

    function openDialog() {
        console.log(formRef.current, dialogRef.current)
        //If the form has data, clear it
        formRef.current?.reset()
        //Use 'showModal' to prevent interaction behind the dialog
        dialogRef.current?.showModal()
    }

    function closeDialog() {
        //If the form has data, clear it
        formRef.current?.reset()
        //Close the dialog
        dialogRef.current?.close()
    }

      function toggleComplete(id: string) {
        setTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, complete: !task.complete } : task)),
        )
    }

    function clearStorage () {
        localStorage.clear();
        setTasks(() => []) 
    }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    //Create a proper construct for the form
    const data = new FormData(form)
    const rawPriority = String(data.get('priority') ?? '')
    const priority: Priority =
      rawPriority === 'medium' || rawPriority === 'low' ? rawPriority : 'high'

    // This is the format of the new task
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: String(data.get('name') ?? '').trim(),
      group: String(data.get('group') ?? '').trim(),
      priority,
      due: String(data.get('due') ?? ''),
      complete: false
    }

    //Add the new task to the DOM
    setTasks((current) => [...current, newTask])
    form.reset()
    dialogRef.current?.close()
  }

  const groups = groupByDate(tasks)
  const doneCount = tasks.filter((task) => task.complete).length
  
  return (
    <>
      <header className="topbar">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-date">
            {tasks.length === 0 ? 'No tasks yet' : `${doneCount} of ${tasks.length} complete`}
          </p>
        </div>

        <button type="button" className="pill pill-lime" onClick={openDialog}>
          + Add Task
        </button>
      </header>

      <div className="tasks">
        {groups.length === 0 ? (
          <section className="card empty">
            <p className="empty-title">Nothing scheduled</p>
            <p className="empty-note">
              Tasks you add are grouped by due date and ordered by priority. They stay in this
              browser.
            </p>
          </section>
        ) : (
          groups.map((group) => (
            <section className="card task-group" key={group.due}>
              <div className="group-head">
                <h2 className="card-title">{groupTitle(group.due)}</h2>
                <span className="group-date">{groupDate(group.due)}</span>
              </div>

              {group.tasks.map((task) => (
                <div
                  className={task.complete ? 'task-row task-row-complete' : 'task-row'}
                  key={task.id}
                >
                  {/*
                    aria-label carries the task name, so a screen reader announces
                    "Ship the tokens, checkbox, checked" rather than an unnamed box.
                  */}
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
                </div>
              ))}
            </section>
          ))
        )}
      </div>

      <dialog ref={dialogRef} className="modal" aria-labelledby="add-task-title">
        <form ref={formRef} className="modal-form" onSubmit={handleSubmit}>
          <h2 className="modal-title" id="add-task-title">Add Task</h2>

          <label className="field">
            <span className="field-label">Name</span>
            <input className="input" type="text" name="name" placeholder="What needs doing?" required />
          </label>

          <label className="field">
            <span className="field-label">Group</span>
            <input className="input" type="text" name="group" placeholder="Which project?" />
          </label>

          <fieldset className="field">
            <legend className="field-label">Priority</legend>
            <div className="radio-row">
              <label className="radio">
                <input type="radio" name="priority" value="high" defaultChecked />
                High
              </label>
              <label className="radio">
                <input type="radio" name="priority" value="medium" />
                Medium
              </label>
              <label className="radio">
                <input type="radio" name="priority" value="low" />
                Low
              </label>
            </div>
          </fieldset>

          <label className="field">
            <span className="field-label">Due Date</span>
            <input className="input" type="date" name="due" required />
          </label>

          <div className="modal-actions">
            <button type="button" className="button-ghost" onClick={closeDialog}>
              Cancel
            </button>
            <button type="submit" className="pill pill-lime">
              Submit
            </button>
          </div>
        </form>
      </dialog>


      <button type="button" className="clearBtn pill pill-lime" onClick={clearStorage}>Clear All</button>

    </>
  )
}

export default MyTasks
