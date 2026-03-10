import type { Template } from '../types';
import { DEFAULT_SIGNATURE_VALUES } from '../types';

const HTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;">
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
</table>`;

export const MODERN_TEMPLATE: Template = {
  id: 'modern',
  name: 'Modern',
  html: HTML,
  defaultValues: { ...DEFAULT_SIGNATURE_VALUES },
};
