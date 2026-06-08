import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { SimpleModeWizard } from '@/components/SimpleModeWizard';
import { useUserContext } from '@/app/contexts/UserContext';
import { HOME_ROUTE } from '@/app/routes/paths';

export function EditPage() {
  const navigate = useNavigate();
  const {
    applyTemplateWithDefaults,
    resolvedHtml,
    saveSignature,
    saveSuccess,
    selectedTemplateId,
    setSimpleStep,
    simpleStep,
    updateValue,
    values,
  } = useUserContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copiedSection, setCopiedSection] = useState<'html' | 'preview' | null>(null);

  const copyToClipboard = useCallback(async (text: string, section: 'html' | 'preview') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      window.setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedSection(section);
      window.setTimeout(() => setCopiedSection(null), 2000);
    }
  }, []);

  const copyPreviewAsRichHtml = useCallback(async () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) {
      try {
        iframeRef.current?.contentWindow?.focus();
        const selection = doc.defaultView?.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const range = doc.createRange();
          range.selectNodeContents(doc.body);
          selection.addRange(range);
          doc.execCommand('copy');
          selection.removeAllRanges();
          setCopiedSection('preview');
          window.setTimeout(() => setCopiedSection(null), 2000);
          return;
        }
      } catch {
        // fall through
      }
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([resolvedHtml], { type: 'text/html' }),
          'text/plain': new Blob([resolvedHtml.replace(/<[^>]*>/g, '')], {
            type: 'text/plain',
          }),
        }),
      ]);
      setCopiedSection('preview');
      window.setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      copyToClipboard(resolvedHtml, 'preview');
    }
  }, [copyToClipboard, resolvedHtml]);

  return (
    <SimpleModeWizard
      step={simpleStep}
      onStepChange={setSimpleStep}
      values={values}
      onUpdate={updateValue}
      resolvedHtml={resolvedHtml}
      onCopyHtml={() => copyToClipboard(resolvedHtml, 'html')}
      onCopyPreview={copyPreviewAsRichHtml}
      copiedHtml={copiedSection === 'html'}
      copiedPreview={copiedSection === 'preview'}
      iframeRef={iframeRef}
      onIframeLoad={() => {}}
      onBackToLibrary={() => navigate(HOME_ROUTE)}
      onSave={saveSignature}
      saveSuccess={saveSuccess}
      selectedTemplateId={selectedTemplateId}
      onTemplateApply={applyTemplateWithDefaults}
    />
  );
}
