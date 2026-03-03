# Email Signature Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/xarlizard/email-signature-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/xarlizard/email-signature-editor/actions/workflows/ci.yml)
[![Production Deployment](https://github.com/xarlizard/email-signature-editor/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/xarlizard/email-signature-editor/actions/workflows/deploy.yml)

A simple HTML email signature editor with live preview. Edit templates, fill in your details, and copy into Gmail.

**[→ Live demo](https://email-signature-editor.pages.dev/)**

---

## Features

- **Live HTML editor** – Edit HTML with variable highlighting (`{{NAME}}`, `{{EMAIL}}`, etc.)
- **Template variables** – Name, position, company, LinkedIn, phone, email, website, image
- **Copy to clipboard** – One-click copy of your signature for pasting into Gmail
- **Layout toggle** – Switch between horizontal (side-by-side) and vertical (stacked) panels
- **i18n** – English and Spanish
- **Modern UI** – Built with React, Tailwind CSS, and shadcn/ui

## Quick Start

**[Try it online](https://email-signature-editor.pages.dev/)** or run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Fill in your details in the Values section (name, position, company, etc.)
2. Edit the HTML in the left panel if needed
3. See the live preview update on the right
4. Click **Copy to clipboard** when ready
5. In Gmail: Settings → See all settings → General → Signature → paste

## Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start development server       |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |
| `npm run typecheck` | Run TypeScript type check   |

## Project Structure

```
src/
├── App.tsx           # Main editor UI
├── main.tsx          # Entry point
├── components/ui/    # shadcn components
├── templates/
│   └── default.ts   # Default signature template
└── ...
```

## Development

- Clone the repo: `git clone https://github.com/xarlizard/email-signature-editor.git`
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`

## Contributing

Contributions are welcome! Please open [issues](https://github.com/xarlizard/email-signature-editor/issues) or submit [pull requests](https://github.com/xarlizard/email-signature-editor/pulls).

## License

MIT © [xarlizard](https://github.com/xarlizard)
