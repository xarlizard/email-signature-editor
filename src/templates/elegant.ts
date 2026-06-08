import type { Template } from '../types';
import { DEFAULT_SIGNATURE_VALUES } from '../types';
import { DISCLAIMER_SNIPPET } from './disclaimerSnippet';

const HTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; color: #2c2c2c;">
  <tr>
    <td style="padding-right: 24px; vertical-align: top; border-right: 1px solid #c9a959;">
      <img src="{{IMAGE}}" role="presentation" width="100" height="100" style="display: block;">
    </td>
    <td style="padding-left: 24px; vertical-align: top;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #1a1a1a; letter-spacing: 0.5px;">{{NAME}}</p>
      <p style="margin: 0 0 2px 0; font-size: 13px; color: #5a5a5a; font-style: italic;">{{POSITION}}</p>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #3a3a3a;">{{COMPANY}}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e0e0e0; padding-top: 10px; font-size: 12px;">
        <tr><td style="padding: 4px 0;"><a href="tel:{{PHONE}}" style="color: #2c2c2c; text-decoration: none;">{{PHONE}}</a></td></tr>
        <tr><td style="padding: 4px 0;"><a href="mailto:{{EMAIL}}" style="color: #2c2c2c; text-decoration: none;">{{EMAIL}}</a></td></tr>
        <tr><td style="padding: 4px 0;"><a href="{{WEBSITE}}" style="color: #2c2c2c; text-decoration: none;">{{WEBSITE}}</a></td></tr>
        <tr><td style="padding: 4px 0;"><a href="{{LINKEDIN_URL}}" target="_blank" style="color: #2c2c2c; text-decoration: none;">LinkedIn</a></td></tr>
      </table>
    </td>
  </tr>
</table>${DISCLAIMER_SNIPPET}`;

export const ELEGANT_TEMPLATE: Template = {
  id: 'elegant',
  name: 'Elegant',
  html: HTML,
  defaultValues: { ...DEFAULT_SIGNATURE_VALUES },
};
