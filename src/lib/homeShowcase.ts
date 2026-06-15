import type { SignatureValues, TemplateImageConfig } from '@/types/types';

export interface HomeShowcaseItem {
  id: string;
  templateId: 'default' | 'compact';
  templateName: string;
  company: string;
  imageShape: TemplateImageConfig['shape'];
  values: SignatureValues;
}

/** Shared demo contact details — fictional, not tied to any real person or company. */
const SHOWCASE_CONTACT = {
  PHONE: '+1 555 010 0200',
  EMAIL: 'hello@example.com',
  WEBSITE: 'https://example.com',
  LINKEDIN_URL: 'https://www.linkedin.com/in/demo-profile',
} as const;

const SHOWCASE_BRANDS = [
  {
    id: 'google',
    company: 'Google',
    logo: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
    name: 'Alex Rivera',
    position: 'Product Marketing Manager',
    imageShape: 'circle',
  },
  {
    id: 'meta',
    company: 'Meta',
    logo: 'https://cdn.simpleicons.org/meta/0467DF',
    name: 'Jordan Blake',
    position: 'Engineering Director',
    imageShape: 'rounded',
  },
  {
    id: 'microsoft',
    company: 'Microsoft',
    logo: 'https://learn.microsoft.com/en-us/media/logos/logo-ms-social.png',
    name: 'Morgan Ellis',
    position: 'Enterprise Solutions Lead',
    imageShape: 'rounded',
  },
  {
    id: 'youtube',
    company: 'YouTube',
    logo: 'https://cdn.simpleicons.org/youtube/FF0000',
    name: 'Chris Nguyen',
    position: 'Content Strategy Manager',
    imageShape: 'rounded',
  },
  {
    id: 'revolut',
    company: 'Revolut',
    logo: 'https://cdn.simpleicons.org/revolut/0075EB',
    name: 'Samira Patel',
    position: 'Partnerships Lead',
    imageShape: 'rounded',
  },
] as const satisfies ReadonlyArray<{
  id: string;
  company: string;
  logo: string;
  name: string;
  position: string;
  imageShape: TemplateImageConfig['shape'];
}>;

function buildShowcaseItem(
  brand: (typeof SHOWCASE_BRANDS)[number],
  templateId: HomeShowcaseItem['templateId'],
  templateName: string
): HomeShowcaseItem {
  return {
    id: `${templateId}-${brand.id}`,
    templateId,
    templateName,
    company: brand.company,
    imageShape: brand.imageShape,
    values: {
      NAME: brand.name,
      POSITION: brand.position,
      COMPANY: brand.company,
      IMAGE: brand.logo,
      DISCLAIMER: '',
      ...SHOWCASE_CONTACT,
    },
  };
}

export const HOME_SHOWCASE_MODERN_ROW: HomeShowcaseItem[] = SHOWCASE_BRANDS.map(
  (brand) => buildShowcaseItem(brand, 'default', 'Modern')
);

export const HOME_SHOWCASE_COMPACT_ROW: HomeShowcaseItem[] = SHOWCASE_BRANDS.map(
  (brand) => buildShowcaseItem(brand, 'compact', 'Compact')
);
