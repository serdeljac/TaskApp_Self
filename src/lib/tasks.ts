//This is the name of the local storage
const STORAGE_KEY = 'taskly.tasks'

//TYPESCRIPT: Assigned types
export type Priority = 'high' | 'medium' | 'low'
export type Task = {
  id: string
  name: string
  group: string
  priority: Priority
  due: string
  complete: boolean
}

// Sort order for priority, and the display text for each.
export const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
export const PRIORITY_LABEL: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' }

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
export function loadTasks(): Task[] {
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

export function parseDueDate(due: string): Date {
  const [year, month, day] = due.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage blocked or full. The list still works for this session.
  }
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
