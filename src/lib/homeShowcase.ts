import type { SignatureValues } from '@/types/types';

export interface HomeShowcaseItem {
  id: string;
  templateId: 'default' | 'minimal' | 'compact';
  templateName: string;
  company: string;
  values: SignatureValues;
}

const LOGO = {
  google:
    'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
  meta: 'https://cdn.simpleicons.org/meta/0467DF',
  revolut: 'https://cdn.simpleicons.org/revolut/0075EB',
} as const;

export const HOME_SHOWCASE_ITEMS: HomeShowcaseItem[] = [
  {
    id: 'modern-google',
    templateId: 'default',
    templateName: 'Modern',
    company: 'Google',
    values: {
      NAME: 'Sofia Martinez',
      POSITION: 'Product Marketing Manager',
      COMPANY: 'Google',
      LINKEDIN_URL: 'https://www.linkedin.com/in/sofiamartinez',
      PHONE: '+1 650 555 0142',
      EMAIL: 'sofia.martinez@google.com',
      WEBSITE: 'https://www.google.com',
      IMAGE: LOGO.google,
      DISCLAIMER: '',
    },
  },
  {
    id: 'minimal-meta',
    templateId: 'minimal',
    templateName: 'Minimal',
    company: 'Meta',
    values: {
      NAME: 'James Chen',
      POSITION: 'Engineering Director',
      COMPANY: 'Meta',
      LINKEDIN_URL: 'https://www.linkedin.com/in/jameschen',
      PHONE: '+1 650 555 0198',
      EMAIL: 'jchen@meta.com',
      WEBSITE: 'https://about.meta.com',
      IMAGE: LOGO.meta,
      DISCLAIMER: '',
    },
  },
  {
    id: 'compact-revolut',
    templateId: 'compact',
    templateName: 'Compact',
    company: 'Revolut',
    values: {
      NAME: 'Elena Kowalski',
      POSITION: 'Head of Partnerships',
      COMPANY: 'Revolut',
      LINKEDIN_URL: 'https://www.linkedin.com/in/elenakowalski',
      PHONE: '+44 20 7946 0958',
      EMAIL: 'elena.kowalski@revolut.com',
      WEBSITE: 'https://www.revolut.com',
      IMAGE: LOGO.revolut,
      DISCLAIMER: '',
    },
  },
  {
    id: 'modern-revolut',
    templateId: 'default',
    templateName: 'Modern',
    company: 'Revolut',
    values: {
      NAME: 'Daniel Okonkwo',
      POSITION: 'Growth Lead',
      COMPANY: 'Revolut',
      LINKEDIN_URL: 'https://www.linkedin.com/in/danielokonkwo',
      PHONE: '+44 20 7946 0831',
      EMAIL: 'daniel.okonkwo@revolut.com',
      WEBSITE: 'https://www.revolut.com',
      IMAGE: LOGO.revolut,
      DISCLAIMER: '',
    },
  },
  {
    id: 'minimal-google',
    templateId: 'minimal',
    templateName: 'Minimal',
    company: 'Google',
    values: {
      NAME: 'Priya Sharma',
      POSITION: 'UX Research Lead',
      COMPANY: 'Google',
      LINKEDIN_URL: 'https://www.linkedin.com/in/priyasharma',
      PHONE: '+1 650 555 0167',
      EMAIL: 'priya.sharma@google.com',
      WEBSITE: 'https://www.google.com',
      IMAGE: LOGO.google,
      DISCLAIMER: '',
    },
  },
  {
    id: 'compact-meta',
    templateId: 'compact',
    templateName: 'Compact',
    company: 'Meta',
    values: {
      NAME: 'Lucas Bernard',
      POSITION: 'Design Systems Lead',
      COMPANY: 'Meta',
      LINKEDIN_URL: 'https://www.linkedin.com/in/lucasbernard',
      PHONE: '+1 650 555 0114',
      EMAIL: 'lbernard@meta.com',
      WEBSITE: 'https://about.meta.com',
      IMAGE: LOGO.meta,
      DISCLAIMER: '',
    },
  },
  {
    id: 'modern-meta',
    templateId: 'default',
    templateName: 'Modern',
    company: 'Meta',
    values: {
      NAME: 'Amelia Torres',
      POSITION: 'Communications Manager',
      COMPANY: 'Meta',
      LINKEDIN_URL: 'https://www.linkedin.com/in/ameliatorres',
      PHONE: '+1 650 555 0133',
      EMAIL: 'amelia.torres@meta.com',
      WEBSITE: 'https://about.meta.com',
      IMAGE: LOGO.meta,
      DISCLAIMER: '',
    },
  },
  {
    id: 'minimal-revolut',
    templateId: 'minimal',
    templateName: 'Minimal',
    company: 'Revolut',
    values: {
      NAME: 'Noah Williams',
      POSITION: 'Finance Operations',
      COMPANY: 'Revolut',
      LINKEDIN_URL: 'https://www.linkedin.com/in/noahwilliams',
      PHONE: '+44 20 7946 0772',
      EMAIL: 'noah.williams@revolut.com',
      WEBSITE: 'https://www.revolut.com',
      IMAGE: LOGO.revolut,
      DISCLAIMER: '',
    },
  },
  {
    id: 'compact-google',
    templateId: 'compact',
    templateName: 'Compact',
    company: 'Google',
    values: {
      NAME: 'Hannah Lee',
      POSITION: 'Cloud Solutions Architect',
      COMPANY: 'Google',
      LINKEDIN_URL: 'https://www.linkedin.com/in/hannahlee',
      PHONE: '+1 650 555 0189',
      EMAIL: 'hannah.lee@google.com',
      WEBSITE: 'https://cloud.google.com',
      IMAGE: LOGO.google,
      DISCLAIMER: '',
    },
  },
];

export function shuffleShowcaseItems(
  items: HomeShowcaseItem[] = HOME_SHOWCASE_ITEMS
): HomeShowcaseItem[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
