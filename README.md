# Email Signature Editor

A simple React UI for editing and previewing HTML email signatures, ready for copy-paste into Gmail.

## Features

- **Split layout**: Edit HTML in a textarea on the left, see live preview on the right
- **Copy to clipboard**: One-click copy of your signature for pasting into Gmail
- **Default template**: Pre-loaded with a professional Timbal AI signature template
- **Template library**: Structure ready for adding more templates in the future

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Script           | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start development server        |
| `npm run build`  | Build for production           |
| `npm run preview`| Preview production build       |
| `npm run lint`   | Run ESLint                     |
| `npm run typecheck` | Run TypeScript type check   |

## Usage

1. Edit the HTML in the left panel
2. See the live preview update on the right
3. Click **Copy to clipboard** when ready
4. In Gmail: Settings → See all settings → General → Signature → paste

## Project Structure

```
src/
├── App.tsx           # Main editor UI
├── main.tsx          # Entry point
├── templates/
│   └── default.ts    # Default signature template
└── ...
```

## License

MIT
