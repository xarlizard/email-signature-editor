import { buildTemplateHtmlFromSchema } from '@/lib/templates/builder';
import type { NewTemplate, SignatureValues } from '@/types/types';

export const TEMPLATES: NewTemplate[] = [
  {
    id: 'default',
    name: 'Modern',
    html: '',
    config: {
      image: { url: '{{IMAGE}}', placement: 'left', size: 'md', shape: 'circle' },
      text: { font: 'Segoe UI, Arial, sans-serif', color: '#222222', size: 'md', shape: 'normal' },
    },
    rows: [['name', 'role'], ['company'], ['socials'], ['phone', 'email', 'link']],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    html: '',
    config: {
      image: { url: '{{IMAGE}}', placement: 'left', size: 'sm', shape: 'square' },
      text: { font: 'Georgia, serif', color: '#333333', size: 'md', shape: 'normal' },
    },
    rows: [['name'], ['role', 'company'], ['phone', 'email', 'link']],
  },
  {
    id: 'compact',
    name: 'Compact',
    html: '',
    config: {
      image: { url: '{{IMAGE}}', placement: 'left', size: 'sm', shape: 'rounded' },
      text: { font: 'Arial, sans-serif', color: '#333333', size: 'sm', shape: 'normal' },
    },
    rows: [['name', 'role', 'company'], ['phone', 'email', 'link', 'socials']],
  },
];

function ensureUrlProtocol(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return 'https://' + trimmed;
}

function formatDisclaimerForHtml(raw: string): string {
  if (!raw.trim()) return '';
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r\n|\r|\n/g, '<br/>');
}

export function resolveTemplate(templateHtml: string, values: SignatureValues): string {
  let result = templateHtml;
  const disclaimerRaw = typeof values.DISCLAIMER === 'string' ? values.DISCLAIMER : '';
  const processed: Record<string, string> = {
    ...values,
    WEBSITE: ensureUrlProtocol(values.WEBSITE),
    LINKEDIN_URL: ensureUrlProtocol(values.LINKEDIN_URL),
    DISCLAIMER: formatDisclaimerForHtml(disclaimerRaw),
  };

  for (const [key, value] of Object.entries(processed)) {
    result = result.split(`{{${key}}}`).join(value);
  }

  return result;
}

export function getTemplateHtml(template: NewTemplate): string {
  return buildTemplateHtmlFromSchema(template);
}

export function resolveTemplateFromSchema(template: NewTemplate, values: SignatureValues): string {
  return resolveTemplate(getTemplateHtml(template), values);
}
