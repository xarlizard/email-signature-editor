import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from 'react-simple-code-editor';
import { TEMPLATES, resolveTemplate } from './templates';
import type { SignatureValues } from './types';
import { DEFAULT_SIGNATURE_VALUES } from './types';
import { highlightTemplateVariables } from './utils/highlight';
import './App.css';

export default function App() {
  const { t, i18n } = useTranslation();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    TEMPLATES[0]?.id ?? 'default'
  );
  const [templateHtml, setTemplateHtml] = useState(
    () => TEMPLATES[0]?.html ?? ''
  );
  const [values, setValues] = useState<SignatureValues>(
    () => ({ ...DEFAULT_SIGNATURE_VALUES, ...TEMPLATES[0]?.defaultValues })
  );
  const [copied, setCopied] = useState(false);
  const [layoutVertical, setLayoutVertical] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const resolvedHtml = resolveTemplate(templateHtml, values);

  const resizePreviewToContent = useCallback(() => {
    const iframe = previewIframeRef.current;
    if (!iframe) return;
    if (!layoutVertical) {
      iframe.style.height = '';
      return;
    }
    if (!iframe.contentDocument?.body) return;
    try {
      const doc = iframe.contentDocument;
      const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      iframe.style.height = `${height}px`;
    } catch {
      // Cross-origin or other access error
    }
  }, [layoutVertical]);

  useEffect(() => {
    if (layoutVertical) {
      const timer = setTimeout(resizePreviewToContent, 50);
      return () => clearTimeout(timer);
    } else {
      resizePreviewToContent();
    }
  }, [layoutVertical, resolvedHtml, resizePreviewToContent]);

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setSelectedTemplateId(templateId);
        setTemplateHtml(template.html);
        // Keep values unchanged - only reset the HTML editor
      }
    },
    []
  );

  const updateValue = useCallback((key: keyof SignatureValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resolvedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = resolvedHtml;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [resolvedHtml]);

  const toggleLayout = useCallback(() => {
    setLayoutVertical((prev) => !prev);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>{t('app.title')}</h1>
            <p className="subtitle">{t('app.subtitle')}</p>
          </div>
          <div className="header-actions">
            <div className="template-selector-inline">
              <label htmlFor="template">{t('labels.template')}</label>
              <select
                id="template"
                className="template-select"
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                {TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
            </div>
            <select
              className="lang-select"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label={t('language')}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <button
              type="button"
              className="layout-btn"
              onClick={toggleLayout}
              title={layoutVertical ? t('actions.layoutHorizontal') : t('actions.layoutVertical')}
              aria-label={layoutVertical ? t('actions.layoutHorizontal') : t('actions.layoutVertical')}
            >
              {layoutVertical ? '↔' : '↕'}
            </button>
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
              aria-label={t('actions.copy')}
            >
              {copied ? `✓ ${t('actions.copied')}` : t('actions.copy')}
            </button>
          </div>
        </div>

        <section className="values-section">
          <h3 className="values-title">{t('labels.values')}</h3>
          <div className="values-grid">
            <div className="value-field">
              <label htmlFor="name">{t('fields.name')}</label>
              <input
                id="name"
                type="text"
                value={values.NAME}
                onChange={(e) => updateValue('NAME', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="position">{t('fields.position')}</label>
              <input
                id="position"
                type="text"
                value={values.POSITION}
                onChange={(e) => updateValue('POSITION', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="company">{t('fields.company')}</label>
              <input
                id="company"
                type="text"
                value={values.COMPANY}
                onChange={(e) => updateValue('COMPANY', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="linkedin">{t('fields.linkedinUrl')}</label>
              <input
                id="linkedin"
                type="url"
                value={values.LINKEDIN_URL}
                onChange={(e) => updateValue('LINKEDIN_URL', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="phone">{t('fields.phone')}</label>
              <input
                id="phone"
                type="tel"
                value={values.PHONE}
                onChange={(e) => updateValue('PHONE', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="email">{t('fields.email')}</label>
              <input
                id="email"
                type="email"
                value={values.EMAIL}
                onChange={(e) => updateValue('EMAIL', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="website">{t('fields.website')}</label>
              <input
                id="website"
                type="url"
                value={values.WEBSITE}
                onChange={(e) => updateValue('WEBSITE', e.target.value)}
              />
            </div>
            <div className="value-field">
              <label htmlFor="image">{t('fields.image')}</label>
              <input
                id="image"
                type="url"
                value={values.IMAGE}
                onChange={(e) => updateValue('IMAGE', e.target.value)}
              />
            </div>
          </div>
        </section>
      </header>

      <main className={`app-main ${layoutVertical ? 'layout-vertical' : 'layout-horizontal'}`}>
        <section className="editor-panel">
          <h2>{t('labels.html')}</h2>
          <div className="editor-wrapper">
            <Editor
              value={templateHtml}
              onValueChange={setTemplateHtml}
              highlight={highlightTemplateVariables}
              padding={12}
              className="html-editor"
              textareaClassName="html-textarea"
              style={{
                fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                fontSize: 13,
                minHeight: 300,
              }}
            />
          </div>
        </section>

        <section className="preview-panel">
          <h2>{t('labels.preview')}</h2>
          <div className="preview-frame-wrapper">
            <iframe
              ref={previewIframeRef}
              title="Signature preview"
              className="preview-iframe"
              onLoad={() => layoutVertical && resizePreviewToContent()}
              srcDoc={
                '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:Arial,sans-serif;}</style></head><body>' +
                resolvedHtml +
                '</body></html>'
              }
              sandbox="allow-same-origin"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
