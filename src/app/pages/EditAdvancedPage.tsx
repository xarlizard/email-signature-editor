import { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { HtmlPanel } from '@/components/HtmlPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { ValuesForm } from '@/components/ValuesForm';
import { useUserContext } from '@/app/contexts/UserContext';
import {
  copyPreviewForGmail,
  copyTextToClipboard,
} from '@/utils/utils';

export function EditAdvancedPage() {
  const {
    layoutVertical,
    resolvedHtml,
    setTemplateHtml,
    templateHtml,
    updateValue,
    values,
  } = useUserContext();
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [copiedSection, setCopiedSection] = useState<'html' | 'preview' | null>(null);

  const markCopied = useCallback((section: 'html' | 'preview') => {
    setCopiedSection(section);
    window.setTimeout(() => setCopiedSection(null), 2000);
  }, []);

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
      const timer = window.setTimeout(resizePreviewToContent, 50);
      return () => window.clearTimeout(timer);
    }
    resizePreviewToContent();
  }, [layoutVertical, resolvedHtml, resizePreviewToContent]);

  const copyToClipboard = useCallback(async (text: string, section: 'html' | 'preview') => {
    await copyTextToClipboard(text);
    markCopied(section);
  }, [markCopied]);

  const copyPreviewAsRichHtml = useCallback(async () => {
    await copyPreviewForGmail(previewIframeRef.current, resolvedHtml);
    markCopied('preview');
  }, [markCopied, resolvedHtml]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
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
                onIframeLoad={resizePreviewToContent}
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
                onIframeLoad={resizePreviewToContent}
              />
            </Panel>
          </Group>
        )}
      </div>
    </div>
  );
}
