import type {
  NewTemplate,
  TemplateImageConfig,
  TemplateRowField,
  TemplateRows,
  TemplateTextConfig,
} from '@/types/types';
import { resolveFieldText } from '@/lib/templateRows';

const FIELD_TO_VARIABLE: Record<TemplateRowField['label'], string> = {
  text: '{{DISCLAIMER}}',
  name: '{{NAME}}',
  company: '{{COMPANY}}',
  role: '{{POSITION}}',
  phone: '{{PHONE}}',
  email: '{{EMAIL}}',
  link: '{{WEBSITE}}',
  socials: '{{LINKEDIN_URL}}',
};

const IMAGE_SIZE: Record<TemplateImageConfig['size'], number> = {
  xs: 40,
  sm: 56,
  md: 80,
  lg: 112,
};

const TEXT_SIZE: Record<TemplateTextConfig['size'], number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
};

function imageRadius(shape: TemplateImageConfig['shape']): string {
  if (shape === 'circle') return '50%';
  if (shape === 'square') return '0';
  return '8px';
}

function textFontWeight(shape: TemplateTextConfig['shape']): string {
  return shape === 'bold' ? 'bold' : 'normal';
}

function textFontStyle(shape: TemplateTextConfig['shape']): string {
  return shape === 'italic' ? 'italic' : 'normal';
}

function templateTextStyle(text: TemplateTextConfig, fontSize: number): string {
  return `color:${text.color};font-family:${text.font};font-size:${fontSize}px;font-weight:${textFontWeight(text.shape)};font-style:${textFontStyle(text.shape)};`;
}

function fieldTextStyle(text: TemplateTextConfig): string {
  return templateTextStyle(text, TEXT_SIZE[text.size]);
}

function renderField(
  field: TemplateRowField,
  templateText: TemplateTextConfig
): string {
  const token = FIELD_TO_VARIABLE[field.label];
  const style = fieldTextStyle(resolveFieldText(field, templateText));
  if (field.label === 'phone') {
    return `<a href="tel:${token}" style="text-decoration:none;${style}">${token}</a>`;
  }
  if (field.label === 'email') {
    return `<a href="mailto:${token}" style="text-decoration:none;${style}">${token}</a>`;
  }
  if (field.label === 'link') {
    return `<a href="${token}" style="text-decoration:none;${style}">${token}</a>`;
  }
  if (field.label === 'socials') {
    return `<a href="${token}" target="_blank" style="text-decoration:none;${style}">LinkedIn</a>`;
  }
  return `<span style="${style}">${token}</span>`;
}

function renderRows(rows: TemplateRows, templateText: TemplateTextConfig): string {
  return rows
    .filter((row) => row.length > 0)
    .map(
      (row) =>
        `<p style="margin:0 0 6px 0;">${row
          .map((field) => renderField(field, templateText))
          .join('<span style="opacity:.6;"> · </span>')}</p>`
    )
    .join('\n');
}

export function buildTemplateHtmlFromSchema(template: NewTemplate): string {
  const imageSize = IMAGE_SIZE[template.config.image.size];
  const fontSize = TEXT_SIZE[template.config.text.size];
  const rowsHtml = renderRows(template.rows, template.config.text);

  const imageBlock = `<img src="${template.config.image.url}" width="${imageSize}" height="${imageSize}" style="display:block;border-radius:${imageRadius(template.config.image.shape)};object-fit:cover;" />`;
  const imageCell = `<td style="vertical-align:top;padding-right:16px;">\n  ${imageBlock}\n</td>`;
  const textCell = `<td style="vertical-align:top;${templateTextStyle(template.config.text, fontSize)}">\n${rowsHtml}\n</td>`;

  const rowContent =
    template.config.image.placement === 'right'
      ? `${textCell}\n${imageCell}`
      : template.config.image.placement === 'top'
        ? `<td>\n  <div style="margin-bottom:12px;">\n    ${imageBlock}\n  </div>\n  <div style="${templateTextStyle(template.config.text, fontSize)}">\n${rowsHtml}\n  </div>\n</td>`
        : `${imageCell}\n${textCell}`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${template.config.text.font};">\n<tr>\n${rowContent}\n</tr>\n</table>`;
}

export function normalizeBuilderVariablesToLegacy(html: string): string {
  return html
    .replace(/{{\s*name\s*}}/gi, '{{NAME}}')
    .replace(/{{\s*company\s*}}/gi, '{{COMPANY}}')
    .replace(/{{\s*role\s*}}/gi, '{{POSITION}}')
    .replace(/{{\s*phone\s*}}/gi, '{{PHONE}}')
    .replace(/{{\s*email\s*}}/gi, '{{EMAIL}}')
    .replace(/{{\s*link\s*}}/gi, '{{WEBSITE}}')
    .replace(/{{\s*socials\s*}}/gi, '{{LINKEDIN_URL}}')
    .replace(/{{\s*text\s*}}/gi, '{{DISCLAIMER}}')
    .replace(/{{\s*image\s*}}/gi, '{{IMAGE}}');
}
