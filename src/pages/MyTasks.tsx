
//Use 'useRef' to change values WITHOUT the UI
import { useRef } from 'react'

//This is a Type, not a function in the react module
import type { SubmitEvent } from 'react'

function MyTasks() {

    //This is the dialog box that will open and close
    const dialogRef = useRef<HTMLDialogElement>(null)
    //This is the actual form data within the dialog box
    const formRef = useRef<HTMLFormElement>(null)

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

  //Does nothing for now
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <>
      <header className="topbar testHeader">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-date">Thursday, 30th Jul 2026</p>
        </div>

        <button type="button" className="pill pill-lime" onClick={openDialog}>
          + Add Task
        </button>
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


      <dialog ref={dialogRef} className="modal" aria-labelledby="add-task-title">
        <form ref={formRef} className="modal-form" onSubmit={handleSubmit}>
          <h2 className="modal-title" id="add-task-title">Add Task</h2>

          <label className="field">
            <span className="field-label">Name</span>
            <input className="input" type="text" name="name" placeholder="What needs doing?" />
          </label>

          <label className="field">
            <span className="field-label">Group</span>
            <input className="input" type="text" name="group" placeholder="Which project?" />
          </label>

          {/*
            Radios are grouped by sharing one `name`, which is what makes the
            browser allow only one at a time. <fieldset> and <legend> tie the
            label "Priority" to all three for assistive tech — a plain <p> would
            leave them unlabelled. `defaultChecked` rather than `checked`: this
            input is uncontrolled, so React sets the initial value and then lets
            the DOM own it.
          */}
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
            <input className="input" type="date" name="due" />
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
    </>
  )
}

export default MyTasks
