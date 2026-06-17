export const SIGNATURE_PREVIEW_DOC_PREFIX =
  '<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:max-content;min-width:0;background:transparent;}body{font-family:Arial,sans-serif;font-size:12px;}</style></head><body>';

export const SIGNATURE_PREVIEW_DOC_SUFFIX = '</body></html>';

export const SIGNATURE_PREVIEW_MIN_WIDTH = 200;
export const SIGNATURE_PREVIEW_MAX_WIDTH = 560;
export const SIGNATURE_PREVIEW_MIN_HEIGHT = 72;
export const SIGNATURE_PREVIEW_MAX_HEIGHT = 240;
export const SIGNATURE_PREVIEW_SLOT_HEIGHT = SIGNATURE_PREVIEW_MAX_HEIGHT;

export function measureSignaturePreviewSize(
  iframe: HTMLIFrameElement | null,
  maxWidth = SIGNATURE_PREVIEW_MAX_WIDTH
) {
  const doc = iframe?.contentDocument;
  if (!doc?.body) {
    return { width: SIGNATURE_PREVIEW_MIN_WIDTH, height: 140 };
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
    width: Math.min(
      maxWidth,
      Math.max(SIGNATURE_PREVIEW_MIN_WIDTH, measuredWidth)
    ),
    height: Math.min(
      SIGNATURE_PREVIEW_MAX_HEIGHT,
      Math.max(SIGNATURE_PREVIEW_MIN_HEIGHT, measuredHeight)
    ),
  };
}
