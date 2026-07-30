//Use 'useRef' to change values WITHOUT the UI
//Use 'useState' to change values that effect the DOM
//Use 'useEffect' to do something during the change of the value
import { useRef, useState, useEffect  } from 'react'
//This is a Type, not a function in the react module
import type { SubmitEvent } from 'react'

//If commonly used functions, place into a seperate folder
import { loadTasks, parseDueDate, saveTasks, toDateKey } from '../lib/tasks.ts'

//The return types should be in the same folder unless for specific reasons
import type { Priority, Task } from '../lib/tasks.ts'

// Sort order for priority, and the display text for each.
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
const PRIORITY_LABEL: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' }



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

    //Used during mutation that will store the new task from the form into the Local Storage
    //Function now in lib
    useEffect(() => {
      saveTasks(tasks)
    }, [tasks])

    function openDialog() {
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

    function deleteTask(id: string) {
        setTasks((current) => current.filter((task) => task.id !== id))
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
