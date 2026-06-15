import { useTranslation } from 'react-i18next';
import { CopyPlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LibraryCard } from '@/components/ui/LibraryCard';
import { resolveTemplateFromSchema } from '@/lib/templates';
import type { SavedTemplate } from '@/lib/savedTemplates';
import type { NewTemplate } from '@/types/types';
import { DEFAULT_SIGNATURE_VALUES } from '@/types/types';
import {
  SIGNATURE_PREVIEW_DOC_PREFIX,
  SIGNATURE_PREVIEW_DOC_SUFFIX,
  SIGNATURE_PREVIEW_FRAME_CLASS,
} from '@/lib/signaturePreviewIframe';

interface PageContentProps {
  defaultTemplates: NewTemplate[];
  savedTemplates: SavedTemplate[];
  onOpenTemplate: (id: string) => void;
  onDuplicateTemplate: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function PageContent({
  defaultTemplates,
  savedTemplates,
  onOpenTemplate,
  onDuplicateTemplate,
  onDeleteSaved,
}: PageContentProps) {
  const { t } = useTranslation();

  const renderTemplateCard = (
    item: NewTemplate | SavedTemplate,
    isBuiltin: boolean
  ) => {
    const html = resolveTemplateFromSchema(item, DEFAULT_SIGNATURE_VALUES);
    const title = item.name?.trim() || t('templates.untitled');

    return (
      <LibraryCard
        key={item.id}
        content={
          <div className="w-full shrink-0 border-b bg-[oklch(0.98_0.005_0)]">
            <iframe
              title={title}
              className={`pointer-events-none block w-full border-0 ${SIGNATURE_PREVIEW_FRAME_CLASS}`}
              srcDoc={SIGNATURE_PREVIEW_DOC_PREFIX + html + SIGNATURE_PREVIEW_DOC_SUFFIX}
              sandbox="allow-same-origin"
            />
          </div>
        }
        title={title}
        subtitle={isBuiltin ? t('templates.builtin') : new Date((item as SavedTemplate).createdAt).toLocaleString()}
        footerActions={
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateTemplate(item.id);
              }}
            >
              <CopyPlus className="size-3.5" />
              {t('templates.duplicate')}
            </Button>
            {!isBuiltin ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={t('templates.delete')}
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
        onClick={() => onOpenTemplate(item.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenTemplate(item.id);
          }
        }}
      />
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 py-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{t('templates.libraryTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('templates.librarySubtitle')}</p>
      </div>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.defaultSection')}</h3>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {defaultTemplates.map((item) => renderTemplateCard(item, true))}
        </ul>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.savedSection')}</h3>
        </div>
        {savedTemplates.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t('templates.noSaved')}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {savedTemplates.map((item) => renderTemplateCard(item, false))}
          </ul>
        )}
      </section>
    </div>
  );
}
