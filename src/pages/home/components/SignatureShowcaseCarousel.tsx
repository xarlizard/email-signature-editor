import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TEMPLATES, resolveTemplateFromSchema } from '@/lib/templates';
import {
  HOME_SHOWCASE_COMPACT_ROW,
  HOME_SHOWCASE_MODERN_ROW,
  type HomeShowcaseItem,
} from '@/lib/homeShowcase';
import { SIGNATURE_PREVIEW_SLOT_HEIGHT } from '@/lib/signaturePreviewIframe';
import { SignaturePreviewIframe } from '@/components/SignaturePreviewIframe';
import { cn } from '@/lib/utils';

function getPreviewHtml(item: HomeShowcaseItem): string {
  const template = TEMPLATES.find((entry) => entry.id === item.templateId);
  if (!template) return '';

  const showcaseTemplate = {
    ...template,
    config: {
      ...template.config,
      image: { ...template.config.image, shape: item.imageShape },
    },
  };

  return resolveTemplateFromSchema(showcaseTemplate, item.values);
}

function ShowcasePreview({ item }: { item: HomeShowcaseItem }) {
  const previewHtml = useMemo(() => getPreviewHtml(item), [item]);

  return (
    <SignaturePreviewIframe
      html={previewHtml}
      title={`${item.templateName} signature for ${item.values.NAME}`}
      fit="content"
    />
  );
}

function ShowcaseMarqueeRow({
  items,
  direction,
  label,
  gapClassName = 'gap-10 sm:gap-12',
}: {
  items: HomeShowcaseItem[];
  direction: 'left' | 'right';
  label: string;
  gapClassName?: string;
}) {
  const track = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className={cn(
        'home-showcase-marquee flex w-max items-center',
        gapClassName,
        direction === 'right' && 'home-showcase-marquee-reverse'
      )}
      style={{ height: SIGNATURE_PREVIEW_SLOT_HEIGHT }}
      aria-label={label}
    >
      {track.map((item, index) => (
        <ShowcasePreview key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
}

export function SignatureShowcaseCarousel() {
  const { t } = useTranslation();

  return (
    <section
      className="relative w-full space-y-6 overflow-hidden"
      aria-label={t('home.showcaseAriaLabel')}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

      <ShowcaseMarqueeRow
        items={HOME_SHOWCASE_MODERN_ROW}
        direction="left"
        gapClassName="gap-25 sm:gap-28"
        label={t('home.showcaseModernAriaLabel')}
      />
      <ShowcaseMarqueeRow
        items={HOME_SHOWCASE_COMPACT_ROW}
        direction="right"
        label={t('home.showcaseCompactAriaLabel')}
      />
    </section>
  );
}
