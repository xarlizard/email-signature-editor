import type { Template } from '../types';
import { COMPACT_TEMPLATE } from './compact';
import { DEFAULT_TEMPLATE } from './default';
import { MINIMAL_TEMPLATE } from './minimal';

export const TEMPLATES: Template[] = [
  DEFAULT_TEMPLATE,
  MINIMAL_TEMPLATE,
  COMPACT_TEMPLATE,
];

export { DEFAULT_TEMPLATE } from './default';
export { resolveTemplate } from './default';
