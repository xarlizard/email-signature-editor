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

export const TEMPLATE_BUILDER_FIELDS = [
  'text',
  'name',
  'company',
  'role',
  'phone',
  'email',
  'link',
  'socials',
] as const;

export type TemplateBuilderField = (typeof TEMPLATE_BUILDER_FIELDS)[number];

export type TemplateRows = TemplateBuilderField[][];

export interface TemplateImageConfig {
  url: string;
  placement: 'left' | 'right' | 'top';
  size: 'sm' | 'md' | 'lg';
  shape: 'rounded' | 'circle' | 'square';
}

export interface TemplateTextConfig {
  font: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  shape: 'normal' | 'uppercase' | 'italic';
}

export interface NewTemplate {
  id: string;
  name: string;
  html: string;
  config: {
    image: TemplateImageConfig;
    text: TemplateTextConfig;
  };
  rows: TemplateRows;
}

export const DEFAULT_NEW_TEMPLATE: Omit<NewTemplate, 'id' | 'name' | 'html'> = {
  config: {
    image: {
      url: '{{IMAGE}}',
      placement: 'left',
      size: 'md',
      shape: 'rounded',
    },
    text: {
      font: 'Arial, sans-serif',
      color: '#222222',
      size: 'md',
      shape: 'normal',
    },
  },
  rows: [['name', 'role'], ['company'], ['phone', 'email', 'link']],
};