import type {
  SignatureValues,
  TemplateBuilderField,
} from '@/types/types';

export const FIELD_TO_SIGNATURE_KEY: Record<
  TemplateBuilderField,
  keyof SignatureValues
> = {
  text: 'DISCLAIMER',
  name: 'NAME',
  company: 'COMPANY',
  role: 'POSITION',
  phone: 'PHONE',
  email: 'EMAIL',
  link: 'WEBSITE',
  socials: 'LINKEDIN_URL',
};

export const SIGNATURE_KEY_TO_LABEL: Record<keyof SignatureValues, string> = {
  NAME: 'name',
  POSITION: 'position',
  COMPANY: 'company',
  LINKEDIN_URL: 'linkedinUrl',
  PHONE: 'phone',
  EMAIL: 'email',
  WEBSITE: 'website',
  IMAGE: 'image',
  DISCLAIMER: 'disclaimer',
};

export function fieldsFromRows(rows: TemplateBuilderField[][]): (keyof SignatureValues)[] {
  const keys = rows.flat().map((field) => FIELD_TO_SIGNATURE_KEY[field]);
  const unique = Array.from(new Set(keys));
  return unique;
}
