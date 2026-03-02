/**
 * Highlights {{VARIABLE}} placeholders in template HTML.
 * Returns an HTML string for use in react-simple-code-editor.
 */
export function highlightTemplateVariables(code: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return escaped.replace(
    /\{\{(\w+)\}\}/g,
    '<span class="variable-token">$&</span>'
  );
}
