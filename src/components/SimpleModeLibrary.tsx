import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TEMPLATES, resolveTemplate } from '@/templates';
import type { SavedSignature } from '@/lib/savedSignatures';
import { copyRichHtmlToClipboard, copyTextToClipboard } from '@/utils/utils';
import {
  SIGNATURE_PREVIEW_DOC_PREFIX,
  SIGNATURE_PREVIEW_DOC_SUFFIX,
  SIGNATURE_PREVIEW_FRAME_CLASS,
} from '@/lib/signaturePreviewIframe';

interface SimpleModeLibraryProps {
  items: SavedSignature[];
  onCreateNew: () => void;
  onOpenSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function SimpleModeLibrary({
  items,
  onCreateNew,
  onOpenSaved,
  onDeleteSaved,
}: SimpleModeLibraryProps) {
  const { t } = useTranslation();
  const copySelectRefs = useRef<Record<string, HTMLSelectElement | null>>({});

  const openNativeCopySelector = (id: string) => {
    const select = copySelectRefs.current[id];
    if (!select) return;
    const picker = select as HTMLSelectElement & { showPicker?: () => void };
    if (picker.showPicker) {
      picker.showPicker();
      return;
    }
    select.focus();
    select.click();
  };

  const handleCopyChoice = async (
    choice: string,
    html: string
  ) => {
    if (choice === 'gmail') {
      await copyRichHtmlToClipboard(html);
      return;
    }
    if (choice === 'html') {
      await copyTextToClipboard(html);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 py-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{t('simpleMode.libraryTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('simpleMode.librarySubtitle')}</p>
      </div>

      <Card
        role="button"
        tabIndex={0}
        onClick={onCreateNew}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCreateNew();
          }
        }}
        className="cursor-pointer border-dashed transition-colors hover:bg-accent/40 hover:shadow-sm"
      >
        <CardContent className="flex items-center gap-3 py-5 sm:py-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="size-5" />
          </div>
          <span className="text-base font-medium">{t('simpleMode.createNew')}</span>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t('simpleMode.noSaved')}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {items.map((item) => {
            const template =
              TEMPLATES.find((tmpl) => tmpl.id === item.templateId) ?? TEMPLATES[0];
            const html = resolveTemplate(template.html, item.values);
            const title =
              item.values.NAME?.trim() ||
              t('simpleMode.untitled', {
                date: new Date(item.createdAt).toLocaleDateString(),
              });
            return (
              <li key={item.id} className="min-w-0">
                <Card
                  tabIndex={0}
                  onClick={() => onOpenSaved(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenSaved(item.id);
                    }
                  }}
                  className="flex h-full cursor-pointer flex-col gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md"
                >
                  <div className="w-full shrink-0 border-b bg-[oklch(0.98_0.005_0)]">
                    <iframe
                      title={title}
                      className={`pointer-events-none block w-full border-0 ${SIGNATURE_PREVIEW_FRAME_CLASS}`}
                      srcDoc={
                        SIGNATURE_PREVIEW_DOC_PREFIX +
                        html +
                        SIGNATURE_PREVIEW_DOC_SUFFIX
                      }
                      sandbox="allow-same-origin"
                    />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium leading-snug">{title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                        <select
                          ref={(node) => {
                            copySelectRefs.current[item.id] = node;
                          }}
                          defaultValue=""
                          className="pointer-events-none absolute h-0 w-0 opacity-0"
                          aria-label="Copy options"
                          onChange={async (e) => {
                            await handleCopyChoice(e.target.value, html);
                            e.target.value = '';
                          }}
                        >
                          <option value="" disabled hidden />
                          <option value="gmail">For Gmail</option>
                          <option value="html">Html code</option>
                        </select>
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          className="gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNativeCopySelector(item.id);
                          }}
                        >
                          <Copy className="size-3.5" />
                          Copy
                          <ChevronDown className="size-3.5" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label={t('simpleMode.delete')}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSaved(item.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
