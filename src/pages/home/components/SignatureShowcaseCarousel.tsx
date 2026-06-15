import { useMemo } from 'react';
import { TEMPLATES, resolveTemplateFromSchema } from '@/lib/templates';
import {
  HOME_SHOWCASE_ITEMS,
  shuffleShowcaseItems,
  type HomeShowcaseItem,
} from '@/lib/homeShowcase';
import {
  SIGNATURE_PREVIEW_DOC_PREFIX,
  SIGNATURE_PREVIEW_DOC_SUFFIX,
} from '@/lib/signaturePreviewIframe';

function getPreviewHtml(item: HomeShowcaseItem): string {
  const template = TEMPLATES.find((entry) => entry.id === item.templateId);
  if (!template) return '';
  return resolveTemplateFromSchema(template, item.values);
}

function ShowcaseCard({ item }: { item: HomeShowcaseItem }) {
  return (
    <article className="flex w-[min(88vw,320px)] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {item.templateName}
        </p>
        <p className="truncate text-sm text-foreground">{item.values.NAME}</p>
        <p className="truncate text-xs text-muted-foreground">{item.company}</p>
      </div>
      <div className="h-[200px] bg-[oklch(0.98_0.005_0)] p-3">
        <iframe
          title={`${item.templateName} signature for ${item.values.NAME}`}
          className="h-full w-full border-0"
          loading="lazy"
          srcDoc={
            SIGNATURE_PREVIEW_DOC_PREFIX +
            getPreviewHtml(item) +
            SIGNATURE_PREVIEW_DOC_SUFFIX
          }
          sandbox="allow-same-origin"
        />
      </div>
    </article>
  );
}

export function SignatureShowcaseCarousel() {
  const items = useMemo(() => shuffleShowcaseItems(HOME_SHOWCASE_ITEMS), []);
  const track = useMemo(() => [...items, ...items], [items]);

  return (
    <section
      className="relative w-full overflow-hidden py-2"
      aria-label="Scrolling signature examples"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

      <div className="home-showcase-marquee flex w-max gap-4 sm:gap-5">
        {track.map((item, index) => (
          <ShowcaseCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}
