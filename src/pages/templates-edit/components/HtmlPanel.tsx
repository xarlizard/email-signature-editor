import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { Copy, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';
import { normalizeBuilderVariablesToLegacy } from '@/lib/templates/builder';

interface HtmlPanelProps {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  copied: boolean;
}

export function HtmlPanel({ value, onChange, onCopy, copied }: HtmlPanelProps) {
  const { t } = useTranslation();
  const { darkMode } = useUserContext();

  return (
    <div className="flex min-h-[30rem] flex-1 flex-col overflow-hidden">
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
      <div className="editor-panel min-h-0 flex-1">
        <Editor
          theme={darkMode ? "vs-dark" : "vs-light"}
          height="100%"
          defaultLanguage="html"
          value={value}
          onChange={(newValue) => onChange(normalizeBuilderVariablesToLegacy(newValue || ''))}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
            lineNumbers: 'on',
            wordWrap: 'on',
            formatOnPaste: false,
            formatOnType: false,
          }}
        />
      </div>
    </div>
  );
}
