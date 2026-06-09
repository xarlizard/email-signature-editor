export const TEMPLATE_VARIABLES = [
  'NAME',
  'POSITION',
  'COMPANY',
  'LINKEDIN_URL',
  'PHONE',
  'EMAIL',
  'WEBSITE',
  'IMAGE',
  'DISCLAIMER',
] as const;

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];

export interface SignatureValues {
  NAME: string;
  POSITION: string;
  COMPANY: string;
  LINKEDIN_URL: string;
  PHONE: string;
  EMAIL: string;
  WEBSITE: string;
  IMAGE: string;
  /** Optional legal / informational text below the signature (plain text, line breaks preserved). */
  DISCLAIMER: string;
}

export const DEFAULT_SIGNATURE_VALUES: SignatureValues = {
  NAME: 'Your Name',
  POSITION: 'Your Position',
  COMPANY: 'Your company',
  LINKEDIN_URL: 'https://www.linkedin.com/in/username',
  PHONE: '+34000000000',
  EMAIL: 'demo@email.com',
  WEBSITE: 'https://www.demo.com',
  IMAGE: 'https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png',
  DISCLAIMER: '',
};

export interface Template {
  id: string;
  name: string;
  html: string;
  defaultValues: SignatureValues;
}
