import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewPanelProps {
  resolvedHtml: string;
  onCopy: () => void;
  copied: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export function PreviewPanel({
  resolvedHtml,
  onCopy,
  copied,
  iframeRef,
}: PreviewPanelProps) {
  const { t } = useTranslation();

  const autoResize = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument?.body) return;
    try {
      const doc = iframe.contentDocument;
      const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      iframe.style.height = `${height}px`;
    } catch {
      // cross-origin safety
    }
  }, [iframeRef]);

  useEffect(() => {
    const timer = window.setTimeout(autoResize, 50);
    return () => window.clearTimeout(timer);
  }, [resolvedHtml, autoResize]);

  return (
    <div className="flex flex-col">
      <div className="panel-header panel-header-preview flex shrink-0 items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-2">
          <Eye className="size-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider">
            {t('labels.preview')}
          </h2>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={onCopy}
          className="h-7 shrink-0 gap-1.5"
        >
          <Copy className="size-3.5" />
          {copied ? t('actions.copied') : t('actions.copy')}
        </Button>
      </div>
      <div className="overflow-hidden">
        <iframe
          ref={iframeRef}
          title={t('templateEditor.previewTitle')}
          className="block w-full border-0"
          onLoad={autoResize}
          srcDoc={
            '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:Arial,sans-serif;}</style></head><body>' +
            resolvedHtml +
            '</body></html>'
          }
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
