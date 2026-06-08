import type { SignatureValues, Template } from '../types';
import { DEFAULT_SIGNATURE_VALUES } from '../types';
import { DISCLAIMER_SNIPPET } from './disclaimerSnippet';

const ICON = (src: string, alt: string) =>
  `<span style="display: inline-block; background-color: rgb(34, 34, 34);"><img src="${src}" alt="${alt}" width="13" style="display: block; background-color: rgb(34, 34, 34);"></span>`;

const DEFAULT_TEMPLATE_HTML = `<table cellpadding="0" cellspacing="0" border="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
  <tr>
    <td style="vertical-align: top; text-align: center;">
      <img src="{{IMAGE}}" role="presentation" width="130" style="display: block; max-width: 128px;">
    </td>
    <td width="46"><div></div></td>
    <td style="padding: 0; vertical-align: middle;">
      <h2 style="margin: 0; font-size: 18px; color: rgb(34, 34, 34); font-weight: 600;">
        <span>{{NAME}}</span>
        <span style="display: inline-block; vertical-align: middle; margin-left: 8px;">
          <a href="{{LINKEDIN_URL}}" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="18" height="18" style="display: block; border: 0;" alt="LinkedIn">
          </a>
        </span>
      </h2>
      <p style="margin: 0; color: rgb(34, 34, 34); font-size: 14px; line-height: 22px;">{{POSITION}}</p>
      <p style="margin: 0; font-weight: 500; color: rgb(34, 34, 34); font-size: 14px; line-height: 22px;">{{COMPANY}}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; font-family: Arial;">
        <tr><td height="30"></td></tr>
        <tr><td height="1" style="width: 100%; border-bottom: 1px solid rgb(34, 34, 34); border-left: none; display: block;"></td></tr>
        <tr><td height="30"></td></tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial;">
        <tr height="25" style="vertical-align: middle;">
          <td width="30" style="vertical-align: bottom;">${ICON('https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/phone-icon-2x.png', 'mobilePhone')}</td>
          <td style="padding: 0; color: rgb(34, 34, 34);"><a href="tel:{{PHONE}}" style="text-decoration: none; color: rgb(34, 34, 34); font-size: 14px;">{{PHONE}}</a></td>
        </tr>
        <tr height="25" style="vertical-align: middle;">
          <td width="30" style="vertical-align: bottom;">${ICON('https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png', 'emailAddress')}</td>
          <td style="padding: 0;"><a href="mailto:{{EMAIL}}" style="text-decoration: none; color: rgb(34, 34, 34); font-size: 14px;">{{EMAIL}}</a></td>
        </tr>
        <tr height="25" style="vertical-align: middle;">
          <td width="30" style="vertical-align: bottom;">${ICON('https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/link-icon-2x.png', 'website')}</td>
          <td style="padding: 0;"><a href="{{WEBSITE}}" style="text-decoration: none; color: rgb(34, 34, 34); font-size: 14px;">{{WEBSITE}}</a></td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0"><tr><td height="30"></td></tr></table>
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
