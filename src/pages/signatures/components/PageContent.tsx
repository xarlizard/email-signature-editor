import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LibraryCard } from '@/components/ui/LibraryCard';
import { resolveTemplateFromSchema } from '@/lib/templates';
import type { SavedSignature } from '@/lib/savedSignatures';
import { useUserContext } from '@/contexts/UserContext';
import { copyRichHtmlToClipboard, copyTextToClipboard } from '@/utils/utils';
import {
  SIGNATURE_PREVIEW_DOC_PREFIX,
  SIGNATURE_PREVIEW_DOC_SUFFIX,
  SIGNATURE_PREVIEW_FRAME_CLASS,
} from '@/lib/signaturePreviewIframe';

interface PageContentProps {
  items: SavedSignature[];
  onCreateNew: () => void;
  onOpenSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function PageContent({
  items,
  onCreateNew,
  onOpenSaved,
  onDeleteSaved,
}: PageContentProps) {
  const { t } = useTranslation();
  const { templates } = useUserContext();
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
        <h2 className="text-lg font-semibold tracking-tight">{t('signatures.libraryTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('signatures.librarySubtitle')}</p>
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
          <span className="text-base font-medium">{t('signatures.createNew')}</span>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t('signatures.noSaved')}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {items.map((item) => {
            const template =
              templates.find((tmpl) => tmpl.id === item.templateId) ?? templates[0];
            if (!template) return null;
            const html = resolveTemplateFromSchema(template, item.values);
            const title =
              item.values.NAME?.trim() ||
              t('signatures.untitled', {
                date: new Date(item.createdAt).toLocaleDateString(),
              });

            return (
              <LibraryCard
                key={item.id}
                content={
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
                }
                title={title}
                subtitle={new Date(item.createdAt).toLocaleString()}
                footerActions={
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="relative">
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
                    {!isBuiltin_Placeholder ? ( // Note: Adjusted for logic based on signature page context, as all are saved items
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label={t('signatures.delete')}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSaved(item.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                }
                onClick={() => onOpenSaved(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenSaved(item.id);
                  }
                }}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Helper to handle "builtin" status for signatures since it's not explicitly in SavedSignature type like NewTemplate
const isBuiltin_Placeholder = false;