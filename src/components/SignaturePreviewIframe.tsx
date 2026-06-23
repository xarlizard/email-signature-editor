import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  SIGNATURE_PREVIEW_DOC_PREFIX,
  SIGNATURE_PREVIEW_DOC_SUFFIX,
  SIGNATURE_PREVIEW_MAX_WIDTH,
  SIGNATURE_PREVIEW_MIN_WIDTH,
  SIGNATURE_PREVIEW_SLOT_HEIGHT,
  measureSignaturePreviewSize,
} from '@/lib/signaturePreviewIframe';

interface SignaturePreviewIframeProps {
  html: string;
  title: string;
  slotHeight?: number;
  /** `container` fills library cards; `content` sizes to the signature (marquee). */
  fit?: 'container' | 'content';
  className?: string;
}

export const SignaturePreviewIframe = forwardRef<
  HTMLIFrameElement,
  SignaturePreviewIframeProps
>(function SignaturePreviewIframe(
  {
    html,
    title,
    slotHeight = SIGNATURE_PREVIEW_SLOT_HEIGHT,
    fit = 'container',
    className,
  },
  forwardedRef
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const setIframeRef = useCallback(
    (node: HTMLIFrameElement | null) => {
      iframeRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );
  const [containerWidth, setContainerWidth] = useState(SIGNATURE_PREVIEW_MAX_WIDTH);
  const [previewSize, setPreviewSize] = useState({
    width: SIGNATURE_PREVIEW_MIN_WIDTH,
    height: 140,
  });

  const resizePreview = useCallback(() => {
    const maxWidth =
      fit === 'content'
        ? SIGNATURE_PREVIEW_MAX_WIDTH
        : Math.min(
            containerRef.current?.clientWidth ?? SIGNATURE_PREVIEW_MAX_WIDTH,
            SIGNATURE_PREVIEW_MAX_WIDTH
          );
    const next = measureSignaturePreviewSize(iframeRef.current, maxWidth);
    setPreviewSize((current) =>
      current.width === next.width && current.height === next.height
        ? current
        : next
    );
  }, [fit]);

  useEffect(() => {
    if (fit !== 'container') return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setContainerWidth(
        Math.min(container.clientWidth, SIGNATURE_PREVIEW_MAX_WIDTH)
      );
    });
    observer.observe(container);
    setContainerWidth(Math.min(container.clientWidth, SIGNATURE_PREVIEW_MAX_WIDTH));

    return () => observer.disconnect();
  }, [fit]);

  useEffect(() => {
    const timer = window.setTimeout(resizePreview, 50);
    return () => window.clearTimeout(timer);
  }, [html, fit === 'container' ? containerWidth : null, resizePreview]);

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
  }, [html, resizePreview]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex items-center justify-center overflow-hidden bg-transparent',
        fit === 'container' ? 'w-full px-4' : 'w-max shrink-0 px-0',
        className
      )}
      style={{ height: slotHeight }}
    >
      <iframe
        ref={setIframeRef}
        title={title}
        className={cn(
          'pointer-events-none block shrink-0 border-0 bg-transparent',
          fit === 'container' && 'max-w-full'
        )}
        onLoad={resizePreview}
        style={{
          width: previewSize.width,
          height: previewSize.height,
        }}
        srcDoc={SIGNATURE_PREVIEW_DOC_PREFIX + html + SIGNATURE_PREVIEW_DOC_SUFFIX}
        sandbox="allow-same-origin"
      />
    </div>
  );
});
