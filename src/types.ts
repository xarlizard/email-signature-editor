export const TEMPLATE_VARIABLES = [
  'NAME',
  'POSITION',
  'COMPANY',
  'LINKEDIN_URL',
  'PHONE',
  'EMAIL',
  'WEBSITE',
  'IMAGE',
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
}

export const DEFAULT_SIGNATURE_VALUES: SignatureValues = {
  NAME: 'Your Name',
  POSITION: 'Your Position',
  COMPANY: 'Your company',
  LINKEDIN_URL: 'https://www.linkedin.com/in/username',
  PHONE: '+34000000000',
  EMAIL: 'demo@email.com',
  WEBSITE: 'https://www.demo.com',
  IMAGE: 'https://content.timbal.ai/assets/email-signature.png',
};

export interface Template {
  id: string;
  name: string;
  html: string;
  defaultValues: SignatureValues;
}
