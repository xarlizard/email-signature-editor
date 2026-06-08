import type { Template } from '../types';
import { DEFAULT_SIGNATURE_VALUES } from '../types';
import { DISCLAIMER_SNIPPET } from './disclaimerSnippet';

const HTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px;">
  <tr>
    <td style="background-color: #1e3a5f; padding: 20px 24px; vertical-align: top;">
      <img src="{{IMAGE}}" role="presentation" width="90" height="90" style="display: block; border-radius: 8px; border: 3px solid #fff;">
    </td>
    <td style="background-color: #1e3a5f; padding: 20px 24px; color: #fff; vertical-align: top;">
      <p style="margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: #fff;">{{NAME}}</p>
      <p style="margin: 0 0 2px 0; font-size: 14px; color: #a8c5e8;">{{POSITION}}</p>
      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">{{COMPANY}}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
        <tr><td style="padding: 3px 0;"><a href="tel:{{PHONE}}" style="color: #fff; text-decoration: none;">{{PHONE}}</a></td></tr>
        <tr><td style="padding: 3px 0;"><a href="mailto:{{EMAIL}}" style="color: #fff; text-decoration: none;">{{EMAIL}}</a></td></tr>
        <tr><td style="padding: 3px 0;"><a href="{{WEBSITE}}" style="color: #fff; text-decoration: none;">{{WEBSITE}}</a></td></tr>
        <tr><td style="padding: 3px 0;"><a href="{{LINKEDIN_URL}}" target="_blank" style="color: #fff; text-decoration: none;">LinkedIn</a></td></tr>
      </table>
    </td>
  </tr>
</table>${DISCLAIMER_SNIPPET}`;

export const BOLD_TEMPLATE: Template = {
  id: 'bold',
  name: 'Bold',
  html: HTML,
  defaultValues: { ...DEFAULT_SIGNATURE_VALUES },
};
