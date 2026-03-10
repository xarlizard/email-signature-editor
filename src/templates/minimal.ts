import type { Template } from '../types';
import { DEFAULT_SIGNATURE_VALUES } from '../types';

const HTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Georgia, serif; font-size: 14px; color: #333;">
  <tr>
    <td>
      <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #111;">{{NAME}}</p>
      <p style="margin: 0 0 2px 0; color: #555;">{{POSITION}} · {{COMPANY}}</p>
      <p style="margin: 8px 0 0 0; font-size: 13px;">
        <a href="tel:{{PHONE}}" style="color: #333; text-decoration: none;">{{PHONE}}</a>
        &nbsp;|&nbsp;
        <a href="mailto:{{EMAIL}}" style="color: #333; text-decoration: none;">{{EMAIL}}</a>
        &nbsp;|&nbsp;
        <a href="{{WEBSITE}}" style="color: #333; text-decoration: none;">{{WEBSITE}}</a>
      </p>
    </td>
  </tr>
</table>`;

export const MINIMAL_TEMPLATE: Template = {
  id: 'minimal',
  name: 'Minimal',
  html: HTML,
  defaultValues: { ...DEFAULT_SIGNATURE_VALUES },
};
