import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { TEMPLATES, resolveTemplate } from './templates';
import type { SignatureValues } from './types';
import { DEFAULT_SIGNATURE_VALUES } from './types';
import { AppHeader } from './components/AppHeader';
import { ValuesForm } from './components/ValuesForm';
import { HtmlPanel } from './components/HtmlPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { GitHubFooter } from './components/GitHubFooter';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  const { i18n } = useTranslation();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    TEMPLATES[0]?.id ?? 'default'
  );
  const [templateHtml, setTemplateHtml] = useState(
    () => TEMPLATES[0]?.html ?? ''
  );
  const [values, setValues] = useState<SignatureValues>(
    () => ({ ...DEFAULT_SIGNATURE_VALUES, ...TEMPLATES[0]?.defaultValues })
  );
  const [copiedSection, setCopiedSection] = useState<'html' | 'preview' | null>(null);
  const [layoutVertical, setLayoutVertical] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
      // ignore
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setSelectedTemplateId(templateId);
        setTemplateHtml(template.html);
      }
    },
    []
  );

  const updateValue = useCallback((key: keyof SignatureValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, section: 'html' | 'preview') => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
      }
    },
    []
  );

  const copyPreviewAsRichHtml = useCallback(async () => {
    const iframe = previewIframeRef.current;
    const doc = iframe?.contentDocument;
    if (doc) {
      try {
        iframe.contentWindow?.focus();
        const selection = doc.defaultView?.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const range = doc.createRange();
          range.selectNodeContents(doc.body);
          selection.addRange(range);
          doc.execCommand('copy');
          selection.removeAllRanges();
          setCopiedSection('preview');
          setTimeout(() => setCopiedSection(null), 2000);
          return;
        }
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([resolvedHtml], { type: 'text/html' }),
          'text/plain': new Blob(
            [resolvedHtml.replace(/<[^>]*>/g, '')],
            { type: 'text/plain' }
          ),
        }),
      ]);
      setCopiedSection('preview');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      copyToClipboard(resolvedHtml, 'preview');
    }
  }, [resolvedHtml, copyToClipboard]);

  const toggleLayout = useCallback(() => {
    setLayoutVertical((prev) => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background">
        <AppHeader
          templates={TEMPLATES}
          selectedTemplateId={selectedTemplateId}
          onTemplateChange={handleTemplateChange}
          language={i18n.language || 'en'}
          onLanguageChange={(v) => i18n.changeLanguage(v)}
          darkMode={darkMode}
          onThemeToggle={toggleTheme}
          layoutVertical={layoutVertical}
          onLayoutToggle={toggleLayout}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
          <ValuesForm values={values} onUpdate={updateValue} />

          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {layoutVertical ? (
              <Group orientation="vertical" className="h-full">
                <Panel defaultSize={40} minSize={20} id="preview" className="min-h-0 overflow-hidden">
                  <PreviewPanel
                    resolvedHtml={resolvedHtml}
                    onCopy={copyPreviewAsRichHtml}
                    copied={copiedSection === 'preview'}
                    iframeRef={previewIframeRef}
                    onIframeLoad={() => layoutVertical && resizePreviewToContent()}
                  />
                </Panel>
                <Separator className="resize-handle-vertical" />
                <Panel defaultSize={60} minSize={30} id="html" className="min-h-0 overflow-hidden">
                  <HtmlPanel
                    value={templateHtml}
                    onChange={setTemplateHtml}
                    onCopy={() => copyToClipboard(resolvedHtml, 'html')}
                    copied={copiedSection === 'html'}
                  />
                </Panel>
              </Group>
            ) : (
              <Group orientation="horizontal" className="h-full">
                <Panel defaultSize={50} minSize={25} id="html" className="min-h-0 overflow-hidden">
                  <HtmlPanel
                    value={templateHtml}
                    onChange={setTemplateHtml}
                    onCopy={() => copyToClipboard(resolvedHtml, 'html')}
                    copied={copiedSection === 'html'}
                  />
                </Panel>
                <Separator className="resize-handle-horizontal" />
                <Panel defaultSize={50} minSize={25} id="preview" className="min-h-0 overflow-hidden">
                  <PreviewPanel
                    resolvedHtml={resolvedHtml}
                    onCopy={copyPreviewAsRichHtml}
                    copied={copiedSection === 'preview'}
                    iframeRef={previewIframeRef}
                    onIframeLoad={() => layoutVertical && resizePreviewToContent()}
                  />
                </Panel>
              </Group>
            )}
          </div>
        </div>
        <GitHubFooter />
      </div>
    </TooltipProvider>
  );
}
