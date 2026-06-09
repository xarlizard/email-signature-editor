import { useCallback, useRef, useState } from 'react';
import { SignatureWizard } from '@/pages/signatures-edit/components/SignatureWizard';
import { useUserContext } from '@/contexts/UserContext';
import {
  copyPreviewForGmail,
  copyTextToClipboard,
} from '@/utils/utils';

export default function SignatureEditPage() {
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

  const markCopied = useCallback((section: 'html' | 'preview') => {
    setCopiedSection(section);
    window.setTimeout(() => setCopiedSection(null), 2000);
  }, []);

  const copyToClipboard = useCallback(async (text: string, section: 'html' | 'preview') => {
    await copyTextToClipboard(text);
    markCopied(section);
  }, [markCopied]);

  const copyPreviewAsRichHtml = useCallback(async () => {
    await copyPreviewForGmail(iframeRef.current, resolvedHtml);
    markCopied('preview');
  }, [markCopied, resolvedHtml]);

  return (
    <SignatureWizard
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
      onSave={saveSignature}
      saveSuccess={saveSuccess}
      selectedTemplateId={selectedTemplateId}
      onTemplateApply={applyTemplateWithDefaults}
    />
  );
}
