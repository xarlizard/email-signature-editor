# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-02

### Added

- **React email signature editor** – Vite + React + TypeScript web app for editing HTML email signatures
- **Split layout** – HTML editor on one side, live preview on the other
- **Copy to clipboard** – One-click copy of resolved signature for pasting into Gmail
- **Template variables** – Editable placeholders: `{{NAME}}`, `{{POSITION}}`, `{{COMPANY}}`, `{{LINKEDIN_URL}}`, `{{PHONE}}`, `{{EMAIL}}`, `{{WEBSITE}}`, `{{IMAGE}}`
- **Variable highlighting** – `{{VARIABLE}}` placeholders highlighted in the HTML editor (uses `react-simple-code-editor`)
- **Values form** – Form to edit all template variables; copy exports resolved HTML with values applied
- **Template selector** – Select template dropdown (resets HTML editor, keeps values when re-selecting)
- **Layout toggle** – Switch between horizontal (side-by-side) and vertical (stacked) panel alignment
- **Vertical layout** – Preview on top, editor below; preview height sizes to content (no empty space)
- **i18n** – English and Spanish with `react-i18next`; language selector in header
- **Tailwind CSS v4** – Modern styling with `@tailwindcss/vite`
- **shadcn/ui** – Button, Card, Input, Label, Select components; New York style, neutral theme
- **Lucide React** – Icons for layout toggle and copy button
- **Production deployment** – Live demo at [https://email-signature-editor.pages.dev/](https://email-signature-editor.pages.dev/)