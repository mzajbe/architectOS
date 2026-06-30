# Architectos

Architectos is a lightweight canvas workspace for sketching node-based ideas, systems, and architectural relationships. It provides a focused MVP for creating, moving, selecting, deleting, panning, zooming, and persisting nodes directly in the browser.

## Features

- Full-screen canvas workspace with a subtle grid
- Select, Add Node, and Pan tools
- Click-to-create nodes
- Drag-to-move nodes
- Node selection and deletion
- Smooth zooming at the cursor position
- Keyboard shortcuts for fast tool switching
- Local persistence with `localStorage`
- Clear Canvas action with confirmation
- Empty-canvas welcome message

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand for client state
- Radix Icons for toolbar icons
- HTML Canvas 2D rendering
- Browser `localStorage` persistence

## Installation

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## How To Use

Use the toolbar at the top of the screen to switch tools:

- **Select**: select and drag nodes
- **Add Node**: click the canvas to create a node
- **Pan**: drag the canvas to move around
- **Clear Canvas**: remove all nodes and edges after confirmation

Keyboard shortcuts:

| Shortcut | Action |
| --- | --- |
| `V` or `1` | Select tool |
| `N` or `2` | Add Node tool |
| `H` or `3` | Pan tool |
| `Delete` or `Backspace` | Delete selected node |
| `Escape` | Deselect node and switch to Select |

Canvas gestures:

- Drag a selected node to move it
- Drag while Pan is active to move the camera
- Scroll to zoom in or out at the cursor position

Your canvas is saved automatically in the browser and restored after refresh.

## Screenshots

Placeholder:

```text
Add screenshots here once the first visual pass is finalized.
```

## Project Structure

```text
src/
  app/
  components/
    Canvas/
    Toolbar/
    UI/
  hooks/
  lib/
    canvas/
    store/
    storage.ts
public/
  icons/
```

## Future Improvements

- Edge creation (connect nodes)
- Node resizing
- Multiple node types
- Undo/Redo
- Export to PNG/SVG
- Real-time collaboration
- Web Workers for heavy computations
