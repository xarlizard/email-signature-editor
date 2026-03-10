import { useTranslation } from 'react-i18next';
import Editor from 'react-simple-code-editor';
import { Copy, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { highlightTemplateVariables } from '@/utils/highlight';

interface HtmlPanelProps {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  copied: boolean;
}

export function HtmlPanel({ value, onChange, onCopy, copied }: HtmlPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="panel-header panel-header-html flex shrink-0 items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-2">
          <Code2 className="size-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider">
            {t('labels.html')}
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
      <ScrollArea className="editor-panel min-h-0 flex-1">
        <div className="min-w-full p-3">
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlightTemplateVariables}
            padding={0}
            className="html-editor min-h-[200px] w-full font-mono text-sm"
            textareaClassName="html-textarea"
            style={{
              fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
              fontSize: 13,
            }}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
