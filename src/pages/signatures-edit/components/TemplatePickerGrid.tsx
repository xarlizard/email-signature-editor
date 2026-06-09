import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { TEMPLATES, resolveTemplate } from '@/lib/templates';
import { DEFAULT_SIGNATURE_VALUES } from '@/types/types';
import {
  SIGNATURE_PREVIEW_DOC_PREFIX,
  SIGNATURE_PREVIEW_DOC_SUFFIX,
} from '@/lib/signaturePreviewIframe';

/** Renders signature HTML at 50% visual size (zoomed out) so cards stay compact. */
function TemplatePreviewFrame({ html }: { html: string }) {
  return (
    <div className="relative h-[88px] w-full overflow-hidden border-b bg-[oklch(0.98_0.005_0)]">
      <div className="pointer-events-none h-[176px] w-[200%] origin-top-left scale-50">
        <iframe
          title=""
          className="block h-full w-full border-0"
          srcDoc={
            SIGNATURE_PREVIEW_DOC_PREFIX + html + SIGNATURE_PREVIEW_DOC_SUFFIX
          }
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

interface TemplatePickerGridProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplatePickerGrid({
  selectedTemplateId,
  onSelectTemplate,
}: TemplatePickerGridProps) {
  const { t } = useTranslation();

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {TEMPLATES.map((template) => {
        const previewValues = {
          ...DEFAULT_SIGNATURE_VALUES,
          ...template.defaultValues,
        };
        const html = resolveTemplate(template.html, previewValues);
        const isSelected = template.id === selectedTemplateId;
        return (
          <li key={template.id} className="min-w-0">
            <Card
              role="button"
              tabIndex={0}
              onClick={() => onSelectTemplate(template.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTemplate(template.id);
                }
              }}
              className={`flex h-full cursor-pointer flex-col gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : ''
              }`}
            >
              <TemplatePreviewFrame html={html} />
              <CardContent className="p-2.5 sm:p-3">
                <p className="text-sm font-medium leading-tight">{template.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t('simpleMode.templateTapHint')}
                </p>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
