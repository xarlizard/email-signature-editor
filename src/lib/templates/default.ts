import type { SignatureValues, Template } from '@/types/types';
import { DEFAULT_SIGNATURE_VALUES } from '@/types/types';
import { DISCLAIMER_SNIPPET } from '@/lib/templates/disclaimerSnippet';

const DEFAULT_TEMPLATE_HTML =  `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;">
  <tr>
    <td style="padding-right: 20px; vertical-align: top;">
      <img src="{{IMAGE}}" role="presentation" width="80" height="80" style="display: block; border-radius: 50%; object-fit: cover;">
    </td>
    <td>
      <p style="margin: 0 0 2px 0; font-size: 18px; font-weight: 700; color: #1a1a2e;">{{NAME}}</p>
      <p style="margin: 0 0 4px 0; font-size: 13px; color: #4a4a6a;">{{POSITION}}</p>
      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #16213e;">{{COMPANY}}</p>
      <p style="margin: 0 0 6px 0; font-size: 12px;">
        <a href="{{LINKEDIN_URL}}" target="_blank" style="color: #0a66c2; text-decoration: none;">LinkedIn</a>
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #555;">
        <tr><td style="padding: 2px 0;"><a href="tel:{{PHONE}}" style="color: #555; text-decoration: none;">{{PHONE}}</a></td></tr>
        <tr><td style="padding: 2px 0;"><a href="mailto:{{EMAIL}}" style="color: #555; text-decoration: none;">{{EMAIL}}</a></td></tr>
        <tr><td style="padding: 2px 0;"><a href="{{WEBSITE}}" style="color: #555; text-decoration: none;">{{WEBSITE}}</a></td></tr>
      </table>
    </td>
  </tr>
</table>${DISCLAIMER_SNIPPET}`;

export const DEFAULT_TEMPLATE: Template = {
    id: 'default',
    name: 'Default',
    html: DEFAULT_TEMPLATE_HTML,
    defaultValues: { ...DEFAULT_SIGNATURE_VALUES },
};

function ensureUrlProtocol(url: string): string {
    if (!url) return url;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    return 'https://' + trimmed;
}

/** Plain-text disclaimer → safe HTML for table cell; newlines → `<br/>`. */
function formatDisclaimerForHtml(raw: string): string {
    if (!raw.trim()) return '';
    return raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\r\n|\r|\n/g, '<br/>');
}

export function resolveTemplate(
    templateHtml: string,
    values: SignatureValues
): string {
    const disclaimerRaw =
        typeof values.DISCLAIMER === 'string' ? values.DISCLAIMER : '';
    let result = templateHtml;
    if (!disclaimerRaw.trim()) {
        result = result.split(DISCLAIMER_SNIPPET).join('');
    }

    const processed: Record<string, string> = {
        ...values,
        WEBSITE: ensureUrlProtocol(values.WEBSITE),
        LINKEDIN_URL: ensureUrlProtocol(values.LINKEDIN_URL),
    };
    if (disclaimerRaw.trim()) {
        processed.DISCLAIMER = formatDisclaimerForHtml(disclaimerRaw);
    } else {
        delete processed.DISCLAIMER;
    }

    for (const [key, value] of Object.entries(processed)) {
        const placeholder = `{{${key}}}`;
        result = result.split(placeholder).join(value);
    }
    return result;
}
