import type { Template } from '../types';
import { DEFAULT_SIGNATURE_VALUES } from '../types';

const HTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 12px; color: #333;">
  <tr>
    <td style="vertical-align: middle; padding-right: 12px;">
      <img src="{{IMAGE}}" role="presentation" width="48" height="48" style="display: block; border-radius: 4px;">
    </td>
    <td style="vertical-align: middle;">
      <span style="font-weight: 700; font-size: 14px;">{{NAME}}</span>
      <span style="color: #666;"> · {{POSITION}} at {{COMPANY}}</span>
      <br>
      <span style="font-size: 11px;">
        <a href="tel:{{PHONE}}" style="color: #0066cc; text-decoration: none;">{{PHONE}}</a>
        <span style="color: #ccc;">|</span>
        <a href="mailto:{{EMAIL}}" style="color: #0066cc; text-decoration: none;">{{EMAIL}}</a>
        <span style="color: #ccc;">|</span>
        <a href="{{WEBSITE}}" style="color: #0066cc; text-decoration: none;">{{WEBSITE}}</a>
        <span style="color: #ccc;">|</span>
        <a href="{{LINKEDIN_URL}}" target="_blank" style="color: #0066cc; text-decoration: none;">in</a>
      </span>
    </td>
  </tr>
</table>`;

export const COMPACT_TEMPLATE: Template = {
  id: 'compact',
  name: 'Compact',
  html: HTML,
  defaultValues: { ...DEFAULT_SIGNATURE_VALUES },
};
