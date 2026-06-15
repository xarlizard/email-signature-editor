import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TEMPLATES, resolveTemplateFromSchema } from '@/lib/templates';
import {
  HOME_SHOWCASE_COMPACT_ROW,
  HOME_SHOWCASE_MODERN_ROW,
  type HomeShowcaseItem,
} from '@/lib/homeShowcase';
import { cn } from '@/lib/utils';

const SHOWCASE_PREVIEW_DOC_PREFIX =
  '<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:max-content;min-width:0;background:transparent;}body{font-family:Arial,sans-serif;font-size:12px;}</style></head><body>';

const SHOWCASE_PREVIEW_DOC_SUFFIX = '</body></html>';

const MIN_PREVIEW_WIDTH = 200;
const MAX_PREVIEW_WIDTH = 560;
const MIN_PREVIEW_HEIGHT = 72;
const MAX_PREVIEW_HEIGHT = 240;

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

function measurePreviewSize(iframe: HTMLIFrameElement | null) {
  const doc = iframe?.contentDocument;
  if (!doc?.body) {
    return { width: MIN_PREVIEW_WIDTH, height: 140 };
  }

  const table = doc.querySelector('table');
  const measuredWidth = Math.ceil(
    Math.max(
      table?.getBoundingClientRect().width ?? 0,
      doc.body.scrollWidth,
      doc.documentElement.scrollWidth
    )
  );
  const measuredHeight = Math.ceil(
    table?.getBoundingClientRect().height ??
      Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)
  );

  return {
    width: Math.min(MAX_PREVIEW_WIDTH, Math.max(MIN_PREVIEW_WIDTH, measuredWidth)),
    height: Math.min(
      MAX_PREVIEW_HEIGHT,
      Math.max(MIN_PREVIEW_HEIGHT, measuredHeight)
    ),
  };
}

function ShowcasePreview({ item }: { item: HomeShowcaseItem }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewSize, setPreviewSize] = useState({
    width: MIN_PREVIEW_WIDTH,
    height: 140,
  });

  const resizePreview = useCallback(() => {
    setPreviewSize(measurePreviewSize(iframeRef.current));
  }, []);

  const previewHtml = useMemo(() => getPreviewHtml(item), [item]);

  useEffect(() => {
    const timer = window.setTimeout(resizePreview, 50);
    return () => window.clearTimeout(timer);
  }, [previewHtml, resizePreview]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;

    const images = Array.from(doc.querySelectorAll('img'));
    images.forEach((image) => {
      image.addEventListener('load', resizePreview);
      image.addEventListener('error', resizePreview);
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', resizePreview);
        image.removeEventListener('error', resizePreview);
      });
    };
  }, [previewHtml, resizePreview]);

  return (
    <iframe
      ref={iframeRef}
      title={`${item.templateName} signature for ${item.values.NAME}`}
      className="block max-w-[min(92vw,560px)] shrink-0 border-0 bg-transparent"
      loading="lazy"
      onLoad={resizePreview}
      style={{
        width: previewSize.width,
        height: previewSize.height,
      }}
      srcDoc={
        SHOWCASE_PREVIEW_DOC_PREFIX + previewHtml + SHOWCASE_PREVIEW_DOC_SUFFIX
      }
      sandbox="allow-same-origin"
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
        'home-showcase-marquee flex w-max items-start',
        gapClassName,
        direction === 'right' && 'home-showcase-marquee-reverse'
      )}
      aria-label={label}
    >
      {track.map((item, index) => (
        <ShowcasePreview key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
}

export function SignatureShowcaseCarousel() {
  return (
    <section
      className="relative w-full space-y-10 overflow-hidden py-2 sm:space-y-12"
      aria-label="Scrolling signature examples"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

      <ShowcaseMarqueeRow
        items={HOME_SHOWCASE_MODERN_ROW}
        direction="left"
        gapClassName="gap-25 sm:gap-28"
        label="Modern template signature examples"
      />
      <ShowcaseMarqueeRow
        items={HOME_SHOWCASE_COMPACT_ROW}
        direction="right"
        label="Compact template signature examples"
      />
    </section>
  );
}
