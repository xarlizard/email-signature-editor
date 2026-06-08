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
import { SimpleModeLibrary } from './components/SimpleModeLibrary';
import { SimpleModeWizard, SIMPLE_REVIEW_STEP } from './components/SimpleModeWizard';
import {
  deleteSavedSignature,
  loadSavedSignatures,
  upsertSavedSignature,
  type SavedSignature,
} from './lib/savedSignatures';
import { TooltipProvider } from '@/components/ui/tooltip';

const MODE_STORAGE_KEY = 'email-signature-editor-mode';

function readInitialAdvancedMode(): boolean {
  if (typeof window === 'undefined') return false;
  const v = localStorage.getItem(MODE_STORAGE_KEY);
  if (v === 'advanced') return true;
  if (v === 'simple') return false;
  return false;
}

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
  const [advancedMode, setAdvancedMode] = useState(readInitialAdvancedMode);
  const [simpleFlow, setSimpleFlow] = useState<'library' | 'wizard'>('library');
  const [wizardInitialStep, setWizardInitialStep] = useState(0);
  const [wizardSessionKey, setWizardSessionKey] = useState(0);
  const [editingSavedId, setEditingSavedId] = useState<string | null>(null);
  const [savedLibrary, setSavedLibrary] = useState<SavedSignature[]>(() =>
    typeof window !== 'undefined' ? loadSavedSignatures() : []
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const simpleModeIframeRef = useRef<HTMLIFrameElement>(null);

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
    if (!advancedMode) return;
    if (layoutVertical) {
      const timer = setTimeout(resizePreviewToContent, 50);
      return () => clearTimeout(timer);
    } else {
      resizePreviewToContent();
    }
  }, [layoutVertical, resolvedHtml, resizePreviewToContent, advancedMode]);

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

  /** Simple-mode template step: apply template HTML and reset field defaults. */
  const applyTemplateWithDefaults = useCallback((templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setSelectedTemplateId(template.id);
    setTemplateHtml(template.html);
    setValues({ ...DEFAULT_SIGNATURE_VALUES, ...template.defaultValues });
  }, []);

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
    const iframe = advancedMode
      ? previewIframeRef.current
      : simpleModeIframeRef.current;
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
  }, [resolvedHtml, copyToClipboard, advancedMode]);

  const toggleLayout = useCallback(() => {
    setLayoutVertical((prev) => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const toggleAdvancedMode = useCallback(() => {
    setAdvancedMode((prev) => {
      const next = !prev;
      localStorage.setItem(MODE_STORAGE_KEY, next ? 'advanced' : 'simple');
      if (!next) {
        setSimpleFlow('library');
      }
      return next;
    });
  }, []);

  const refreshSavedLibrary = useCallback(() => {
    setSavedLibrary(loadSavedSignatures());
  }, []);

  useEffect(() => {
    if (!advancedMode && simpleFlow === 'library') {
      refreshSavedLibrary();
    }
  }, [advancedMode, simpleFlow, refreshSavedLibrary]);

  const handleSimpleCreateNew = useCallback(() => {
    const t =
      TEMPLATES.find((tmpl) => tmpl.id === selectedTemplateId) ?? TEMPLATES[0];
    if (t) {
      setSelectedTemplateId(t.id);
      setTemplateHtml(t.html);
      setValues({ ...DEFAULT_SIGNATURE_VALUES, ...t.defaultValues });
    }
    setEditingSavedId(null);
    setWizardInitialStep(0);
    setWizardSessionKey((k) => k + 1);
    setSimpleFlow('wizard');
  }, [selectedTemplateId]);

  const handleSimpleOpenSaved = useCallback((id: string) => {
    const saved = loadSavedSignatures().find((s) => s.id === id);
    if (!saved) return;
    const template =
      TEMPLATES.find((tmpl) => tmpl.id === saved.templateId) ?? TEMPLATES[0];
    if (!template) return;
    setSelectedTemplateId(template.id);
    setTemplateHtml(template.html);
    setValues({ ...DEFAULT_SIGNATURE_VALUES, ...saved.values });
    setEditingSavedId(saved.id);
    setWizardInitialStep(SIMPLE_REVIEW_STEP);
    setWizardSessionKey((k) => k + 1);
    setSimpleFlow('wizard');
  }, []);

  const handleSimpleBackToLibrary = useCallback(() => {
    setSimpleFlow('library');
    refreshSavedLibrary();
  }, [refreshSavedLibrary]);

  const handleSimpleSave = useCallback(() => {
    const sig = upsertSavedSignature({
      id: editingSavedId ?? undefined,
      templateId: selectedTemplateId,
      values,
    });
    setEditingSavedId(sig.id);
    setSaveSuccess(true);
    refreshSavedLibrary();
    setTimeout(() => setSaveSuccess(false), 2000);
  }, [editingSavedId, selectedTemplateId, values, refreshSavedLibrary]);

  const handleDeleteSaved = useCallback(
    (id: string) => {
      deleteSavedSignature(id);
      refreshSavedLibrary();
      if (editingSavedId === id) {
        setEditingSavedId(null);
      }
    },
    [editingSavedId, refreshSavedLibrary]
  );

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
          advancedMode={advancedMode}
          onAdvancedModeToggle={toggleAdvancedMode}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
          {advancedMode ? (
            <>
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
            </>
          ) : simpleFlow === 'library' ? (
            <SimpleModeLibrary
              items={savedLibrary}
              onCreateNew={handleSimpleCreateNew}
              onOpenSaved={handleSimpleOpenSaved}
              onDeleteSaved={handleDeleteSaved}
            />
          ) : (
            <SimpleModeWizard
              key={wizardSessionKey}
              initialStep={wizardInitialStep}
              values={values}
              onUpdate={updateValue}
              resolvedHtml={resolvedHtml}
              onCopyHtml={() => copyToClipboard(resolvedHtml, 'html')}
              onCopyPreview={copyPreviewAsRichHtml}
              copiedHtml={copiedSection === 'html'}
              copiedPreview={copiedSection === 'preview'}
              iframeRef={simpleModeIframeRef}
              onIframeLoad={() => {}}
              onBackToLibrary={handleSimpleBackToLibrary}
              onSave={handleSimpleSave}
              saveSuccess={saveSuccess}
              selectedTemplateId={selectedTemplateId}
              onTemplateApply={applyTemplateWithDefaults}
            />
          )}
        </div>
        <GitHubFooter />
      </div>
    </TooltipProvider>
  );
}
