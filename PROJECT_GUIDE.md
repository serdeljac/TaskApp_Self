# PROJECT_GUIDE.md

**Read this file before executing any prompt in this project.**
It defines the goal, the rules, and where we currently are.

---

## 1. Goal

Learn **React + Vite + TypeScript** by building a ToDo Task App, one feature at a
time. The point is understanding, not speed. Every step should be small enough
to read end-to-end and explain out loud.

## 2. Tech stack

| Piece      | Choice                            |
| ---------- | --------------------------------- |
| Build tool | Vite 8                            |
| UI library | React 19                          |
| Language   | TypeScript                        |
| Styling    | Plain CSS (`src/App.css`)         |
| Font       | Poppins, self-hosted via npm      |
| Linting    | oxlint (`npm run lint`)           |
| Versioning | Git, one commit per learning step |

The font is the one runtime dependency: `@fontsource/poppins` ships the .woff2
files, Vite bundles them, and nothing is fetched from Google Fonts at runtime.
Only upright Latin weights (400/500/600/700) are imported — no italic, no script
face, no unused language subsets.

No CSS framework, no state library, no router — those get added only when a step
actually needs them, so the reason for each dependency is obvious.

## 3. Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

## 4. Working rules

These are the rules Claude follows on every prompt in this project.

1. **One feature per step.** Each prompt adds exactly one capability. No
   bundling "while I was in there" changes.
2. **Comments are a teaching layer, and they are disposable.**
   - At the start of each step, **delete every comment written in previous
     steps** from the source files.
   - Then write fresh comments describing *what this step introduced and why*.
   - Comments explain React/TypeScript concepts, not obvious syntax.
   - Result: the comments in the codebase always describe the newest step only.
     Older explanations live in section 6 of this file and in the Git history.
3. **Git per step.** Every step ends with one commit. The commit message names
   the step, e.g. `step-02: extract Sidebar and Topbar components`.
4. **Update this file.** Add the step to the build log (section 6) before
   committing.
5. **No dead code.** If a step replaces something, the old version is deleted,
   not commented out. Git already remembers it.

## 5. Design reference

`download.webp` in the project root is the visual reference — a light dashboard
with a rounded white shell, a lime-green accent, pastel stat cards, and a dark
navy promo card.

We copy its **layout and visual language**, but the **content is task-app
content**, not the sales dashboard from the image. Mapping used:

| Reference image        | This app                          |
| ---------------------- | --------------------------------- |
| Niond (sales dash)     | Taskly (task app)                 |
| Total / Average Earning| Tasks Completed / Due This Week   |
| Conversation Rate      | Completion Rate                   |
| Regular Sell (chart)   | Weekly Activity (chart)           |
| Top Store (table)      | Top Projects (table)              |
| Daily Meeting          | Daily Standup                     |

Design tokens live as CSS custom properties at the top of `src/App.css`.

## 6. Build log

### step-01 — flat static page ✅

Replaced the Vite starter with a static markup-only version of the dashboard.

- `src/App.tsx` — the entire page as one component returning literal JSX.
  Everything is hard-coded on purpose: no arrays, no `.map()`, no `useState`,
  no props, no event handlers, no `<a href>`. This is the "HTML in JavaScript"
  stage, so the JSX rules (`className`, self-closing tags, `{}` for values,
  one root element) are visible without any logic in the way.
- `src/App.css` — full stylesheet, design tokens first.
- `src/index.css` — reset and page background.

Deliberately verbose: the seven chart bars, four table rows and six nav items
are each typed out by hand. Collapsing that repetition is a later lesson.

### step-01 fix — typography and chart grid ✅

Two defects found after the first commit.

1. **Font fell back to the browser default.** The stack was declared on `body`
   only, so `<html>` stayed on the browser's standard font and anything not
   inheriting from body — form controls, table internals — went with it. On a
   machine whose default is a script face, that renders as cursive. Fixed by
   declaring the stack on `:root`, forcing `font-family: inherit` on controls
   and table elements, and self-hosting Poppins so nothing depends on which
   fonts are installed locally. The chain now ends in `sans-serif`, never
   `cursive`, so even total load failure degrades to a plain grotesque.
2. **Chart day labels sat in the wrong grid cell.** `.chart` has three children
   and no explicit placement, so auto-placement put the labels in row 2 /
   column 1 — the 30px scale column — instead of under the plot. Fixed with
   explicit `grid-area` on all three.

### Next candidate steps

- `step-02` — split the page into components (`Sidebar`, `Topbar`, `StatCard`…)
  and pass data in with typed props.
- `step-03` — replace hard-coded lists with arrays + `.map()` and `key`.
- `step-04` — first real state: add a task with `useState`.
- `step-05` — toggle complete / delete a task.
- `step-06` — filter tabs (All / Active / Done) derived from state.
- `step-07` — persist to `localStorage` with `useEffect`.
