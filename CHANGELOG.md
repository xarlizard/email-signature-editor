# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.1.0] - 2026-03-29

### Added

- **Simple mode (default)** – Landing experience with a **library** of saved signatures stored in `localStorage`, card previews, timestamps, delete, and **Create new signature** to start the flow
- **Guided creation wizard** – Pick a template, complete fields step by step, then **Review** with **Copy for Gmail**, **Copy HTML**, **Save**, and **Edit from start**
- **Template picker grid** – Visual previews for each built-in template before entering field steps
- **Optional disclaimer** – `{{DISCLAIMER}}` on every built-in template; optional plain-text block below the signature (HTML-escaped, line breaks preserved); the disclaimer section is omitted when the field is empty
- **Disclaimer editing** – Textarea in advanced **Values** and a dedicated step in the simple wizard
- **Simple / Advanced toggle** – Switch modes from the header; preference is persisted locally
- **`Textarea` UI component** – shadcn-style textarea for multi-line fields
- **Expanded i18n** – Catalan, Chinese, Dutch, French, German, Italian, Russian, and more, in addition to English and Spanish

### Changed

- **Template selector** – Shown in the header only in **advanced** mode (hidden in simple mode so templates are chosen inside the wizard)
- **Opening saved signatures** – Values are merged with defaults so older saves without newer fields (e.g. disclaimer) still load correctly

### Documentation

- **README** – Screenshots and short descriptions for the library home, simple-mode review step, and advanced HTML + preview layout (`src/assets/sample-*.png`)

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